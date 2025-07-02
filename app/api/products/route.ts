import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  fabric: string; // Added fabric field
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  rating: number;
  totalReviews: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let products: ProductType[] = [];
    let totalProducts = 0;

    try {
      const connection = await connectDB();

      if (!connection) {
        console.log("Database not connected - returning empty results");
        return NextResponse.json({
          products: [],
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          isDemo: false,
          message: "Database not connected",
        });
      }

      // Build query
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { fabric: { $regex: search, $options: "i" } }, // Added fabric to search
        ];
      }

      if (category && category !== "all") {
        query.category = category;
      }

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Get products from database
      const skip = (page - 1) * limit;
      const dbProducts = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      const dbTotalProducts = await Product.countDocuments(query);

      console.log(
        `Database query returned ${dbProducts.length} products out of ${dbTotalProducts} total`
      );

      // Transform MongoDB documents to ProductType format
      products = dbProducts.map((product: any) => ({
        _id: product._id.toString(),
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        originalPrice: product.originalPrice,
        category: product.category || "",
        subcategory: product.subcategory || "",
        fabric: product.fabric || "", // Added fabric field
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || 0,
        featured: product.featured || false,
        rating: product.rating || 0,
        totalReviews: product.totalReviews || 0,
        tags: product.tags || [],
        createdAt: product.createdAt
          ? new Date(product.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: product.updatedAt
          ? new Date(product.updatedAt).toISOString()
          : new Date().toISOString(),
      }));
      totalProducts = dbTotalProducts;

      console.log(
        `Database mode: Using ${products.length} products from database`
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({
        products: [],
        currentPage: page,
        totalPages: 0,
        totalProducts: 0,
        isDemo: false,
        error: "Database connection failed",
      });
    }

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      products: [],
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      isDemo: false,
      error: "Failed to fetch products",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      fabric, // Added fabric field
      images,
      sizes,
      colors,
      stock,
      featured,
      tags,
    } = body;

    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !fabric || // Added fabric validation
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (name, description, price, category, fabric, images)",
        },
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

    const product = new Product({
      name,
      description,
      price: Number.parseFloat(price),
      originalPrice: originalPrice
        ? Number.parseFloat(originalPrice)
        : undefined,
      category,
      subcategory: subcategory || undefined,
      fabric, // Added fabric field
      images: Array.isArray(images) ? images : [images],
      sizes: Array.isArray(sizes)
        ? sizes
        : sizes
        ? sizes.split(",").map((size: string) => size.trim())
        : [],
      colors: Array.isArray(colors)
        ? colors
        : colors
        ? colors.split(",").map((color: string) => color.trim())
        : [],
      stock: Number.parseInt(stock) || 0,
      featured: featured || false,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(",").map((tag: string) => tag.trim())
        : [],
      rating: 0,
      totalReviews: 0,
    });

    await product.save();
    console.log("Product saved to database");

    // Transform saved product to ProductType format
    const savedProduct: ProductType = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory,
      fabric: product.fabric, // Added fabric field
      images: product.images,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      featured: product.featured,
      rating: product.rating,
      totalReviews: product.totalReviews,
      tags: product.tags || [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
