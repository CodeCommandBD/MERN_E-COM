import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";
import ProductModel from "@/Models/Product.model";
import UserModel from "@/Models/user.models";
import OrderModel from "@/Models/Order.model";

export async function GET(params) {
  try {
    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    // connect to database
    await connectDB();

    // get counts
    const [category, product, customer, order] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      UserModel.countDocuments({ deletedAt: null }),
      OrderModel.countDocuments(),
    ]);

    // return response
    return res(true, 200, "Dashboard counts", {
      category,
      product,
      customer,
      order,
    });
  } catch (error) {
    return catchError(error);
  }
}
