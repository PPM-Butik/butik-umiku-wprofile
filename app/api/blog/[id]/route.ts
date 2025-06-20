import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Post from "@/lib/models/Post"

// GET - Fetch single blog post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connection = await connectDB()
    if (!connection) {
      // Return demo blog post when database is not connected
      const demoPost = {
        _id: params.id,
        title: "Tips Memilih Gamis yang Tepat Sesuai Bentuk Tubuh",
        excerpt:
          "Panduan lengkap memilih gamis yang sesuai dengan bentuk tubuh untuk tampilan yang lebih percaya diri dan nyaman.",
        content: `
          <p>Memilih gamis yang tepat sesuai bentuk tubuh sangat penting untuk mendapatkan tampilan yang proporsional dan nyaman. Berikut adalah beberapa tips yang bisa Anda terapkan:</p>
          
          <h3>Untuk Bentuk Tubuh Apel</h3>
          <p>Jika Anda memiliki bentuk tubuh apel (bagian tengah lebih besar), pilihlah gamis dengan potongan A-line atau empire waist yang jatuh dari bawah dada. Hindari gamis dengan kerutan atau detail di bagian perut.</p>
          
          <h3>Untuk Bentuk Tubuh Pir</h3>
          <p>Bagi Anda yang memiliki bentuk tubuh pir (pinggul lebih lebar dari bahu), gamis dengan detail menarik di bagian atas seperti bordir atau payet akan menyeimbangkan proporsi tubuh. Pilihlah bahan yang jatuh lembut di area pinggul.</p>
          
          <h3>Untuk Bentuk Tubuh Jam Pasir</h3>
          <p>Bentuk tubuh jam pasir akan terlihat cantik dengan gamis yang menekankan pinggang, seperti model wrap dress atau gamis dengan ikat pinggang. Hindari model yang terlalu longgar.</p>
          
          <h3>Untuk Bentuk Tubuh Persegi</h3>
          <p>Jika Anda memiliki bentuk tubuh persegi (bahu, pinggang, dan pinggul sejajar), pilihlah gamis dengan detail asimetris atau layer untuk menciptakan dimensi. Gamis dengan potongan princess cut juga bisa memberikan ilusi lekuk tubuh.</p>
          
          <h3>Tips Umum</h3>
          <ul>
            <li>Perhatikan panjang gamis yang proporsional dengan tinggi badan</li>
            <li>Pilih bahan yang nyaman dan sesuai dengan aktivitas</li>
            <li>Perhatikan warna yang sesuai dengan tone kulit</li>
            <li>Sesuaikan motif dengan bentuk tubuh (motif besar untuk tubuh kecil dan sebaliknya)</li>
          </ul>
          
          <p>Dengan memperhatikan tips di atas, Anda bisa memilih gamis yang tidak hanya syar'i tapi juga membuat Anda tampil lebih percaya diri dan nyaman.</p>
        `,
        featuredImage:
          "https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=600",
        images: [
          "https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=600",
          "https://images.pexels.com/photos/7691442/pexels-photo-7691442.jpeg?auto=compress&cs=tinysrgb&w=600",
        ],
        category: "Fashion Tips",
        tags: ["gamis", "fashion", "tips"],
        published: true,
        author: "1",
        authorName: "Admin Ethica",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return NextResponse.json(demoPost)
    }

    const post = await Post.findById(params.id).lean()

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

// PUT - Update blog post (Admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connection = await connectDB()
    if (!connection) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 })
    }

    const body = await request.json()
    const { title, content, excerpt, featuredImage, images, category, tags, published } = body

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        featuredImage,
        images: images || [],
        category,
        tags: tags || [],
        published: published !== undefined ? published : false,
      },
      { new: true, runValidators: true },
    )

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

// DELETE - Delete blog post (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connection = await connectDB()
    if (!connection) {
      return NextResponse.json({ error: "Database not connected" }, { status: 503 })
    }

    const post = await Post.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
