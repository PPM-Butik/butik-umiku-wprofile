"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="w-3 h-3 mr-1" />
                Koleksi Terbaru 2025
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Fashion Muslim
                </span>
                <br />
                <span className="text-foreground">Modern & Elegan</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Temukan koleksi busana muslim terkini yang memadukan gaya modern
                dengan nilai-nilai islami. Untuk muslim-muslimah yang percaya
                diri dan berkarakter.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl font-bold text-rose-600">100+</span>
                </div>
                <p className="text-sm text-muted-foreground">Produk</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl font-bold text-rose-600">50+</span>
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-sm text-muted-foreground">Pelanggan Puas</p>
              </div>
              {/* <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl font-bold text-rose-600">4.9</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div> */}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/products">
                  Jelajahi Koleksi
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Lihat Kategori</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://scontent.fsrg5-3.fna.fbcdn.net/v/t39.30808-6/328105032_753411729439023_4744433210995863810_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFHrXJHo4EUatlICQDpn4_E3hmpbLJ1sZfeGalssnWxl6VYWTi9v2HIl3-9mYDnNXW3FIl6J9SShWALRznIhL6g&_nc_ohc=vl4Dzhd6RdkQ7kNvwEqi9YV&_nc_oc=AdkKtYZsZ1_4jaii_fnD8fHRu9V9ra2nKHr2mnBBrf5huAuruI1_2PXqCTbrFL8Lwb8&_nc_zt=23&_nc_ht=scontent.fsrg5-3.fna&_nc_gid=HldG2gAtNnQA20e3-f1Naw&oh=00_AfMjBR030lHzYVIq72-ouOOuwgfZeLV1wLHbpYbRtR4yZg&oe=686A1743"
                alt="Fashion Muslim Modern"
                className="w-full h-[600px] object-cover"
              />

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    100+ Produk Tersedia
                  </span>
                </div>
              </motion.div>
              {/* 
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute bottom-6 left-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">Rating 4.9/5</span>
                </div>
              </motion.div> */}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
