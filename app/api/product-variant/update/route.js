import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/Models/Product.Variant.model";

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
    const validateData = validate.data;

    const getProductVariant = await ProductVariantModel.findOne({
      deletedAt: null,
      _id: validateData._id,
    });
    if (!getProductVariant) {
      return res(false, 404, "Product variant not found.");
    }

    getProductVariant.color = validateData.color;
    getProductVariant.sku = validateData.sku;
    getProductVariant.size = validateData.size;
    getProductVariant.product = validateData.product;
    getProductVariant.mrp = validateData.mrp;
    getProductVariant.sellingPrice = validateData.sellingPrice;
    getProductVariant.discountPercentage = validateData.discountPercentage;
    getProductVariant.media = validateData.media;
    await getProductVariant.save();
    return res(true, 200, "Product variant updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
