'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Siti Nurhaliza',
    location: 'Jakarta',
    avatar: 'https://images.pexels.com/photos/7691476/pexels-photo-7691476.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Kualitas gamis sangat bagus, bahan adem dan jahitan rapi. Pelayanan juga ramah dan pengiriman cepat. Puas banget belanja di sini!',
    product: 'Gamis Syari Elegant',
    verified: true
  },
  {
    id: 2,
    name: 'Fatimah Az-Zahra',
    location: 'Bandung',
    avatar: 'https://images.pexels.com/photos/7691477/pexels-photo-7691477.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Hijab voalnya premium banget, tidak mudah kusut dan warnanya awet. Sudah order berkali-kali dan selalu puas dengan kualitasnya.',
    product: 'Hijab Premium Voal',
    verified: true
  },
  {
    id: 3,
    name: 'Aminah Rahmawati',
    location: 'Surabaya',
    avatar: 'https://images.pexels.com/photos/7691475/pexels-photo-7691475.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Tuniknya nyaman dipakai sehari-hari, modelnya trendy tapi tetap syari. Size chartnya akurat dan packagingnya rapih.',
    product: 'Tunik Casual Modern',
    verified: true
  },
  {
    id: 4,
    name: 'Khadijah Muslimah',
    location: 'Yogyakarta',
    avatar: 'https://images.pexels.com/photos/7691474/pexels-photo-7691474.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Mukena set-nya mewah dan halus, cocok untuk hadiah atau koleksi pribadi. Kualitas jahitan sangat detail dan finishing-nya bagus.',
    product: 'Set Mukena Mewah',
    verified: true
  },
  {
    id: 5,
    name: 'Maryam Solicha',
    location: 'Medan',
    avatar: 'https://images.pexels.com/photos/7691473/pexels-photo-7691473.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    comment: 'Khimar syarinya bagus banget, tidak transparent dan bahannya adem. Model simple tapi elegan, cocok untuk daily wear.',
    product: 'Khimar Syari Premium',
    verified: true
  },
  {
    id: 6,
    name: 'Aisyah Putri',
    location: 'Makassar',
    avatar: 'https://images.pexels.com/photos/7691472/pexels-photo-7691472.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    comment: 'Pelayanan customer servicenya sangat baik, fast response dan membantu. Produknya sesuai ekspektasi dan pengiriman aman.',
    product: 'Abaya Casual Set',
    verified: true
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Testimoni Pelanggan
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Apa Kata <span className="text-rose-600">Pelanggan Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Berikut adalah ulasan dari pelanggan setia Ethica Store
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-rose-200" />
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.comment}"
                  </p>

                  {/* Product */}
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.product}
                  </Badge>

                  {/* User Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
