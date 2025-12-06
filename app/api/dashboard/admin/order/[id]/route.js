import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    // connect to database
    await connectDB();

    // get order by id
    const order = await OrderModel.findById(id);

    if (!order) {
      return res(false, 404, "Order not found");
    }

    // return response
    return res(true, 200, "Order fetched successfully", order);
  } catch (error) {
    return catchError(error);
  }
}
