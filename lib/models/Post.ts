import mongoose from "mongoose";

export interface IPost {
  _id?: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images?: string[];
  category: string;
  tags: string[];
  published: boolean;
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    featuredImage: { type: String },
    images: [{ type: String }],
    category: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    // Changed from ObjectId to String to support demo mode
    author: { type: String, required: true },
    authorName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
