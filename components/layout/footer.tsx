"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  MessageCircle,
  Music,
  FacebookIcon,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* BRAND / LOGO */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  ETHICA STORE
                </h3>
                <p className="text-xs">BUTIK UMIKU BANJARATMA</p>
              </div>
            </div>
            <p>
              Butik fashion modern dengan koleksi terkini untuk wanita muslimah
              yang elegan dan berkualitas.
            </p>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" asChild>
                <Link href="https://wa.me/6281234567890" aria-label="WhatsApp">
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link
                  href="https://instagram.com/ethica_banjaratama_brebes"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link
                  href="https://facebook.com/ethica.banjaratma"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href="#" aria-label="TikTok">
                  <Music className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-pink-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-pink-600 transition-colors"
                >
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-pink-600 transition-colors"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-pink-600 transition-colors"
                >
                  Blog Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-pink-600 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              Kontak Kami
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Banjaratma, Brebes, Jawa Tengah</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4" />
                <span>@ethica_banjaratama_brebes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FacebookIcon className="h-4 w-4" />
                <span>Ethica Banjaratma Brebes</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs">
            © {currentYear} Butik Umiku Ethica Store Banjaratma. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
