import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      code: true,
      discountPercentage: true,
      validity: true,
      miniShoppingAmount: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const couponData = validate.data;

    const existingCoupon = await CouponModel.findOne({
      code: couponData.code,
    });
    if (existingCoupon) {
      return res(false, 200, "Coupon already created.");
    }

    const newCoupon = new CouponModel({
      code: couponData.code,
      discountPercentage: couponData.discountPercentage,
      validity: couponData.validity,
      miniShoppingAmount: couponData.miniShoppingAmount,
    });
    await newCoupon.save();

    return res(true, 200, "Coupon added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
