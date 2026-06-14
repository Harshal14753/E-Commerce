import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "USD" },
  images: [{ url: String, alt: String }],
  variants: [{ sku: String, price: Number, attributes: Object, stock: Number }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  stock: { type: Number, default: 0, min: 0 },
  attributes: { type: Object },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
