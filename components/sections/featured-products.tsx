"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  // rating?: number;
  // reviews?: number;
  isNew?: boolean;
  discount?: number;
  featured?: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?featured=true&limit=4");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            Produk Pilihan
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Koleksi <span className="text-rose-600">Terfavorit</span>
          </h2>
          <div className="p-8 rounded-lg border border-red-200 bg-red-50 text-red-800">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Produk Pilihan
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Koleksi <span className="text-rose-600">Terfavorit</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Produk-produk terbaik pilihan kami dengan kualitas premium dan
            desain terkini
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-64" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Belum ada produk yang ditambahkan.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/products/new">Tambah Produk</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          product.images?.[0] ||
                          "/placeholder.svg?height=256&width=384"
                        }
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Baru
                          </Badge>
                        )}
                        {product.discount && (
                          <Badge variant="destructive">
                            -{product.discount}%
                          </Badge>
                        )}
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
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="hover:text-rose-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      <div className="flex items-center mb-2">
                        {/* <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium ml-1">
                            {product.rating || 5.0}
                          </span>
                        </div> */}
                        {/* <span className="text-sm text-muted-foreground ml-2">
                          ({product.reviews || 0} ulasan)
                        </span> */}
                      </div>

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
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
