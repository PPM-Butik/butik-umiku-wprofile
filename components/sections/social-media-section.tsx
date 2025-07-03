"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Instagram, Facebook, Music } from "lucide-react";
import { motion } from "framer-motion";

const socialMediaLinks = [
  {
    name: "WhatsApp",
    description: "Chat langsung untuk konsultasi dan pemesanan",
    icon: MessageCircle,
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/6281234567890",
    color: "bg-green-500 hover:bg-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-600",
    followers: "Aktif 24/7",
  },
  {
    name: "Instagram",
    description: "Lihat koleksi terbaru dan inspirasi fashion",
    icon: Instagram,
    url:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/ethica_banjaratama_brebes/",
    color:
      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-600",
    // followers: "2.5K Followers",
  },
  {
    name: "Facebook",
    description: "Bergabung dengan komunitas fashion muslim",
    icon: Facebook,
    url:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://web.facebook.com/ethicabanjaratama.brebes",
    color: "bg-blue-600 hover:bg-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600",
    // followers: "1.8K Likes",
  },
  {
    name: "TikTok",
    description: "Video fashion tips dan tutorial styling",
    icon: Music,
    url:
      process.env.NEXT_PUBLIC_TIKTOK_URL ||
      "https://www.tiktok.com/@ethica_banjaratma_brebes",
    color: "bg-black hover:bg-gray-800",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-800 dark:text-gray-200",
    // followers: "850 Followers",
  },
];

export function SocialMediaSection() {
  const handleSocialClick = (url: string, platform: string) => {
    // Track social media clicks if needed
    console.log(`Clicked ${platform}: ${url}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              Ikuti Kami
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Terhubung di <span className="text-rose-600">Media Sosial</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ikuti akun media sosial kami untuk mendapatkan update terbaru,
              inspirasi fashion, dan promo eksklusif
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {socialMediaLinks.map((social, index) => (
              <motion.div
                key={social.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-rose-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${social.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <social.icon
                          className={`h-6 w-6 ${social.textColor}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{social.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {social.followers}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {social.description}
                        </p>
                        <Button
                          onClick={() =>
                            handleSocialClick(social.url, social.name)
                          }
                          className={`w-full ${social.color} text-white`}
                          size="sm"
                        >
                          {social.name === "WhatsApp" && "Chat Sekarang"}
                          {social.name === "Instagram" && "Lihat Profile"}
                          {social.name === "Facebook" && "Kunjungi Halaman"}
                          {social.name === "TikTok" && "Tonton Video"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4">
              Butuh Bantuan atau Konsultasi?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim customer service kami siap membantu Anda memilih produk yang
              tepat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  handleSocialClick(socialMediaLinks[0].url, "WhatsApp")
                }
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat WhatsApp
              </Button>
              <Button
                onClick={() =>
                  handleSocialClick(socialMediaLinks[1].url, "Instagram")
                }
                variant="outline"
                size="lg"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Lihat di Instagram
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground mt-8"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Respon Cepat</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Terpercaya</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Update Harian</span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full" />
              <span>5K+ Followers</span>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
