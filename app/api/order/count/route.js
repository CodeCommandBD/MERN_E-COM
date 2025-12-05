import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, message: "Email or User ID is required" },
        { status: 400 }
      );
    }

    // Build query
    let query = {};

    if (userId && email) {
      query = {
        $or: [{ userId: userId }, { "customerInfo.email": email }],
      };
    } else if (userId) {
      query = { userId: userId };
    } else if (email) {
      query = { "customerInfo.email": email };
    }

    // Count active orders (not delivered or cancelled)
    query.orderStatus = {
      $nin: ["delivered", "cancelled"],
    };

    const count = await OrderModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        count: count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Count orders error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to count orders",
      },
      { status: 500 }
    );
  }
}
