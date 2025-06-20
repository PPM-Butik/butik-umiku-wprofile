import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/lib/models/Post";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  published: boolean;
  author: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published");

    let posts: BlogPost[] = [];
    let totalPosts = 0;

    try {
      const connection = await connectDB();

      if (!connection) {
        console.log("Database not connected - returning empty results");
        return NextResponse.json({
          posts: [],
          currentPage: page,
          totalPages: 0,
          totalPosts: 0,
          isDemo: false,
          message: "Database not connected",
        });
      }

      // Build query
      const query: any = {};

      if (published !== null) {
        query.published = published === "true";
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }

      if (category && category !== "all") {
        query.category = category;
      }

      // Get posts from database
      const skip = (page - 1) * limit;
      const dbPosts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const dbTotalPosts = await Post.countDocuments(query);

      console.log(
        `Database query returned ${dbPosts.length} posts out of ${dbTotalPosts} total`
      );

      // Transform MongoDB documents to BlogPost format
      posts = dbPosts.map((post: any) => ({
        _id: post._id.toString(),
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        featuredImage: post.featuredImage || "",
        category: post.category || "",
        tags: post.tags || [],
        published: post.published || false,
        author: post.author || "",
        authorName: post.authorName || "",
        createdAt: post.createdAt
          ? new Date(post.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: post.updatedAt
          ? new Date(post.updatedAt).toISOString()
          : new Date().toISOString(),
      }));
      totalPosts = dbTotalPosts;

      console.log(`Database mode: Using ${posts.length} posts from database`);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({
        posts: [],
        currentPage: page,
        totalPages: 0,
        totalPosts: 0,
        isDemo: false,
        error: "Database connection failed",
      });
    }

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      isDemo: false,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({
      posts: [],
      currentPage: 1,
      totalPages: 0,
      totalPosts: 0,
      isDemo: false,
      error: "Failed to fetch posts",
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
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      published,
    } = body;

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const post = new Post({
      title,
      excerpt: excerpt || content.substring(0, 150) + "...",
      content,
      featuredImage,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag: string) => tag.trim()),
      published: published || false,
      author: session.user.id,
      authorName: session.user.name,
    });

    await post.save();
    console.log("Post saved to database");

    // Transform saved post to BlogPost format
    const savedPost: BlogPost = {
      _id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || "",
      category: post.category,
      tags: post.tags,
      published: post.published,
      author: post.author,
      authorName: post.authorName,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
