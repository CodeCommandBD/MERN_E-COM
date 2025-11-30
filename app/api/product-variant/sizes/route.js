import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";

export async function GET() {
  try {
    await connectDB();
    const sizeOrder = {
      XS: 1,
      S: 2,
      M: 3,
      L: 4,
      XL: 5,
      XXL: 6,
      XXXL: 7,
      "2XL": 8,
      "3XL": 9,
      "4XL": 10,
      "5XL": 11,
    };
    const getSizes = await ProductVariantModel.distinct("size");
    if (!getSizes) {
      return res(false, 404, "Sizes not found.");
    }
    return res(
      true,
      200,
      "Sizes found.",
      getSizes.sort((a, b) => (sizeOrder[a] || 999) - (sizeOrder[b] || 999))
    );
  } catch (error) {
    return catchError(error);
  }
}
