import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    await connectDB();

    const activeFilter = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };

    // Get total count
    const total = await ProductVariantModel.countDocuments({});
    
    // Get active count
    const active = await ProductVariantModel.countDocuments(activeFilter);
    
    // Get trashed count
    const trashed = await ProductVariantModel.countDocuments({
      deletedAt: { $exists: true, $ne: null }
    });

    // Format status data
    const statusData = [
      { status: "total", count: total },
      { status: "active", count: active },
      { status: "trashed", count: trashed },
    ];

    return res(true, 200, "Product variant stats fetched successfully", {
      statusData,
    });
  } catch (error) {
    return catchError(error);
  }
}

