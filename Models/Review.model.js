import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
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
reviewSchema.index({ product: 1, deletedAt: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 });
reviewSchema.index({ rating: 1 });

const ReviewModel =
  mongoose.models["Review"] ||
  mongoose.model("Review", reviewSchema, "reviews");

export default ReviewModel;
