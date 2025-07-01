'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { CategoriesSection } from '@/components/sections/categories-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { BlogSection } from '@/components/sections/blog-section';
import { SocialMediaSection } from '@/components/sections/sosmed-section';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoriesSection />
        <TestimonialsSection />
        <BlogSection />
        <SocialMediaSection />
      </main>
      <Footer />
    </div>
  );
}
