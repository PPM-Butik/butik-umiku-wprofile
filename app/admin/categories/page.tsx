"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: string[];
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  // Handle potential undefined useSession during prerendering
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || "loading";

  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Session check - only redirect, don't fetch data here
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session.user?.role !== "admin") {
      router.push("/");
      return;
    }

    // Mark as initialized only after session check passes
    setInitialized(true);
  }, [session, status, router]);

  // Fetch categories - separate from session check
  useEffect(() => {
    if (!initialized) return;

    fetchCategories();
  }, [initialized]);

  // Search effect - debounced
  useEffect(() => {
    if (!initialized) return;

    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, initialized]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", "1");
      params.append("limit", "50");

      console.log("Fetching categories...");

      const response = await fetch(`/api/categories?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Categories data received:", data);

      // Handle both old and new response formats
      const categoriesData = data.categories || data || [];

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setIsDemo(data.isDemo || false);

      if (data.isDemo) {
        toast.info("Menampilkan data demo - database tidak terhubung");
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError(error.message || "Gagal memuat kategori");
      setCategories([]);
      toast.error(`Gagal memuat kategori: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Kategori berhasil dihapus");
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menghapus kategori");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus kategori");
    }
    setDeleteCategoryId(null);
  };

  // Show loading while checking session or if sessionResult is undefined
  if (status === "loading" || !sessionResult || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sesi tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            Silakan login terlebih dahulu.
          </p>
          <Button onClick={() => router.push("/auth/signin")}>Login</Button>
        </div>
      </div>
    );
  }

  // Not admin
  if (session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
          <p className="text-muted-foreground">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Mode Demo</p>
                <p className="text-sm">
                  Database tidak terhubung - menampilkan data demo
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Kelola Kategori</h1>
              <p className="text-muted-foreground">
                Kelola semua kategori produk di toko Anda
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchCategories}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Gagal memuat data</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={fetchCategories}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={loading}
                >
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori</CardTitle>
              <CardDescription>
                {loading ? "Memuat..." : `Total ${categories.length} kategori`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Memuat kategori...
                  </p>
                </div>
              ) : categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Sub Kategori</TableHead>
                        <TableHead>Jumlah Produk</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                                <Tag className="w-4 h-4 text-rose-600" />
                              </div>
                              <div>
                                <p className="font-medium">{category.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                              {category.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories
                                ?.slice(0, 3)
                                .map((sub) => (
                                  <Badge
                                    key={sub}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {sub}
                                  </Badge>
                                ))}
                              {(category.subcategories?.length || 0) > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{(category.subcategories?.length || 0) - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {category.productCount || 0} produk
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {category.createdAt
                                ? new Date(
                                    category.createdAt
                                  ).toLocaleDateString("id-ID")
                                : "-"}
                            </p>
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
                                  <Link
                                    href={`/admin/categories/${category._id}/edit`}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    setDeleteCategoryId(category._id)
                                  }
                                  disabled={(category.productCount || 0) > 0}
                                >
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
              ) : (
                <div className="text-center py-12">
                  <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Tidak ada kategori
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Tidak ada kategori yang sesuai dengan pencarian"
                      : "Belum ada kategori yang dibuat"}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link href="/admin/categories/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kategori Pertama
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteCategoryId}
          onOpenChange={() => setDeleteCategoryId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini
                tidak dapat dibatalkan. Pastikan tidak ada produk yang
                menggunakan kategori ini.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteCategoryId && handleDeleteCategory(deleteCategoryId)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
