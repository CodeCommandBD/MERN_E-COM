import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";

export async function GET(params) {
  try {
    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    // connect to database
    await connectDB();

    // get all orders sorted by newest first
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(100);

    // return response
    return res(true, 200, "Orders fetched successfully", orders);
  } catch (error) {
    return catchError(error);
  }
}
