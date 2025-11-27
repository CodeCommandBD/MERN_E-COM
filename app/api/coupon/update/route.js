import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/Models/Coupon.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true,
      code: true,
      discountPercentage: true,
      validity: true,
      miniShoppingAmount: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const validateData = validate.data;

    const getCoupon = await CouponModel.findOne({
      deletedAt: null,
      _id: validateData._id,
    });
    if (!getCoupon) {
      return res(false, 404, "Coupon not found.");
    }

    getCoupon.code = validateData.code;
    getCoupon.discountPercentage = validateData.discountPercentage;
    getCoupon.validity = validateData.validity;
    getCoupon.miniShoppingAmount = validateData.miniShoppingAmount;
    await getCoupon.save();
    return res(true, 200, "Coupon updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
