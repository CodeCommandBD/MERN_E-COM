import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import MediaModel from "@/Models/Media.model";
import ProductVariantModel from "@/Models/Product.Variant.model";

export const POST = async (req) => {
  try {
    await connectDB();

    // // Ensure models are registered
    // ProductModel;
    // MediaModel;

    const payload = await req.json();

    const verifyCartData = await Promise.all(
      payload.map(async (cartItem) => {
        try {
          const variant = await ProductVariantModel.findById(cartItem.variantId)
            .populate("product")
            .populate("media", "secure_url")
            .lean();
          if (variant && variant.product) {
            return {
              productId: variant.product._id,
              variantId: variant._id,
              name: variant.product.name,
              url: variant.product.slug,
              color: variant.color,
              size: variant.size,
              mrp: variant.mrp,
              sellingPrice: variant.sellingPrice,
              image:
                variant.media && variant.media.length > 0
                  ? variant.media[0].secure_url
                  : "",
              discountPercentage: variant.discountPercentage,
              quantity: cartItem.quantity,
            };
          }
        } catch (error) {
          console.error(
            `Error verifying cart item ${cartItem.variantId}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out null values from failed verifications
    const validCartData = verifyCartData.filter((item) => item !== null);

    return res(true, "200", "Verification Successfull", validCartData);
  } catch (error) {
    return catchError(error);
  }
};
