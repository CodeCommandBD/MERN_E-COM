import { getProductDetails } from "@/lib/actions/product.action";
import { connectDB } from "@/lib/dbConnection";
import { catchError } from "@/lib/helper";

// Cache headers for product details
const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request, { params }) {
  try {
    const getProduct = await params;
    const slug = getProduct.slug;

    const searchParams = await request.nextUrl.searchParams;
    const color = searchParams.get("color");
    const size = searchParams.get("size");

    const data = await getProductDetails(slug, color, size);

    if (!data) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    // Check variant specifically if it was handled as a 404 in original code
    // The original code returned 404 if 'variant' was null.
    // getProductDetails returns { variant: ... }
    if (!data.variant) {
      return new Response(
        JSON.stringify({ success: false, message: "Variant not found." }),
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Product found.",
        data: data,
      }),
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (error) {
    return catchError(error);
  }
}
