import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";

export async function GET(request) {
  try {
    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    // connect to database
    await connectDB();

    // For active orders: deletedAt is null or doesn't exist
    // For trash: deletedAt has any truthy value (Date or string)
    const searchParams = request.nextUrl.searchParams;
    const deleteType = searchParams.get("deleteType");

    let query = {
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    };
    if (deleteType === "trash") {
      query = { deletedAt: { $ne: null, $exists: true } };
    }

    console.log("Fetching orders with query:", JSON.stringify(query));

    // get filtered orders sorted by newest first
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    // return response
    return res(true, 200, "Orders fetched successfully", orders);
  } catch (error) {
    return catchError(error);
  }
}
