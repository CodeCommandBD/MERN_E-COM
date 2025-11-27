import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const filter = {
      deletedAt: null,
    };

    if (!isValidObjectId(id)) {
      return res(false, 400, "Invalid product id.");
    }
    filter._id = id;
    const getProduct = await ProductModel.findOne(filter)
      .populate("media", "_id secure_url thumbnail_url alt title")
      .lean();
    if (!getProduct) {
      return res(false, 404, "Product not found.");
    }
    return res(true, 200, "Product found.", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
