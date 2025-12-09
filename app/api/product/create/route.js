import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/Models/Product.model";
import { encode } from "entities";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      stock: true,
      description: true,
      media: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      console.error('Validation error:', validate.error);
      return res(false, 400, "Invalid or missing fields.", validate.error.errors);
    }
    const produductData = validate.data;

    const existingProduct = await ProductModel.findOne({
      name: produductData.name,
    });
    if (existingProduct) {
      return res(false, 200, "Product already created.");
    }

    const newProduct = new ProductModel({
      name: produductData.name,
      slug: produductData.slug,
      category: produductData.category,
      mrp: produductData.mrp,
      sellingPrice: produductData.sellingPrice,
      discountPercentage: produductData.discountPercentage,
      stock: produductData.stock || 0,
      description: encode(produductData.description),
      media: produductData.media,
      sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
    await newProduct.save();

    return res(true, 200, "Product added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
