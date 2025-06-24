"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface Category {
  _id: string;
  name: string;
  subcategories: string[];
}

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    stock: "",
    featured: false,
  });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?limit=50");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error("Gagal memuat kategori");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat kategori");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      images.length === 0
    ) {
      toast.error(
        "Mohon lengkapi semua field yang wajib diisi dan upload minimal 1 gambar"
      );
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseInt(formData.price),
        originalPrice: formData.originalPrice
          ? Number.parseInt(formData.originalPrice)
          : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        sizes,
        colors,
        images,
        stock: Number.parseInt(formData.stock) || 0,
        featured: formData.featured,
        tags,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Produk berhasil ditambahkan");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menambahkan produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
              <p className="text-muted-foreground">
                Tambahkan produk baru ke katalog toko
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>
                      Informasi utama tentang produk
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Produk *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama produk"
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
                        placeholder="Masukkan deskripsi produk"
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Harga</CardTitle>
                    <CardDescription>Atur harga produk</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Harga Jual *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">
                          Harga Asli (Opsional)
                        </Label>
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Variants */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Varian Produk</CardTitle>
                    <CardDescription>
                      Ukuran, warna, dan tag produk
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sizes */}
                    <div>
                      <Label>Ukuran</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Tambah ukuran"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addSize())
                          }
                        />
                        <Button type="button" onClick={addSize}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sizes.map((size) => (
                          <Badge
                            key={size}
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {size}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeSize(size)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Colors */}
                    <div>
                      <Label>Warna</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Tambah warna"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addColor())
                          }
                        />
                        <Button type="button" onClick={addColor}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colors.map((color) => (
                          <Badge
                            key={color}
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {color}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeColor(color)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div>
                      <Label>Tag</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Tambah tag"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Gambar Produk *</CardTitle>
                    <CardDescription>
                      Upload gambar produk (minimal 1 gambar, maksimal 5 gambar)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={images}
                      onChange={setImages}
                      maxFiles={5}
                      folder="products"
                      disabled={loading}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category & Stock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Kategori & Stok</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {categories.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Belum ada kategori.{" "}
                          <Link
                            href="/admin/categories/new"
                            className="text-rose-600 hover:underline"
                          >
                            Buat kategori baru
                          </Link>
                        </p>
                      )}
                    </div>

                    {selectedCategory &&
                      selectedCategory.subcategories.length > 0 && (
                        <div>
                          <Label>Sub Kategori</Label>
                          <Select
                            value={formData.subcategory}
                            onValueChange={(value) =>
                              handleSelectChange("subcategory", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih sub kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedCategory.subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                    <div>
                      <Label htmlFor="stock">Stok</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Produk Unggulan</Label>
                        <p className="text-sm text-muted-foreground">
                          Tampilkan di halaman utama
                        </p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            featured: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Menyimpan..." : "Simpan Produk"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        asChild
                      >
                        <Link href="/admin/products">Batal</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
