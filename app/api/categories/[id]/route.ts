import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";

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
    const connection = await connectDB();
    if (!connection) {
      // Return demo category when database is not connected
      const demoCategory = {
        _id: params.id,
        name: "Elektronik",
        description:
          "Perangkat elektronik dan gadget terbaru dengan kualitas terbaik",
        subcategories: ["Smartphone", "Laptop", "Tablet", "Smartwatch"],
        productCount: 25,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(demoCategory);
    }

    const category = (await Category.findById(params.id).lean()) as any;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get product count for this category
    let productCount = 0;
    try {
      const Product = require("@/lib/models/Product").default;
      if (Product) {
        productCount = await Product.countDocuments({
          category: category.name,
        });
      }
    } catch (error) {
      productCount = 0;
    }

    const categoryWithCount = {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
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

    return NextResponse.json(categoryWithCount);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Update category API called for ID:", params.id);

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connection = await connectDB();
    if (!connection) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, description, subcategories } = body;

    // Validation
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if another category with the same name exists
    const duplicateCategory = (await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: params.id },
      isActive: true,
    }).lean()) as any;

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = (await Category.findByIdAndUpdate(
      params.id,
      {
        name: name.trim(),
        description: description.trim(),
        subcategories: Array.isArray(subcategories) ? subcategories : [],
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean()) as any;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get product count for updated category
    let productCount = 0;
    try {
      const Product = require("@/lib/models/Product").default;
      if (Product) {
        productCount = await Product.countDocuments({
          category: category.name,
        });
      }
    } catch (error) {
      productCount = 0;
    }

    const categoryWithCount = {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
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

    return NextResponse.json(categoryWithCount);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Delete category API called for ID:", params.id);

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connection = await connectDB();
    if (!connection) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }

    const category = (await Category.findById(params.id).lean()) as any;

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    let productCount = 0;
    try {
      const Product = require("@/lib/models/Product").default;
      if (Product) {
        productCount = await Product.countDocuments({
          category: category.name,
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
    await Category.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
