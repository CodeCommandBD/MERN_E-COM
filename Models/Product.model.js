import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // brand: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Brand',
    //     required: true,
    // },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MEDIA",
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Performance indexes for common queries

productSchema.index({ category: 1, sellingPrice: 1 }); // Category + price sorting
productSchema.index({ category: 1, createdAt: -1 }); // Category + newest first
productSchema.index({ deletedAt: 1, category: 1 }); // Filter deleted + category
productSchema.index({ name: "text", description: "text" }); // Text search

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "products");

export default ProductModel;
