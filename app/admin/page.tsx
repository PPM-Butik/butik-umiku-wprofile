"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  FileText,
  Settings,
  PenLine,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const stats = [
    {
      title: "Total Produk",
      value: "156",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Artikel",
      value: "48",
      change: "+23%",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pengunjung",
      value: "1,234",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Interaksi",
      value: "3,452",
      change: "+15%",
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
    },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-muted-foreground">
                Selamat datang kembali, {session.user.name}
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Settings className="w-4 h-4 mr-1" />
              Admin Panel
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 font-medium">
                        {stat.change} dari bulan lalu
                      </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      asChild
                      className={`w-full h-auto p-4 ${action.color} text-white`}
                    >
                      <Link href={action.href}>
                        <div className="text-center space-y-2">
                          <action.icon className="h-8 w-8 mx-auto" />
                          <div>
                            <p className="font-semibold">{action.title}</p>
                            <p className="text-xs opacity-90">
                              {action.description}
                            </p>
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Artikel Terbaru</CardTitle>
                <CardDescription>5 artikel terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((post) => (
                    <div
                      key={post}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          Tips Fashion Muslimah #{post}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Diterbitkan 2 hari yang lalu
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/admin/blog/${post}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/blog/${post}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/blog">
                    <FileText className="w-4 h-4 mr-2" />
                    Kelola Semua Artikel
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Produk Terpopuler</CardTitle>
                <CardDescription>Berdasarkan jumlah dilihat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Gamis Syari Elegant",
                    "Hijab Premium Voal",
                    "Tunik Casual Modern",
                    "Set Mukena Mewah",
                    "Khimar Syari Premium",
                  ].map((product, index) => (
                    <div
                      key={product}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product}</p>
                        <p className="text-sm text-muted-foreground">
                          {250 - index * 30} kali dilihat
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/products">
                    <Package className="w-4 h-4 mr-2" />
                    Kelola Produk
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
