import { connectDB } from "@/lib/dbConnection";
import { catchError } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import ProductVariantModel from "@/Models/Product.Variant.model";
import ReviewModel from "@/Models/Review.model";

// Cache headers for product details
const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request, { params }) {
  try {
    await connectDB();

    const getProduct = await params;
    const slug = getProduct.slug;

    const searchParams = await request.nextUrl.searchParams;
    const color = searchParams.get("color");
    const size = searchParams.get("size");

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    // Get product first (required for other queries)
    const product = await ProductModel.findOne({ slug, deletedAt: null })
      .populate("media", "secure_url")
      .lean();

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    // Build variant filter
    const variantFilter = { product: product._id };
    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    // PARALLELIZED: Fire all queries at once using Promise.all
    const [variant, getColor, getSize, reviewCount] = await Promise.all([
      // Get specific variant
      ProductVariantModel.findOne(variantFilter)
        .populate("media", "secure_url")
        .lean(),
      // Get all available colors
      ProductVariantModel.distinct("color", { product: product._id }),
      // Get all available sizes (sorted)
      ProductVariantModel.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: "$size" } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, size: "$_id" } },
      ]),
      // Get review count
      ReviewModel.countDocuments({ product: product._id }),
    ]);

    if (!variant) {
      return new Response(
        JSON.stringify({ success: false, message: "Variant not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    const productData = {
      products: product,
      variant: variant,
      getColor: getColor,
      getSize: getSize.length ? getSize.map((item) => item.size) : [],
      reviewCount: reviewCount,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Product found.",
        data: productData,
      }),
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error) {
    return catchError(error);
  }
}
