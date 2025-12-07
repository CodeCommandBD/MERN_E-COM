import { connectDB } from "@/lib/dbConnection";
import { catchError } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import MediaModel from "@/Models/Media.model"; // Required for populate

// Cache headers for featured products (medium cache, used on homepage)
const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET() {
  try {
    await connectDB();

    const getProduct = await ProductModel.find({ deletedAt: null })
      .populate("media")
      .limit(8)
      .lean();

    if (!getProduct) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Product found.",
        data: getProduct,
      }),
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error) {
    return catchError(error);
  }
}
