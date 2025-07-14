"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, X, Save, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  featuredImage?: string;
  images?: string[];
  tags: string[];
  published: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    featuredImage: "",
    published: false,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Fashion Tips",
    "Trend Fashion",
    "Care Tips",
    "Lifestyle",
    "Event",
  ];

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/blog/${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setFormData({
          title: data.title || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          category: data.category || "",
          featuredImage: data.featuredImage || "",
          published: data.published || false,
        });
        setTags(data.tags || []);
        setImages(data.images || []);
      } else {
        toast.error("Gagal memuat artikel");
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Terjadi kesalahan saat memuat artikel");
      router.push("/admin/blog");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
        category: formData.category,
        featuredImage:
          formData.featuredImage || (images.length > 0 ? images[0] : ""),
        images,
        tags,
        published: formData.published,
      };

      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success("Artikel berhasil diperbarui");
        router.push("/admin/blog");
      } else {
        toast.error("Gagal memperbarui artikel");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <Button asChild>
            <Link href="/admin/blog">Kembali ke Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container py-10">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Edit Artikel</CardTitle>
            <CardDescription>Edit artikel blog yang sudah ada.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Judul <Badge className="ml-2">Wajib</Badge>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Judul artikel"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="content">
                  Konten <Badge className="ml-2">Wajib</Badge>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Isi artikel"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Kutipan</Label>
                <Input
                  type="text"
                  id="excerpt"
                  name="excerpt"
                  placeholder="Kutipan singkat artikel"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="category">
                  Kategori <Badge className="ml-2">Wajib</Badge>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Image Upload */}
              <div>
                <Label>Gambar Unggulan</Label>
                <ImageUpload
                  value={formData.featuredImage ? [formData.featuredImage] : []}
                  onChange={(urls) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredImage: urls[0] || "",
                    }))
                  }
                  maxFiles={1}
                  folder="blog/featured"
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Tag</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Tambah tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Images */}
              {/* <div>
                <Label>Gambar Tambahan</Label>
                <ImageUpload
                  value={images}
                  onChange={setImages}
                  maxFiles={5}
                  folder="blog/content"
                  disabled={loading}
                />
              </div> */}

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="mr-2">
                  Terbitkan
                </Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, published: checked }))
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/blog">Batal</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      Menyimpan...
                      <svg
                        className="animate-spin h-5 w-5 ml-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      Perbarui
                      <Save className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
