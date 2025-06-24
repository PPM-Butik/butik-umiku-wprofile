"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function NewCategoryPage() {
  // Perbaikan: Handle case ketika useSession() mengembalikan undefined
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status || "loading"

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [newSubcategory, setNewSubcategory] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated" || !session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "admin") {
      router.push("/")
      return
    }
  }, [session, status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addSubcategory = () => {
    if (newSubcategory && !subcategories.includes(newSubcategory)) {
      setSubcategories([...subcategories, newSubcategory])
      setNewSubcategory("")
    }
  }

  const removeSubcategory = (subcategory: string) => {
    setSubcategories(subcategories.filter((s) => s !== subcategory))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    setLoading(true)

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        subcategories,
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        toast.success("Kategori berhasil ditambahkan")
        router.push("/admin/categories")
      } else {
        const error = await response.json()
        toast.error(error.error || "Gagal menambahkan kategori")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan kategori")
    } finally {
      setLoading(false)
    }
  }

  // Loading state yang lebih robust
  if (status === "loading" || !sessionResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  // Redirect handling
  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/categories">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Tambah Kategori Baru</h1>
              <p className="text-muted-foreground">Tambahkan kategori baru untuk produk</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Informasi Kategori */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kategori</CardTitle>
                <CardDescription>Informasi dasar tentang kategori</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Kategori *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama kategori"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi kategori"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subkategori */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Sub Kategori</CardTitle>
                <CardDescription>Tambahkan sub kategori untuk kategori ini (opsional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tambah Sub Kategori</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      placeholder="Nama sub kategori"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubcategory())}
                    />
                    <Button type="button" onClick={addSubcategory}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {subcategories.length > 0 && (
                  <div>
                    <Label>Sub Kategori yang Ditambahkan</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subcategories.map((subcategory) => (
                        <Badge key={subcategory} variant="secondary" className="cursor-pointer">
                          {subcategory}
                          <X className="h-3 w-3 ml-1" onClick={() => removeSubcategory(subcategory)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tombol Aksi */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Menyimpan..." : "Simpan Kategori"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" asChild>
                    <Link href="/admin/categories">Batal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
