import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    console.log("Fetching orders for:", { email, userId });

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, message: "Email or User ID is required" },
        { status: 400 }
      );
    }

    // Build query - search by userId OR email
    let query = {};

    if (userId) {
      // If userId provided, find orders with this userId OR this user's email
      query = {
        $or: [{ userId: userId }, { "customerInfo.email": email }],
      };
    } else if (email) {
      // If only email provided, find all orders with this email
      query = { "customerInfo.email": email };
    }

    // Fetch orders sorted by newest first
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log("Found orders:", orders.length);
    console.log("Query used:", JSON.stringify(query));

    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}
