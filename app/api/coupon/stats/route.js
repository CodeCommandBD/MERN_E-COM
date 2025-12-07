import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import couponModel from "@/Models/Coupon.model";

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
    const now = new Date();

    // Get total count
    const total = await couponModel.countDocuments({});
    
    // Get active count (not deleted and not expired)
    const active = await couponModel.countDocuments({
      ...activeFilter,
      validity: { $gte: now }
    });
    
    // Get expired count (not deleted but expired)
    const expired = await couponModel.countDocuments({
      ...activeFilter,
      validity: { $lt: now }
    });
    
    // Get trashed count
    const trashed = await couponModel.countDocuments({
      deletedAt: { $exists: true, $ne: null }
    });

    // Format status data
    const statusData = [
      { status: "total", count: total },
      { status: "active", count: active },
      { status: "expired", count: expired },
      { status: "trashed", count: trashed },
    ];

    return res(true, 200, "Coupon stats fetched successfully", {
      statusData,
    });
  } catch (error) {
    return catchError(error);
  }
}

