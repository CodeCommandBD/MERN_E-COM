import { connectDB } from "@/lib/dbConnection";
import { catchError } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";

// Cache headers for categories (rarely change, cache longer)
const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
};

export async function GET() {
  try {
    await connectDB();
    const getCategory = await CategoryModel.find({ deletedAt: null }).lean();

    if (!getCategory) {
      return new Response(
        JSON.stringify({ success: false, message: "Category not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Category found.",
        data: getCategory,
      }),
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error) {
    return catchError(error);
  }
}
