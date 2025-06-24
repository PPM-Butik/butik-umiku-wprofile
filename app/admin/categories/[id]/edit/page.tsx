"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import Link from "next/link";
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

export default function EditCategoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/categories/${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setCategory(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
        });
        setSubcategories(data.subcategories || []);
      } else {
        toast.error("Gagal memuat kategori");
        router.push("/admin/categories");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Terjadi kesalahan saat memuat kategori");
      router.push("/admin/categories");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSubcategory = () => {
    if (newSubcategory && !subcategories.includes(newSubcategory)) {
      setSubcategories([...subcategories, newSubcategory]);
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (subcategory: string) => {
    setSubcategories(subcategories.filter((s) => s !== subcategory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        subcategories,
      };

      const response = await fetch(`/api/categories/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        toast.success("Kategori berhasil diperbarui");
        router.push("/admin/categories");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal memperbarui kategori");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui kategori");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kategori tidak ditemukan</h1>
          <Button asChild>
            <Link href="/admin/categories">Kembali ke Kategori</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/categories">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Kategori</h1>
              <p className="text-muted-foreground">
                Edit kategori yang sudah ada
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kategori</CardTitle>
                <CardDescription>
                  Informasi dasar tentang kategori
                </CardDescription>
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

          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Statistik Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jumlah Produk</Label>
                    <p className="text-2xl font-bold text-rose-600">
                      {category.productCount}
                    </p>
                  </div>
                  <div>
                    <Label>Dibuat</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subcategories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sub Kategori</CardTitle>
                <CardDescription>
                  Kelola sub kategori untuk kategori ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tambah Sub Kategori</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      placeholder="Nama sub kategori"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addSubcategory())
                      }
                    />
                    <Button type="button" onClick={addSubcategory}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {subcategories.length > 0 && (
                  <div>
                    <Label>Sub Kategori Saat Ini</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subcategories.map((subcategory) => (
                        <Badge
                          key={subcategory}
                          variant="secondary"
                          className="cursor-pointer"
                        >
                          {subcategory}
                          <X
                            className="h-3 w-3 ml-1"
                            onClick={() => removeSubcategory(subcategory)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Menyimpan..." : "Perbarui Kategori"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/admin/categories">Batal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
