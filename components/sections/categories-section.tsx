"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// Define the Category interface to match your API response
interface Category {
  _id: string;
  name: string;
  description: string;
  productCount: number;
  image?: string; // Optional image field from API
  href?: string; // Optional href if your API provides it or you construct it
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // A collection of placeholder background images
  const placeholderImages = [
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
    "https://i.pinimg.com/736x/e5/78/5c/e5785cdff3c252869cee1d636cd66e5f.jpg",
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    return placeholderImages[randomIndex];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories"); // Adjust this URL if your API endpoint is different
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Map API data to your Category interface and add random images if missing
        const fetchedCategories: Category[] = data.categories.map(
          (cat: any) => ({
            _id: cat._id,
            name: cat.name,
            description: cat.description,
            productCount: cat.productCount || 0, // Ensure productCount exists
            image: cat.image || getRandomImage(), // Use API image or a random one
            href: `/categories/${cat.name.toLowerCase().replace(/\s+/g, "-")}`, // Construct href
          })
        );
        setCategories(fetchedCategories);
      } catch (err: any) {
        setError(err.message);
        // Fallback to static data if API fails or returns no categories
        // This ensures the section is not empty
        const staticCategories = [
          
        ];
      }
    };

    // fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error && categories.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">
            Error: {error}. Displaying fallback categories.
          </p>
          {/* You might want to remove this if you only want to show static data on error, not an error message plus static data */}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Kategori Produk
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Jelajahi <span className="text-rose-600">Koleksi Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan berbagai kategori busana muslim dengan desain modern dan
            kualitas terbaik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id} // Use _id from API for key
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={
                  category.href ||
                  `/categories/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
                }
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <Badge className="w-fit mb-2 bg-white/20 text-white border-white/30">
                          {category.productCount} Produk
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
