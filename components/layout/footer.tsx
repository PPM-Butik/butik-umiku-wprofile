'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Crown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
  Music
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  ETHICA STORE
                </h3>
                <p className="text-xs text-muted-foreground">BUTIK UMIKU BANJARATMA</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Butik fashion modern dengan koleksi terkini untuk wanita muslimah yang elegan dan berkualitas.
            </p>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" asChild>
                <Link href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}>
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}>
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href={process.env.NEXT_PUBLIC_FACEBOOK_URL || '#'}>
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href={process.env.NEXT_PUBLIC_TIKTOK_URL || '#'}>
                  <Music className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog Fashion
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Layanan Pelanggan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kebijakan Retur
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-muted-foreground hover:text-foreground transition-colors">
                  Panduan Ukuran
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Kontak Kami</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Banjaratma, Brebes, Jawa Tengah</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@ethicastore.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Newsletter</h5>
              <div className="flex space-x-2">
                <Input placeholder="Email Anda" className="text-xs" />
                <Button size="sm">Daftar</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} Butik Umiku Ethica Store Banjaratma. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
