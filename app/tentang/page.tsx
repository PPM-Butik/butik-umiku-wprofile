"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Instagram,
  Facebook,
  Music,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16">
        <section className="container mx-auto px-4 max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-muted-foreground text-lg">
            ETHICA STORE adalah butik muslimah yang menghadirkan koleksi fashion
            muslim modern dan elegan, dengan kualitas terbaik dan desain
            terkini. Kami percaya bahwa busana muslim bisa membuat setiap wanita
            tampil percaya diri, stylish, dan tetap sesuai nilai-nilai islami.
          </p>
        </section>

        {/* Social Media Section */}
        <section className="container mx-auto px-4 max-w-3xl mb-24">
          <Card>
            <CardContent className="p-6 sm:p-10">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Hubungi & Ikuti Kami
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <Phone className="w-5 h-5 text-green-500" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span>Instagram</span>
                </a>

                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span>Facebook</span>
                </a>

                <a
                  href={process.env.NEXT_PUBLIC_TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <Music className="w-5 h-5 text-black dark:text-white" />
                  <span>TikTok</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonial Section */}
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4">
            {/* <h2 className="text-3xl font-bold text-center mb-12">
              Apa Kata <span className="text-rose-600">Pelanggan Kami</span>
            </h2> */}
            <TestimonialsSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
