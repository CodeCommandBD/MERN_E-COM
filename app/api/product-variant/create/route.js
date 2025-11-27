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
      color: true,
      sku: true,
      size: true,
      product: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const variantData = validate.data;

    const existingProduct = await ProductModel.findOne({
      _id: variantData.product,
    });
    if (!existingProduct) {
      return res(false, 200, "Product not found.");
    }

    const newProduct = new ProductVariantModel({
      color: variantData.color,
      sku: variantData.sku,
      size: variantData.size,
      product: variantData.product,
      mrp: variantData.mrp,
      sellingPrice: variantData.sellingPrice,
      discountPercentage: variantData.discountPercentage,
      media: variantData.media,
    });
    await newProduct.save();

    return res(true, 200, "Product added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
