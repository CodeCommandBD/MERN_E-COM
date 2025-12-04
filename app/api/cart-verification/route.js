import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";


export const POST = async (req) => {
  try {
    await connectDB();
    const payload = await req.json();

    const verifyCartData = await Promise.all(
      payload.map(async (cartItem) => {
        const variant = await ProductVariantModel.findById(cartItem.variantId)
          .populate("product")
          .populate("media", "secure_url")
          .lean();
        if (variant) {
          return {
            productId: variant.product._id,
            variantId: variant._id,
            name: variant.product.name,
            url: variant.product.slug,
            color: variant.color,
            size: variant.size,
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            image: variant.media[0].secure_url,
            discountPercentage: variant.discountPercentage,
            quantity: cartItem.quantity,
          };
        }
      })
    );

    return res(true, "200", "Verification Successfull", verifyCartData);
  } catch (error) {
    return catchError(error);
  }
};
