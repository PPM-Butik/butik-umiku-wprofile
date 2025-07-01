"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  Tag,
  Calendar,
  Grid3X3,
  Eye,
  ShoppingBag,
  Clock,
  Star,
  Heart,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  subcategory: string;
  stock: number;
//   rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  isDemo: boolean;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Products filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [
    category,
    currentPage,
    searchQuery,
    sortBy,
    sortOrder,
    selectedSubcategory,
  ]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/categories/${categoryId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Kategori tidak ditemukan");
        } else {
          setError("Gagal memuat data kategori");
        }
        return;
      }

      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!category) return;

    try {
      setProductsLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        category: category.name,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedSubcategory && { subcategory: selectedSubcategory }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/products?${params}`);

      if (response.ok) {
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } else {
        // Fallback to demo products if API fails
        const demoProducts: Product[] = [];

        // Filter demo products based on search and subcategory
        let filteredProducts = demoProducts;

        if (searchQuery) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }

        if (selectedSubcategory) {
          filteredProducts = filteredProducts.filter(
            (product) => product.subcategory === selectedSubcategory
          );
        }

        setProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
        setTotalPages(Math.ceil(filteredProducts.length / 12));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="aspect-square bg-muted overflow-hidden relative">
            <img
              src={
                product.images &&
                Array.isArray(product.images) &&
                product.images.length > 0
                  ? product.images[0]
                  : "/images/placeholder-product.png"
              }
              alt={product.name}
              onError={(e) =>
                (e.currentTarget.src = "/images/placeholder-product.png")
              }
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-9 h-9 p-0"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          {product.stock < 10 && (
            <Badge className="absolute top-3 left-3 bg-orange-500">
              Stok Terbatas
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs mb-2">
              {product.subcategory}
            </Badge>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
{/* 
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({product.reviews} ulasan)
            </span>
          </div> */}

          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                Stok: {product.stock} unit
              </p>
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/products/${product._id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Detail
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <ShoppingBag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Back Button Skeleton */}
              <div className="mb-8">
                <div className="h-10 w-32 bg-muted rounded animate-pulse" />
              </div>

              {/* Hero Section Skeleton */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-32 h-32 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-4 bg-muted rounded animate-pulse mb-4 w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-6 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-4">
                {error || "Kategori tidak ditemukan"}
              </h1>
              <p className="text-muted-foreground mb-8">
                Kategori yang Anda cari mungkin telah dihapus atau tidak
                tersedia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Button asChild>
                  <Link href="/categories">
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Lihat Semua Kategori
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Breadcrumb & Back Navigation */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>

              <nav className="text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Beranda
                </Link>
                {" / "}
                <Link href="/categories" className="hover:text-foreground">
                  Kategori
                </Link>
                {" / "}
                <span className="text-foreground font-medium">
                  {category.name}
                </span>
              </nav>
            </div>
          </div>
        </section>

        {/* Category Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      {/* Category Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <Grid3X3 className="w-16 h-16 text-white" />
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <Badge className="mb-2">
                            <Tag className="w-3 h-3 mr-1" />
                            Kategori
                          </Badge>
                          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            {category.name}
                          </h1>
                          <p className="text-lg text-muted-foreground">
                            {category.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Package className="w-4 h-4 mr-2" />
                            <span>{category.productCount} produk tersedia</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Dibuat {formatDate(category.createdAt)}</span>
                          </div>
                          {category.updatedAt !== category.createdAt && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>
                                Diperbarui {formatDate(category.updatedAt)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button variant="outline" size="lg" asChild>
                            <Link href="/categories">
                              <Grid3X3 className="w-4 h-4 mr-2" />
                              Kategori Lainnya
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Total Produk
                    </p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Subkategori
                    </p>
                    <p className="text-2xl font-bold">
                      {category.subcategories.length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </p>
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {category.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subcategories Section */}
              {category.subcategories && category.subcategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-8"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        Subkategori
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.subcategories.map((subcategory, index) => (
                          <motion.div
                            key={subcategory}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card
                              className={`hover:shadow-md transition-shadow cursor-pointer ${
                                selectedSubcategory === subcategory
                                  ? "ring-2 ring-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedSubcategory(
                                  selectedSubcategory === subcategory
                                    ? ""
                                    : subcategory
                                );
                                setCurrentPage(1);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mr-3">
                                    <Tag className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{subcategory}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Subkategori
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Products Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <CardTitle className="flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Produk dalam Kategori {category.name}
                        <Badge variant="secondary" className="ml-2">
                          {totalProducts}
                        </Badge>
                      </CardTitle>

                      {/* Search and Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                          <Input
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64"
                          />
                          <Button type="submit" size="icon" variant="outline">
                            <Search className="w-4 h-4" />
                          </Button>
                        </form>

                        <div className="flex gap-2">
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="createdAt">Terbaru</SelectItem>
                              <SelectItem value="name">Nama</SelectItem>
                              <SelectItem value="price">Harga</SelectItem>
                              {/* <SelectItem value="rating">Rating</SelectItem> */}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                          >
                            {sortOrder === "asc" ? (
                              <SortAsc className="w-4 h-4" />
                            ) : (
                              <SortDesc className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedSubcategory || searchQuery) && (
                      <div className="flex gap-2 mt-4">
                        {selectedSubcategory && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {selectedSubcategory}
                            <button
                              onClick={() => {
                                setSelectedSubcategory("");
                                setCurrentPage(1);
                              }}
                              className="ml-1 hover:bg-muted rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </Badge>
                        )}
                        {searchQuery && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            Search: "{searchQuery}"
                            <button
                              onClick={() => {
                                setSearchQuery("");
                                setCurrentPage(1);
                              }}
                              className="ml-1 hover:bg-muted rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent>
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                          <Card key={i} className="h-80">
                            <div className="aspect-square bg-muted animate-pulse rounded-t-lg" />
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded animate-pulse" />
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : products.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                          {products.map((product, index) => (
                            <motion.div
                              key={product._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <ProductCard product={product} />
                            </motion.div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>

                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                              const page = i + 1;
                              return (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </Button>
                              );
                            })}

                            <Button
                              variant="outline"
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Tidak ada produk
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery || selectedSubcategory
                            ? "Tidak ada produk yang sesuai dengan filter"
                            : "Belum ada produk dalam kategori ini"}
                        </p>
                        {(searchQuery || selectedSubcategory) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedSubcategory("");
                              setCurrentPage(1);
                            }}
                          >
                            Reset Filter
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              {/* </motion.div> */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
