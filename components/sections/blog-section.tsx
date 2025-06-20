"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  author: {
    name: string
    _id: string
  }
  createdAt: string
  readTime?: string
  tags?: string[]
  published?: boolean
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/blog?limit=3&published=true")

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Gagal memuat artikel blog. Silakan coba lagi nanti.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min`
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            Blog Fashion
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Tips & <span className="text-rose-600">Inspirasi Fashion</span>
          </h2>
          <div className="p-8 rounded-lg border border-red-200 bg-red-50 text-red-800">
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Blog Fashion
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Tips & <span className="text-rose-600">Inspirasi Fashion</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dapatkan tips, inspirasi, dan tren terbaru dalam dunia fashion muslim dari para ahli kami
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center justify-between pt-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-white">
            <p className="text-muted-foreground mb-4">Belum ada artikel blog yang ditambahkan.</p>
            <Button asChild variant="outline">
              <Link href="/admin/blog/new">Tambah Artikel</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featuredImage || "/placeholder.svg?height=192&width=384"}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black hover:bg-white">{post.category}</Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author?.name || "Admin"}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-rose-600 transition-colors">
                        <Link href={`/blog/${post._id}`}>{post.title}</Link>
                      </h3>

                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-muted-foreground">
                          {post.readTime || calculateReadTime(post.content)} baca
                        </span>
                        <Button variant="ghost" size="sm" className="group/btn" asChild>
                          <Link href={`/blog/${post._id}`}>
                            Baca Selengkapnya
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">Lihat Semua Artikel</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
