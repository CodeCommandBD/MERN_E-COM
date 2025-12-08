import { connectDB } from "@/lib/dbConnection";
import ProductModel from "@/Models/Product.model";
import ProductVariantModel from "@/Models/Product.Variant.model";
import ReviewModel from "@/Models/Review.model";
import MediaModel from "@/Models/Media.model"; // Ensure Media model is registered

export async function getProductDetails({ slug, color, size }) {
  try {
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
    const [variant, getColor, getSize, reviewCount] = await Promise.all([
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
      ReviewModel.countDocuments({ product: product._id }),
    ]);

    // Return object structured like the API response data
    // Return object structured like the API response data, but serialized
    return JSON.parse(
      JSON.stringify({
        products: product, // Key name matches original API response
        variant: variant,
        getColor: getColor,
        getSize: getSize.length ? getSize.map((item) => item.size) : [],
        reviewCount: reviewCount,
      })
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}
