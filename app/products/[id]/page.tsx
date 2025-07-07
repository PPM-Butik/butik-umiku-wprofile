"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  fabric: string;
  images: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  rating: number;
  totalReviews: number;
}

export default function ProductDetailPage() {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        console.log("Fetched product:", data);
      } else {
        console.error("Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-96 bg-muted rounded" />
                  <div className="space-y-4">
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
            <Button asChild>
              <Link href="/products">Kembali ke Produk</Link>
            </Button>
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
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
              >
                <Button variant="ghost" asChild>
                  <Link href="/products">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Produk
                  </Link>
                </Button>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="h-[500px] w-full overflow-hidden rounded-lg">
                    <img
                      src={
                        product.images[selectedImage] ||
                        "/placeholder.svg?height=500&width=500" ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index
                              ? "border-rose-600"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg?height=80&width=80"}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Category and Featured Badge */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.featured && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Product Name */}
                  <h1 className="text-3xl font-bold">{product.name}</h1>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-rose-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-green-600 font-medium">
                        Hemat{" "}
                        {formatPrice(product.originalPrice - product.price)} (
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %)
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>

                  {/* Available Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Ukuran Tersedia:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <Badge
                            key={size}
                            variant="outline"
                            className="px-3 py-1 text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                          >
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Warna Tersedia:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <Badge
                            key={color}
                            variant="outline"
                            className="px-3 py-1 text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fabric Information */}
                  {product.fabric && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Bahan:
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {product.fabric}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Stock Info */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Stok:</span>
                    <Badge
                      variant={
                        product.stock > 10
                          ? "default"
                          : product.stock > 0
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} unit tersedia`
                        : "Habis"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setShowModal(true)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0
                        ? "Stok Habis"
                        : "Chat untuk Pemesanan"}
                    </Button>
                  </div>

                  {/* Tags */}
                  {product.tags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 relative text-gray-800 dark:text-gray-200">
            {/* Tombol Tutup */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white text-2xl font-bold"
              aria-label="Tutup"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-center">
              Lokasi Toko & Kontak
            </h2>

            {/* Google Maps Embed */}
            <div className="rounded overflow-hidden aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3960.880601134753!2d108.9820827!3d-6.9048788!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fa5b08df9cff5%3A0x47dd0aebe785d3a8!2sButik%20Umiku%20Ethica%20Store%20Banjaratma%20Bulakamba!5e0!3m2!1sid!2sid!4v1751400783747!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Tombol WhatsApp */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                Chat via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
