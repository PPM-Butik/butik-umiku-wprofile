"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, ArrowLeft, Share2, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        // Fallback to demo post if API fails
        const demoPost: BlogPost = {
          _id: params.id as string,
          title: "Tips Memilih Gamis yang Tepat Sesuai Bentuk Tubuh",
          content: `
            <h2>Memilih Gamis Sesuai Bentuk Tubuh</h2>
            <p>Memilih gamis yang tepat sesuai dengan bentuk tubuh adalah kunci untuk tampil percaya diri dan nyaman. Setiap wanita memiliki bentuk tubuh yang unik, dan dengan memahami karakteristik tubuh Anda, Anda dapat memilih gamis yang paling flattering.</p>
            
            <h3>1. Bentuk Tubuh Pear (Buah Pir)</h3>
            <p>Jika Anda memiliki pinggul yang lebih lebar dibanding bahu, pilih gamis dengan detail di bagian atas seperti bordir atau aksen di dada. Hindari gamis yang terlalu ketat di bagian pinggul.</p>
            
            <h3>2. Bentuk Tubuh Apple (Buah Apel)</h3>
            <p>Untuk bentuk tubuh dengan bagian tengah yang lebih lebar, pilih gamis dengan potongan A-line yang mengalir dari bawah dada. Gamis dengan empire waist sangat cocok untuk bentuk tubuh ini.</p>
            
            <h3>3. Bentuk Tubuh Rectangle (Persegi)</h3>
            <p>Jika ukuran bahu, pinggang, dan pinggul hampir sama, Anda bisa bereksperimen dengan berbagai model gamis. Gamis dengan belt atau ikat pinggang dapat membantu menciptakan ilusi lekuk tubuh.</p>
            
            <h3>4. Bentuk Tubuh Hourglass (Jam Pasir)</h3>
            <p>Bentuk tubuh yang proporsional ini cocok dengan hampir semua model gamis. Pilih gamis yang mengikuti lekuk tubuh untuk menonjolkan bentuk alami Anda.</p>
            
            <h2>Tips Tambahan</h2>
            <ul>
              <li>Pilih bahan yang nyaman dan tidak mudah kusut</li>
              <li>Perhatikan panjang gamis sesuai dengan tinggi badan</li>
              <li>Sesuaikan warna dengan tone kulit Anda</li>
              <li>Pastikan ukuran pas, tidak terlalu ketat atau longgar</li>
            </ul>
            
            <p>Dengan memahami tips-tips di atas, Anda dapat memilih gamis yang tidak hanya indah dipandang, tetapi juga nyaman dikenakan dan sesuai dengan bentuk tubuh Anda.</p>
          `,
          excerpt:
            "Panduan lengkap memilih gamis yang sesuai dengan bentuk tubuh untuk tampilan yang lebih percaya diri dan nyaman.",
          featuredImage:
            "https://images.pexels.com/photos/7691483/pexels-photo-7691483.jpeg?auto=compress&cs=tinysrgb&w=600",
          category: "Fashion Tips",
          tags: ["gamis", "fashion", "tips", "bentuk tubuh"],
          authorName: "Admin Ethica",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPost(demoPost);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch("/api/blog?limit=3&published=true");
      if (response.ok) {
        const data = await response.json();
        setRelatedPosts(
          data.posts.filter((p: BlogPost) => p._id !== params.id)
        );
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-4" />
                <div className="h-64 bg-muted rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
            <Button asChild>
              <Link href="/blog">Kembali ke Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
              >
                <Button variant="ghost" asChild>
                  <Link href="/blog">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Blog
                  </Link>
                </Button>
              </motion.div>

              {/* Article Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="mb-4">
                  <Badge className="mb-4">{post.category}</Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold mb-6">
                  {post.title}
                </h1>

                <div className="flex items-center space-x-6 text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                {post.featuredImage && (
                  <div className="mb-8">
                    <img
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-64 lg:h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
              </motion.header>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              <Separator className="my-8" />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.slice(0, 3).map((relatedPost) => (
                      <Card
                        key={relatedPost._id}
                        className="group hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={
                                relatedPost.featuredImage ||
                                "/placeholder.svg?height=150&width=300"
                              }
                              alt={relatedPost.title}
                              className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {relatedPost.category}
                            </Badge>
                            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors">
                              <Link href={`/blog/${relatedPost._id}`}>
                                {relatedPost.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
