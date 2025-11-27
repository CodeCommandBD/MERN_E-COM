import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CouponModel from "@/Models/Coupon.model";
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
      return res(false, 400, "Invalid coupon id.");
    }
    filter._id = id;
    const getCoupon = await CouponModel.findOne(filter).lean();
    if (!getCoupon) {
      return res(false, 404, "Coupon not found.");
    }
    return res(true, 200, "Coupon found.", getCoupon);
  } catch (error) {
    return catchError(error);
  }
}
