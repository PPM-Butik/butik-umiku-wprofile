'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Gamis',
    description: 'Koleksi gamis syari modern',
    image: 'https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 125,
    href: '/categories/gamis'
  },
  {
    id: 2,
    name: 'Hijab',
    description: 'Hijab premium berkualitas',
    image: 'https://images.pexels.com/photos/7691478/pexels-photo-7691478.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 85,
    href: '/categories/hijab'
  },
  {
    id: 3,
    name: 'Tunik',
    description: 'Tunik casual dan formal',
    image: 'https://images.pexels.com/photos/7691442/pexels-photo-7691442.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 95,
    href: '/categories/tunik'
  },
  {
    id: 4,
    name: 'Mukena',
    description: 'Mukena mewah dan nyaman',
    image: 'https://images.pexels.com/photos/7691481/pexels-photo-7691481.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 45,
    href: '/categories/mukena'
  },
  {
    id: 5,
    name: 'Khimar',
    description: 'Khimar syari terbaru',
    image: 'https://images.pexels.com/photos/7691480/pexels-photo-7691480.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 67,
    href: '/categories/khimar'
  },
  {
    id: 6,
    name: 'Abaya',
    description: 'Abaya elegan dan berkualitas',
    image: 'https://images.pexels.com/photos/7691479/pexels-photo-7691479.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 38,
    href: '/categories/abaya'
  }
];

export function CategoriesSection() {
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
            Temukan berbagai kategori busana muslim dengan desain modern dan kualitas terbaik
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.href}>
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
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.description}</p>
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
