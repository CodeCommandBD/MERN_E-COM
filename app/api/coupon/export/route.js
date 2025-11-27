import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CouponModel from "@/Models/Coupon.model";

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

    const getCoupons = await CouponModel.find(filter).sort({ createdAt: -1 }).lean();
    if (!getCoupons) {
      return res(false, 404, "Collection empty.");
    }

    return res(true, 200, "Coupons found.", getCoupons);
  } catch (error) {
    return catchError(error);
  }
}
