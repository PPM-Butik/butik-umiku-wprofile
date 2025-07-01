"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquareText, // Untuk WhatsApp (alternatif: Phone, MessageSquare)
  Instagram, // Untuk Instagram
  Facebook, // Untuk Facebook
  Sparkles, // Untuk TikTok (alternatif: Film, TrendingUp, Sparkles, Music)
} from "lucide-react"; // Import ikon dari lucide-react

export function SocialMediaSection() {
  // Ambil URL dari environment variables
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL;

  const socialMediaLinks = [
    {
      name: "WhatsApp",
      url: whatsappUrl,
      icon: MessageSquareText,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      description:
        "Hubungi kami langsung via WhatsApp untuk pertanyaan atau pemesanan.",
    },
    {
      name: "Instagram",
      url: instagramUrl,
      icon: Instagram,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      description:
        "Ikuti kami di Instagram untuk update produk terbaru dan gaya inspirasi.",
    },
    {
      name: "Facebook",
      url: facebookUrl,
      icon: Facebook,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      description:
        "Like halaman Facebook kami untuk berita, acara, dan promosi spesial.",
    },
    {
      name: "TikTok",
      url: tiktokUrl,
      icon: Sparkles, // Atau pilih ikon lain yang sesuai dari Lucide React
      color: "bg-black",
      hoverColor: "hover:bg-gray-800",
      description:
        "Tonton video pendek kami di TikTok untuk inspirasi outfit dan konten seru.",
    },
  ].filter((link) => link.url); // Filter out links with undefined URLs

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Main Icon - Menggunakan ikon Instagram dari Lucide sebagai contoh */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Hubungi Kami
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Terhubung dengan Kami di{" "}
                <span className="text-indigo-600">Media Sosial</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ikuti kami di berbagai platform media sosial untuk update
                terbaru, promosi menarik, dan interaksi langsung!
              </p>
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
              {socialMediaLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Button
                      className={`w-full flex flex-col items-center justify-center h-40 p-4 space-y-3 transition-all duration-300 rounded-lg shadow-md ${link.color} ${link.hoverColor} text-white`}
                      variant="ghost"
                    >
                      {/* Render ikon Lucide */}
                      {link.icon && <link.icon className="h-10 w-10 mb-2" />}
                      <span className="text-lg font-semibold">{link.name}</span>
                      <p className="text-xs opacity-80 text-center">
                        {link.description}
                      </p>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
