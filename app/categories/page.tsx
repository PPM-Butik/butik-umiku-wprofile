"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Tag, Package, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "name-asc", label: "Nama: A-Z" },
    { value: "name-desc", label: "Nama: Z-A" },
    { value: "productCount-desc", label: "Jumlah Produk: Terbanyak" },
    { value: "productCount-asc", label: "Jumlah Produk: Tersedikit" },
    { value: "createdAt-desc", label: "Terbaru" },
    { value: "createdAt-asc", label: "Terlama" },
  ];

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, sortBy]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (sortBy && sortBy !== "default") {
        const [field, order] = sortBy.split("-");
        params.append("sortBy", field);
        params.append("sortOrder", order);
      }

      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories();
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 to-indigo-50 dark:from-rose-950/20 dark:to-indigo-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Kategori <span className="text-rose-600">Produk</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Jelajahi berbagai kategori produk kami dan temukan yang Anda
                butuhkan dengan mudah
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-6xl mx-auto"
            >
              <Card>
                <CardContent className="p-6">
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col lg:flex-row gap-4"
                  >
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari kategori..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-64">
                        <SelectValue placeholder="Urutkan" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value || "default"}
                            value={option.value || "default"}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Cari
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-48 bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-6 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 to-indigo-100 dark:from-rose-900/30 dark:to-indigo-900/30 h-48 flex items-center justify-center">
                          {/* Category Icon */}
                          <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                            <Grid3X3 className="w-10 h-10 text-white" />
                          </div>

                          {/* Product Count Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-rose-600 hover:bg-rose-700">
                              <Package className="w-3 h-3 mr-1" />
                              {category.productCount} produk
                            </Badge>
                          </div>

                          {/* View Details Button */}
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button className="w-full" size="sm" asChild>
                              <Link
                                href={`/categories/${category._id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat Produk
                              </Link>
                
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-2">
                            <Badge variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              Kategori
                            </Badge>
                          </div>

                          <h3 className="font-semibold mb-2 text-lg">
                            <Link href={`/categories/${category._id}`}>
                              {category.name}
                            </Link>
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {category.description}
                          </p>

                          {/* Subcategories */}
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                  Subkategori:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {category.subcategories
                                    .slice(0, 3)
                                    .map((sub) => (
                                      <Badge
                                        key={sub}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {sub}
                                      </Badge>
                                    ))}
                                  {category.subcategories.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{category.subcategories.length - 3} lagi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Package className="w-4 h-4 mr-1" />
                              <span>{category.productCount} produk</span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/categories/${category._id}`}>
                                Jelajahi
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg mb-2">
                  Tidak ada kategori yang ditemukan.
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba ubah kata kunci pencarian Anda.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
