'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Gift, Bell, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Berhasil berlangganan newsletter!');
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Newsletter
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Jangan Lewatkan <span className="text-rose-600">Update Terbaru</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Dapatkan info produk terbaru, promo eksklusif, dan tips fashion muslim langsung di email Anda
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <Gift className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="font-semibold">Promo Eksklusif</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Dapatkan diskon khusus dan penawaran terbatas hanya untuk subscriber
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <Bell className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="font-semibold">Info Produk Baru</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Jadilah yang pertama tahu tentang koleksi terbaru kami
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <Star className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="font-semibold">Tips Fashion</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Artikel dan tips fashion muslim dari para ahli
                </p>
              </motion.div>
            </div>

            {/* Newsletter Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isLoading} className="px-8">
                  {isLoading ? 'Mengirim...' : 'Berlangganan'}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                Dengan berlangganan, Anda menyetujui{' '}
                <a href="/privacy" className="underline hover:text-rose-600">
                  Kebijakan Privasi
                </a>{' '}
                kami. Anda dapat berhenti berlangganan kapan saja.
              </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>1000+ Subscriber Aktif</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Tanpa Spam</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Berhenti Kapan Saja</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
