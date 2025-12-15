import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const { id } = await params;
    
    console.log("Fetching order with ID:", id);

    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    // connect to database
    await connectDB();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id);
      return res(false, 400, "Invalid order ID format");
    }

    // get order by id
    const order = await OrderModel.findById(id);
    
    console.log("Order found:", order ? "Yes" : "No");

    if (!order) {
      return res(false, 404, "Order not found");
    }

    // return response
    return res(true, 200, "Order fetched successfully", order);
  } catch (error) {
    console.error("Error in GET /api/dashboard/admin/order/[id]:", error);
    return catchError(error);
  }
}
