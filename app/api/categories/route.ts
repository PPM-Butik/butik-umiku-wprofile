import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";

interface CategoryType {
  _id: string;
  name: string;
  description: string;
  subcategories: string[];
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== Categories API Called ===");
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    const session = await getServerSession(authOptions);
    console.log("Session result:", {
      exists: !!session,
      user: session?.user,
      role: session?.user?.role,
    });

    const isDebugMode = process.env.NODE_ENV === "development";

    if (!session) {
      if (isDebugMode) {
        console.log("⚠️ DEBUG MODE: Allowing access without session");
      } else {
        console.log("❌ No session found");
        return NextResponse.json(
          { error: "No session found" },
          { status: 401 }
        );
      }
    } else if (session.user?.role !== "admin") {
      if (isDebugMode) {
        console.log("⚠️ DEBUG MODE: Allowing non-admin access");
      } else {
        console.log("❌ User is not admin:", session.user?.role);
        return NextResponse.json(
          { error: "User is not admin" },
          { status: 403 }
        );
      }
    }

    console.log("✅ Authentication passed");

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let categories: CategoryType[] = [];
    let totalCategories = 0;

    try {
      const connection = await connectDB();

      if (!connection) {
        console.log("Database not connected - returning demo categories");
        // Demo categories when database is not connected
        const demoCategories: CategoryType[] = [
          {
            _id: "1",
            name: "Elektronik",
            description: "Perangkat elektronik dan gadget",
            subcategories: ["Smartphone", "Laptop", "Tablet"],
            productCount: 15,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "2",
            name: "Fashion",
            description: "Pakaian dan aksesoris fashion",
            subcategories: ["Baju", "Celana", "Sepatu", "Tas"],
            productCount: 8,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "3",
            name: "Rumah Tangga",
            description: "Peralatan dan perlengkapan rumah tangga",
            subcategories: ["Dapur", "Kamar Mandi"],
            productCount: 12,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        // Apply search filter to demo data
        let filteredDemo = demoCategories;
        if (search) {
          filteredDemo = demoCategories.filter(
            (category) =>
              category.name.toLowerCase().includes(search.toLowerCase()) ||
              category.description.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Apply pagination to demo data
        const skip = (page - 1) * limit;
        const paginatedDemo = filteredDemo.slice(skip, skip + limit);

        return NextResponse.json({
          categories: paginatedDemo,
          currentPage: page,
          totalPages: Math.ceil(filteredDemo.length / limit),
          totalCategories: filteredDemo.length,
          isDemo: true,
          message: "Database not connected - showing demo data",
        });
      }

      // Build query
      const query: any = { isActive: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Get categories from database
      const skip = (page - 1) * limit;
      const dbCategories = await Category.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      const dbTotalCategories = await Category.countDocuments(query);

      console.log(
        `Database query returned ${dbCategories.length} categories out of ${dbTotalCategories} total`
      );

      // Get product counts for each category
      const categoriesWithCount = await Promise.all(
        dbCategories.map(async (category: any) => {
          let productCount = 0;
          try {
            // Try to get product count if Product model exists
            const Product = require("@/lib/models/Product").default;
            if (Product) {
              productCount = await Product.countDocuments({
                category: category.name,
                // Add any other conditions for active products
              });
            }
          } catch (error) {
            // If Product model doesn't exist or error occurs, set count to 0
            productCount = 0;
          }

          return {
            _id: category._id.toString(),
            name: category.name || "",
            description: category.description || "",
            subcategories: category.subcategories || [],
            productCount,
            isActive: category.isActive !== false,
            createdAt: category.createdAt
              ? new Date(category.createdAt).toISOString()
              : new Date().toISOString(),
            updatedAt: category.updatedAt
              ? new Date(category.updatedAt).toISOString()
              : new Date().toISOString(),
          };
        })
      );

      categories = categoriesWithCount;
      totalCategories = dbTotalCategories;

      console.log(
        `Database mode: Using ${categories.length} categories from database`
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({
        categories: [],
        currentPage: page,
        totalPages: 0,
        totalCategories: 0,
        isDemo: false,
        error: "Database connection failed",
      });
    }

    const totalPages = Math.ceil(totalCategories / limit);

    return NextResponse.json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      categories: [],
      currentPage: 1,
      totalPages: 0,
      totalCategories: 0,
      isDemo: false,
      error: "Failed to fetch categories",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Categories POST API Called ===");

    const session = await getServerSession(authOptions);
    console.log("Session for POST:", !!session, session?.user?.role);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, subcategories } = body;

    console.log("Creating category:", { name, description, subcategories });

    // Validation
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const connection = await connectDB();

    if (!connection) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = new Category({
      name: name.trim(),
      description: description.trim(),
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      isActive: true,
    });

    await category.save();
    console.log("Category saved to database");

    // Transform saved category to CategoryType format
    const savedCategory: CategoryType = {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      subcategories: category.subcategories || [],
      productCount: 0,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };

    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
