import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";
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
      return res(false, 400, "Invalid product variant id.");
    }
    filter._id = id;
    const getProductVariant = await ProductVariantModel.findOne(filter)
      .populate("media", "_id secure_url thumbnail_url alt title")
      .lean();
    if (!getProductVariant) {
      return res(false, 404, "Product variant not found.");
    }
    return res(true, 200, "Product variant found.", getProductVariant);
  } catch (error) {
    return catchError(error);
  }
}
