import mongoose from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  reviews?: IReview[];
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id?: string;
  user: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

const ReviewSchema = new mongoose.Schema(
  {
    // Changed from ObjectId to String to support demo mode
    user: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
