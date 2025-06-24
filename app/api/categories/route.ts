import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    let query: Record<string, any> = { isActive: true }
    if (search) {
      query = {
        ...query,
        $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
      }
    }

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(query),
    ])

    // Get product count for each category (assuming you have a Product model)
    const categoriesWithCount = await Promise.all(
      categories.map(async (category: any) => {
        let productCount = 0
        try {
          // Try to get product count if Product model exists
          const Product = mongoose.models.Product
          if (Product) {
            productCount = await Product.countDocuments({
              category: category.name,
              isActive: true,
            })
          }
        } catch (error) {
          // If Product model doesn't exist, set count to 0
          productCount = 0
        }

        return {
          ...category,
          _id: category._id.toString(),
          productCount,
        }
      }),
    )

    return NextResponse.json({
      categories: categoriesWithCount,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, subcategories } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    await connectDB()

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description.trim(),
      subcategories: subcategories || [],
    })

    await newCategory.save()

    return NextResponse.json(
      {
        ...newCategory.toObject(),
        _id: newCategory._id.toString(),
        productCount: 0,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
