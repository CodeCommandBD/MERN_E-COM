import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import { isAuthenticated } from "@/lib/authentication";

export async function GET(request) {
  try {
    // SECURITY: Authenticate user first - prevent unauthorized order access
    const auth = await isAuthenticated();
    
    if (!auth.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login to view your orders." },
        { status: 401 }
      );
    }

    await connectDB();

    // SECURITY: Only allow users to query their own orders
    // Ignore any email/userId from query params - use authenticated user's data
    const query = {
      $or: [
        { userId: auth._id }, // Orders placed when logged in
        { "customerInfo.email": auth.email } // Guest orders with same email
      ],
      deletedAt: null, // Exclude soft-deleted orders
    };

    // Fetch orders sorted by newest first
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
