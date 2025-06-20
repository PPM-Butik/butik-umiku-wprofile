"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, Eye, PenLine } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  category: string
  tags: string[]
  published: boolean
  author: string
  authorName: string
  createdAt: string
  updatedAt: string
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user.role !== "admin") {
      router.push("/")
      return
    }

    fetchPosts()
  }, [session, status, router, currentPage, searchTerm, selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
        setTotalPages(data.totalPages)
      } else {
        toast.error("Gagal memuat artikel")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat artikel")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Artikel berhasil dihapus")
        fetchPosts()
      } else {
        toast.error("Gagal menghapus artikel")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus artikel")
    }
    setDeletePostId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const categories = ["Fashion Tips", "Trend Fashion", "Care Tips", "Lifestyle", "Event"]

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== "admin") {
    return null
  }

  // Demo posts if API doesn't return data
  const demoPosts: BlogPost[] =
    posts.length > 0
      ? posts
      : [
          {
            _id: "1",
            title: "Tips Memilih Gamis yang Tepat Sesuai Bentuk Tubuh",
            excerpt:
              "Panduan lengkap memilih gamis yang sesuai dengan bentuk tubuh untuk tampilan yang lebih percaya diri dan nyaman.",
            content: "Lorem ipsum dolor sit amet...",
            featuredImage:
              "https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Fashion Tips",
            tags: ["gamis", "fashion", "tips"],
            published: true,
            author: "1",
            authorName: "Admin Ethica",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "2",
            title: "Tren Warna Hijab 2025: Inspirasi untuk Tampil Trendy",
            excerpt:
              "Simak tren warna hijab terbaru tahun 2025 yang bisa membuat penampilan Anda semakin menarik dan up-to-date.",
            content: "Lorem ipsum dolor sit amet...",
            featuredImage:
              "https://images.pexels.com/photos/7691478/pexels-photo-7691478.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Trend Fashion",
            tags: ["hijab", "trend", "2025"],
            published: true,
            author: "1",
            authorName: "Admin Ethica",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kelola Blog</h1>
              <p className="text-muted-foreground">Kelola semua artikel blog di website Anda</p>
            </div>
            <Button asChild>
              <Link href="/admin/blog/new">
                <PenLine className="w-4 h-4 mr-2" />
                Tulis Artikel Baru
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari artikel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blog Posts Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Daftar Artikel</CardTitle>
              <CardDescription>Total {demoPosts.length} artikel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artikel</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Penulis</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoPosts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {post.featuredImage && (
                              <img
                                src={post.featuredImage || "/placeholder.svg"}
                                alt={post.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{post.authorName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatDate(post.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/blog/${post._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Lihat
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/blog/${post._id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => setDeletePostId(post._id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Artikel</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePostId && handleDeletePost(deletePostId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
