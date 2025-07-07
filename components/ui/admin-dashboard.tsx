"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Package, Users, TrendingUp, Plus, FileText, Settings, PenLine, Tags, Loader2 } from 'lucide-react'
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardStats {
  totalProducts: number
  totalArticles: number
  totalCategories: number
  // You can add more stats as needed
}

export function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch products count
        const productsRes = await fetch('/api/products?limit=1')
        const productsData = await productsRes.json()
        
        // Fetch articles count
        const articlesRes = await fetch('/api/blog?limit=1')
        const articlesData = await articlesRes.json()
        
        // Fetch categories count
        const categoriesRes = await fetch('/api/categories?limit=1')
        const categoriesData = await categoriesRes.json()
        
        setStats({
          totalProducts: productsData.totalProducts || 0,
          totalArticles: articlesData.totalPosts || 0,
          totalCategories: categoriesData.totalCategories || 0,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
        // Set fallback data
        setStats({
          totalProducts: 0,
          totalArticles: 0,
          totalCategories: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: "Total Produk",
      value: stats?.totalProducts.toString() || "-",
      // change: "+12%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Artikel",
      value: stats?.totalArticles.toString() || "-",
      // change: "+23%",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Kategori",
      value: stats?.totalCategories.toString() || "-",
      // change: "+8%",
      icon: Tags,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    
  ]

  const quickActions = [
    {
      title: "Tambah Produk",
      description: "Tambahkan produk baru ke katalog",
      icon: Plus,
      href: "/admin/products/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Kelola Produk",
      description: "Lihat dan edit produk yang ada",
      icon: Package,
      href: "/admin/products",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Tulis Artikel",
      description: "Buat artikel blog baru",
      icon: PenLine,
      href: "/admin/blog/new",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Kelola Blog",
      description: "Kelola artikel blog",
      icon: FileText,
      href: "/admin/blog",
      color: "bg-rose-600 hover:bg-rose-700",
    },
    {
      title: "Tambah Kategori",
      description: "Tambahkan kategori produk",
      icon: Tags,
      href: "/admin/categories/new",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Kelola Kategori",
      description: "Atur kategori produk",
      icon: Tags,
      href: "/admin/categories",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">Selamat datang kembali, {session?.user?.name}</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Settings className="w-4 h-4 mr-1" />
            Admin Panel
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-2xl font-bold">Loading...</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {/* <p className="text-xs text-green-600 font-medium">{stat.change} dari bulan lalu</p> */}
                      </>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Akses fitur utama dengan cepat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Button asChild className={`w-full h-auto p-4 ${action.color} text-white`}>
                    <Link href={action.href}>
                      <div className="text-center space-y-2">
                        <action.icon className="h-8 w-8 mx-auto" />
                        <div>
                          <p className="font-semibold">{action.title}</p>
                          <p className="text-xs opacity-90">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error display */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
