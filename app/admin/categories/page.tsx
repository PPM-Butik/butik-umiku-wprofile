"use client";

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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: string[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  // Perbaikan: Handle case ketika useSession() mengembalikan undefined
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status || "loading";

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

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

    fetchCategories();
  }, [session, status, router, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", "1");
      params.append("limit", "50");

      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error("Gagal memuat kategori");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat kategori");
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

  // Loading state yang lebih robust
  if (status === "loading" || !sessionResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Redirect handling
  if (!session || session.user?.role !== "admin") {
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-3xl font-bold">Kelola Kategori</h1>
              <p className="text-muted-foreground">
                Kelola semua kategori produk di toko Anda
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/categories/new">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kategori
              </Link>
            </Button>
          </div>
        </motion.div>

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
                Total {filteredCategories.length} kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                </div>
              ) : (
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
                      {filteredCategories.map((category) => (
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
                              {category.subcategories.slice(0, 3).map((sub) => (
                                <Badge
                                  key={sub}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {sub}
                                </Badge>
                              ))}
                              {category.subcategories.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{category.subcategories.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {category.productCount} produk
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {new Date(category.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
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
                                  disabled={category.productCount > 0}
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
              )}

              {!loading && filteredCategories.length === 0 && (
                <div className="text-center py-8">
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
