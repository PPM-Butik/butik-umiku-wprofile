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
import { Star, Eye, Search, Shirt } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  fabric?: string; // Added fabric field
  images: string[];
  stock: number;
  featured: boolean;
  // rating: number;
  totalReviews: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Gamis", "Hijab", "Tunik", "Mukena", "Khimar", "Abaya"];
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
    { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
    { value: "name-asc", label: "Nama: A-Z" },
    { value: "rating-desc", label: "Rating Tertinggi" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (sortBy && sortBy !== "default") {
        const [field, order] = sortBy.split("-");
        params.append("sortBy", field);
        params.append("sortOrder", order);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Koleksi <span className="text-rose-600">Produk</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Temukan busana muslim berkualitas tinggi dengan desain modern
                dan elegan
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
                          placeholder="Cari produk..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {/* <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-48">
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

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-64 bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-6 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              product.images[0] ||
                              "/placeholder.svg?height=300&width=300"
                            }
                            alt={product.name}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.featured && (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                Featured
                              </Badge>
                            )}
                            {product.originalPrice && (
                              <Badge variant="destructive">
                                -
                                {Math.round(
                                  ((product.originalPrice - product.price) /
                                    product.originalPrice) *
                                    100
                                )}
                                %
                              </Badge>
                            )}
                          </div>

                          {/* Stock Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge
                              variant={
                                product.stock > 0 ? "default" : "destructive"
                              }
                            >
                              {product.stock > 0
                                ? `Stok: ${product.stock}`
                                : "Habis"}
                            </Badge>
                          </div>

                          {/* View Details Button */}
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button className="w-full" size="sm" asChild>
                              <Link href={`/products/${product._id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat Detail
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            {/* Fabric Badge */}
                            {product.fabric && (
                              <Badge 
                                variant="secondary"
                                className="text-xs flex items-center gap-1"
                              >
                                <Shirt className="w-3 h-3" />
                                {product.fabric}
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold mb-2 line-clamp-2">
                            <Link
                              href={`/products/${product._id}`}
                              className="hover:text-rose-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                          </h3>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Fabric Information */}
                          {product.fabric && (
                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                              <Shirt className="w-3 h-3 mr-1" />
                              <span>Bahan: {product.fabric}</span>
                            </div>
                          )}

                          {/* <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium ml-1">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({product.totalReviews} ulasan)
                            </span>
                          </div> */}

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-bold text-rose-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Tidak ada produk yang ditemukan.
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
