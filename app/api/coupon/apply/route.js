import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import couponModel from "@/Models/Coupon.model";

export async function POST(req) {
  try {
    await connectDB();
    const payLoad = await req.json();

    const couponFormSchema = zSchema.pick({
      code: true,
      miniShoppingAmount: true,
    });
    const validate = couponFormSchema.safeParse(payLoad);
    if (!validate.success) {
      return res(false, "400", "Missing or invalid data");
    }
    const { code, miniShoppingAmount } = validate.data;

    const coupon = await couponModel.findOne({ code }).lean();

    if (!coupon) {
      return res(false, "200", "Invalid coupon code or coupon expired");
    }
    if (new Date() > coupon.validity) {
      return res(false, "200", "Coupon code has expired");
    }
    if (coupon.miniShoppingAmount > miniShoppingAmount) {
      return res(
        false,
        "200",
        `Minimum order amount of ৳${coupon.miniShoppingAmount} required to apply this coupon`
      );
    }
    return res(true, "200", "Coupon applied successfully", {
      discountPercent: coupon.discountPercentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
