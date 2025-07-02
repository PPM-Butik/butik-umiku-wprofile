"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Plus, X, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Category {
  _id: string;
  name: string;
  description?: string;
  subcategories: string[];
  productCount?: number;
  isActive?: boolean;
}

interface CategoriesResponse {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  isDemo?: boolean;
  error?: string;
}

export default function NewProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    fabric: "",
    stock: "",
    featured: false,
  });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      // Fetch all categories without pagination for product form
      const response = await fetch(
        "/api/categories?limit=100&sortBy=name&sortOrder=asc"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoriesResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Filter only active categories
      const activeCategories = data.categories.filter(
        (cat) => cat.isActive !== false
      );
      setCategories(activeCategories);

      // Show demo mode warning if applicable
      if (data.isDemo) {
        toast.info("Using demo categories - database not connected");
      }

      console.log(
        `Loaded ${activeCategories.length} categories for product form`
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load categories";
      setCategoriesError(errorMessage);
      toast.error(`Failed to load categories: ${errorMessage}`);

      // Set empty categories array on error
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
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

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
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

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.fabric ||
      images.length === 0
    ) {
      toast.error(
        "Please complete all required fields (name, description, price, category, fabric) and upload at least 1 image"
      );
      return;
    }

    // Validate category exists in the loaded categories
    const categoryExists = categories.some(
      (cat) => cat.name === formData.category
    );
    if (!categoryExists) {
      toast.error(
        "Selected category is not valid. Please refresh and try again."
      );
      return;
    }

    // Validate subcategory if provided
    if (formData.subcategory) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );
      const subcategoryExists = selectedCategory?.subcategories.includes(
        formData.subcategory
      );
      if (!subcategoryExists) {
        toast.error("Selected subcategory is not valid for this category.");
        return;
      }
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseInt(formData.price),
        originalPrice: formData.originalPrice
          ? Number.parseInt(formData.originalPrice)
          : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        fabric: formData.fabric,
        sizes,
        colors,
        images,
        stock: Number.parseInt(formData.stock) || 0,
        featured: formData.featured,
        tags,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Product successfully added");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">
                Add a new product to the store catalog
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Error Alert */}
        {categoriesError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load categories: {categoriesError}
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={fetchCategories}
                  disabled={categoriesLoading}
                >
                  {categoriesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Retry"
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Main information about the product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fabric">Fabric/Material *</Label>
                      <Input
                        id="fabric"
                        name="fabric"
                        value={formData.fabric}
                        onChange={handleInputChange}
                        placeholder="Enter fabric type (e.g., Cotton, Polyester, Denim, etc.)"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Set product pricing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Sale Price *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">
                          Original Price (Optional)
                        </Label>
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Variants */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                    <CardDescription>
                      Product sizes, colors, and tags
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sizes */}
                    <div>
                      <Label>Sizes</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Add size"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addSize())
                          }
                        />
                        <Button type="button" onClick={addSize}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sizes.map((size) => (
                          <Badge
                            key={size}
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {size}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeSize(size)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Colors */}
                    <div>
                      <Label>Colors</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Add color"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addColor())
                          }
                        />
                        <Button type="button" onClick={addColor}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colors.map((color) => (
                          <Badge
                            key={color}
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {color}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeColor(color)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Tags */}
                    <div>
                      <Label>Tags</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 ml-1"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images *</CardTitle>
                    <CardDescription>
                      Upload product images (minimum 1 image, maximum 5 images)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      value={images}
                      onChange={setImages}
                      maxFiles={5}
                      folder="products"
                      disabled={loading}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category & Stock */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Category & Stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Category *</Label>
                      {categoriesLoading ? (
                        <div className="flex items-center space-x-2 p-2 border rounded">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Loading categories...
                          </span>
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="space-y-2">
                          <Select disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="No categories available" />
                            </SelectTrigger>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            No categories found.{" "}
                            <Link
                              href="/admin/categories/new"
                              className="text-rose-600 hover:underline"
                            >
                              Create a new category
                            </Link>
                          </p>
                        </div>
                      ) : (
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleSelectChange("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category.name}
                              >
                                {category.name}
                                {category.productCount !== undefined && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({category.productCount} products)
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {selectedCategory &&
                      selectedCategory.subcategories.length > 0 && (
                        <div>
                          <Label>Subcategory</Label>
                          <Select
                            value={formData.subcategory}
                            onValueChange={(value) =>
                              handleSelectChange("subcategory", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedCategory.subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Featured Product</Label>
                        <p className="text-sm text-muted-foreground">
                          Display on home page
                        </p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            featured: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || categories.length === 0}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Product
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        asChild
                      >
                        <Link href="/admin/products">Cancel</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
