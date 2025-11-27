import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const getProductVariant = await ProductVariantModel.find(filter)
      .select("-media -description")
      .sort({ createdAt: -1 })
      .lean();
    if (!getProductVariant) {
      return res(false, 404, "Collection empty.");
    }

    return res(true, 200, "Products found.", getProductVariant);
  } catch (error) {
    return catchError(error);
  }
}
