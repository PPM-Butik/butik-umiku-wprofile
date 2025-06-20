import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: string;
  phone?: string;
  addresses?: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id?: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  isDefault: boolean;
}

const AddressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  province: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String },
    phone: { type: String },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
