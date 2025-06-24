import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import mongoose from "mongoose";

interface CategoryDocument {
  _id: string;
  name: string;
  description: string;
  subcategories: string[];
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const category = (await Category.findById(
      params.id
    ).lean()) as CategoryDocument | null;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get product count for this category
    let productCount = 0;
    try {
      const Product = mongoose.models.Product;
      if (Product) {
        productCount = await Product.countDocuments({
          category: category.name,
          isActive: true,
        });
      }
    } catch (error) {
      productCount = 0;
    }

    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
      productCount,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, subcategories } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category exists
    const existingCategory = await Category.findById(params.id);

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if another category with the same name exists
    const duplicateCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: params.id },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const oldName = existingCategory.name;

    // Update category
    existingCategory.name = name.trim();
    existingCategory.description = description.trim();
    existingCategory.subcategories = subcategories || [];

    await existingCategory.save();

    // If category name changed, update all products using this category
    if (oldName !== name) {
      try {
        const Product = mongoose.models.Product;
        if (Product) {
          await Product.updateMany(
            { category: oldName },
            { $set: { category: name } }
          );
        }
      } catch (error) {
        console.log("Product model not found, skipping product update");
      }
    }

    // Get product count
    let productCount = 0;
    try {
      const Product = mongoose.models.Product;
      if (Product) {
        productCount = await Product.countDocuments({
          category: name,
          isActive: true,
        });
      }
    } catch (error) {
      productCount = 0;
    }

    return NextResponse.json({
      ...existingCategory.toObject(),
      _id: existingCategory._id.toString(),
      productCount,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    let productCount = 0;
    try {
      const Product = mongoose.models.Product;
      if (Product) {
        productCount = await Product.countDocuments({
          category: category.name,
          isActive: true,
        });
      }
    } catch (error) {
      productCount = 0;
    }

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${productCount} existing products. Please move or delete the products first.`,
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    category.isActive = false;
    await category.save();

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
