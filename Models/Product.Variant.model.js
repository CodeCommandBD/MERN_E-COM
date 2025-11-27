import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

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
      type: Number,
      required: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MEDIA",
        required: true,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

productVariantSchema.index({ product: 1 });

const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", productVariantSchema, "productVariants");

export default ProductVariantModel;
