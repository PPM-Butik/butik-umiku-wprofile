"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
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
  // rating: number;
  totalReviews: number;
}

export default function ProductDetailPage() {
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
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
        // Fallback to demo product if API fails
        // const demoProduct: Product = {};
        // setProduct(demoProduct);
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
                  <div className="h-[400px] w-full overflow-hidden rounded-lg">
                    <img
                      src={
                        product.images[selectedImage] ||
                        "/placeholder.svg?height=500&width=500"
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

                  {/* Rating */}
                  {/* <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({product.totalReviews} ulasan)
                    </span>
                  </div> */}

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

                  {/* Size Selection */}
                  {product.sizes.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ukuran:</label>
                      <Select
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih ukuran" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Warna:</label>
                      <Select
                        value={selectedColor}
                        onValueChange={setSelectedColor}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih warna" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {product.fabric && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Bahan:</span>
                        <Badge variant="outline">{product.fabric}</Badge>
                      </div>
                    )}
                  </div>

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

                  {/* Action Buttons */}
                  {/* <div className="space-y-4">
                    <div className="flex space-x-4">
                      <Button
                        size="lg"
                        className="flex-1"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {product.stock > 0
                          ? "Tambah ke Keranjang"
                          : "Stok Habis"}
                      </Button>
                      <Button variant="outline" size="lg">
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="lg">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>

                    {product.stock > 0 && (
                      <Button variant="outline" size="lg" className="w-full">
                        Beli Sekarang
                      </Button>
                    )}
                  </div> */}

                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => setShowModal(true)}
                    >
                      Beli Sekarang
                    </Button>
                  </div>

                  {/* Features */}
                  {/* <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                    <div className="text-center">
                      <Truck className="w-6 h-6 mx-auto mb-2 text-rose-600" />
                      <p className="text-sm font-medium">Gratis Ongkir</p>
                      <p className="text-xs text-muted-foreground">
                        Min. pembelian 200k
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield className="w-6 h-6 mx-auto mb-2 text-rose-600" />
                      <p className="text-sm font-medium">Garansi Kualitas</p>
                      <p className="text-xs text-muted-foreground">
                        100% original
                      </p>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="w-6 h-6 mx-auto mb-2 text-rose-600" />
                      <p className="text-sm font-medium">Easy Return</p>
                      <p className="text-xs text-muted-foreground">
                        7 hari tukar barang
                      </p>
                    </div>
                  </div> */}

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
          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 relative text-gray-800">
            {/* Tombol Tutup */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-black/70 hover:text-black text-2xl font-bold"
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
