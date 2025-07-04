"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

interface Category {
  _id: string
  name: string
  description: string
  subcategories: string[]
  productCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Fallback images for categories
const getCategoryImage = (categoryName: string) => {
  const imageMap: { [key: string]: string } = {
    gamis: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    hijab: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    tunik: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    mukena: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    khimar: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    abaya: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    fashion: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    elektronik: "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
    "rumah tangga":
      "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg",
  }

  const key = categoryName.toLowerCase()
  return (
    imageMap[key] ||
    "https://i.pinimg.com/736x/db/5c/aa/db5caa8f76815f7e3f0ec884410acb86.jpg"
  )
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/categories?limit=6&sortBy=productCount&sortOrder=desc")
        const data = await response.json()

        if (response.ok) {
          setCategories(data.categories || [])
        } else {
          throw new Error(data.error || "Failed to fetch categories")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
        // Set fallback categories if API fails
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              Kategori Produk
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Jelajahi <span className="text-rose-600">Koleksi Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan berbagai kategori busana muslim dengan desain modern dan kualitas terbaik
            </p>
          </motion.div>

          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
              <p className="text-muted-foreground">Memuat kategori...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              Kategori Produk
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Jelajahi <span className="text-rose-600">Koleksi Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan berbagai kategori busana muslim dengan desain modern dan kualitas terbaik
            </p>
          </motion.div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
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
            Kategori Produk
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Jelajahi <span className="text-rose-600">Koleksi Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan berbagai kategori busana muslim dengan desain modern dan kualitas terbaik
          </p>
        </motion.div>

        {categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {categories.slice(0, 6).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/categories/${category._id}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={getCategoryImage(category.name) || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                            <Badge className="w-fit mb-2 bg-white/20 text-white border-white/30">
                              {category.productCount} Produk
                            </Badge>
                            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                            <p className="text-sm opacity-90 line-clamp-2">
                              {category.description || `Koleksi ${category.name.toLowerCase()} terbaik`}
                            </p>
                            {category.subcategories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {category.subcategories.slice(0, 2).map((sub, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-white/10 text-white border-white/20"
                                  >
                                    {sub}
                                  </Badge>
                                ))}
                                {category.subcategories.length > 2 && (
                                  <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">
                                    +{category.subcategories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
                <Link href="/categories">
                  Lihat Semua Kategori
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada kategori tersedia</p>
            <Button variant="outline" asChild>
              <Link href="/admin/categories/new">Tambah Kategori</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
