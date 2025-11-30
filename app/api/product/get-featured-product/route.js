import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import MediaModel from "@/Models/Media.model"; // Required for populate

export async function GET() {
  try {
    await connectDB();

    const getProduct = await ProductModel.find({ deletedAt: null })
      .populate("media")
      .limit(8)
      .lean();

    if (!getProduct) {
      return res(false, 404, "Product not found.");
    }

    return res(true, 200, "Product found.", getProduct);
  } catch (error) {
    console.error("Error in get-featured-product:", error);
    return catchError(error);
  }
}
