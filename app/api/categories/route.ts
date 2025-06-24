import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    console.log("Categories API called");

    const session = await getServerSession(authOptions);
    console.log("Session check:", !!session, session?.user?.role);

    if (!session || session.user.role !== "admin") {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log("Query params:", { search, page, limit, skip });

    let query: Record<string, any> = { isActive: true };
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    console.log("Fetching categories...");

    // Add timeout to database operations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database operation timeout")), 8000); // 8 second timeout
    });

    const [categories, total] = (await Promise.race([
      Promise.all([
        Category.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Category.countDocuments(query),
      ]),
      timeoutPromise,
    ])) as [any[], number];

    console.log("Categories fetched:", categories.length, "Total:", total);

    // Optimize product count queries - do it in one aggregation instead of N queries
    let categoriesWithCount = categories.map((category: any) => ({
      ...category,
      _id: category._id.toString(),
      productCount: 0, // Default to 0, will update if Product model exists
    }));

    try {
      const Product = mongoose.models.Product;
      if (Product) {
        console.log("Getting product counts...");

        // Get all product counts in one aggregation query instead of N queries
        const categoryNames = categories.map((cat) => cat.name);
        const productCounts = (await Promise.race([
          Product.aggregate([
            {
              $match: {
                category: { $in: categoryNames },
                isActive: true,
              },
            },
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
          ]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Product count timeout")), 3000)
          ),
        ])) as Array<{ _id: string; count: number }>;

        console.log("Product counts fetched:", productCounts.length);

        // Map product counts to categories
        const countMap = new Map(productCounts.map((pc) => [pc._id, pc.count]));

        categoriesWithCount = categories.map((category: any) => ({
          ...category,
          _id: category._id.toString(),
          productCount: countMap.get(category.name) || 0,
        }));
      }
    } catch (error) {
      console.log("Product count error (using 0 as fallback):", error);
      // Keep categoriesWithCount as is with productCount: 0
    }

    console.log(
      "Returning response with",
      categoriesWithCount.length,
      "categories"
    );

    return NextResponse.json({
      categories: categoriesWithCount,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Categories POST API called");

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, subcategories } = body;

    console.log("Creating category:", { name, description, subcategories });

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description.trim(),
      subcategories: subcategories || [],
    });

    await newCategory.save();

    console.log("Category created successfully:", newCategory._id);

    return NextResponse.json(
      {
        ...newCategory.toObject(),
        _id: newCategory._id.toString(),
        productCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
