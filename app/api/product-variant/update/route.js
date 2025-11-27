import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/Models/Product.model";

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
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const validateData = validate.data;

    const getProduct = await ProductModel.findOne({
      deletedAt: null,
      _id: validateData._id,
    });
    if (!getProduct) {
      return res(false, 404, "Product not found.");
    }

    getProduct.name = validateData.name;
    getProduct.slug = validateData.slug;
    getProduct.category = validateData.category;
    getProduct.mrp = validateData.mrp;
    getProduct.sellingPrice = validateData.sellingPrice;
    getProduct.discountPercentage = validateData.discountPercentage;
    getProduct.description = encodeURI(validateData.description);
    getProduct.media = validateData.media;
    await getProduct.save();
    return res(true, 200, "Product updated successfully.");
  } catch (error) {
    return catchError(error);
  }
}
