import { connectDB } from "@/lib/dbConnection";
import ProductModel from "@/Models/Product.model";
import ProductVariantModel from "@/Models/Product.Variant.model";
import ReviewModel from "@/Models/Review.model";
import MediaModel from "@/Models/Media.model"; // Ensure Media model is registered

import { unstable_noStore as noStore } from "next/cache";

export const getProductDetails = async (slug, color, size) => {
  try {
    // Always fetch fresh data (stock/pricing change frequently)
    noStore();
    await connectDB();

    if (!slug) return null;

    // Get product first
    const product = await ProductModel.findOne({ slug, deletedAt: null })
      .populate("media", "secure_url")
      .lean();

    if (!product) return null;

    // Build variant filter
    const variantFilter = { product: product._id };
    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    // Parallel queries
    const [variant, getColor, getSize, reviewCount, reviewStats, sampleReviews] = await Promise.all([
      ProductVariantModel.findOne(variantFilter)
        .populate("media", "secure_url")
        .lean(),
      ProductVariantModel.distinct("color", { product: product._id }),
      ProductVariantModel.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: "$size" } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, size: "$_id" } },
      ]),
      ReviewModel.countDocuments({ product: product._id, deletedAt: null }),
      // Get average rating for structured data
      ReviewModel.aggregate([
        { $match: { product: product._id, deletedAt: null } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
      ]),
      // Get sample reviews for structured data (top 5 reviews)
      ReviewModel.find({ product: product._id, deletedAt: null })
        .populate("user", "name")
        .sort({ rating: -1, createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Calculate average rating
    const averageRating = reviewStats.length > 0 && reviewStats[0].avgRating
      ? parseFloat(reviewStats[0].avgRating.toFixed(1))
      : null;

    // Return object structured like the API response data, but serialized
    return JSON.parse(
      JSON.stringify({
        products: product, // Key name matches original API response
        variant: variant,
        getColor: getColor,
        getSize: getSize.length ? getSize.map((item) => item.size) : [],
        reviewCount: reviewCount,
        averageRating: averageRating,
        sampleReviews: sampleReviews,
      })
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
