import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";

import ProductVariantModel from "@/Models/Product.Variant.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      color: true,
      sku: true,
      size: true,
      product: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const variantData = validate.data;

    // Import ProductModel to fetch the product
    const ProductModel = (await import("@/Models/Product.model")).default;

    const existingProduct = await ProductModel.findOne({
      _id: variantData.product,
      deletedAt: null,
    });
    if (!existingProduct) {
      return res(false, 404, "Product not found.");
    }

    const newProductVariant = new ProductVariantModel({
      color: variantData.color,
      sku: variantData.sku,
      size: variantData.size,
      product: variantData.product,
      category: existingProduct.category,
      mrp: variantData.mrp,
      sellingPrice: variantData.sellingPrice,
      discountPercentage: variantData.discountPercentage,
      media: variantData.media,
    });
    await newProductVariant.save();

    return res(true, 200, "Product variant added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
