import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");
    const orderIds = searchParams.get("orderIds");

    if (!email && !userId && !orderIds) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, User ID, or Order IDs are required",
        },
        { status: 400 }
      );
    }

    // Validate userId if provided
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid User ID format",
        },
        { status: 400 }
      );
    }

    // Build query
    let query = {};

    if (userId && mongoose.Types.ObjectId.isValid(userId) && email) {
      query = {
        $or: [{ userId: userId }, { "customerInfo.email": email }],
      };
    } else if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query = { userId: userId };
    } else if (email) {
      query = { "customerInfo.email": email };
    }

    // Handle multiple order IDs (for guest users)
    if (orderIds) {
      const ids = orderIds
        .split(",")
        .filter(
          (id) => id.trim() !== "" && mongoose.Types.ObjectId.isValid(id)
        );

      if (ids.length > 0) {
        // If we have specific IDs, add them to the query
        // If userId or email was also provided, it acts as an AND condition (security)
        // If neither was provided (guest), we just query by these IDs
        query._id = { $in: ids };
      } else if (!userId && !email) {
        // If only orderIds were provided but none were valid, return 0 count immediately
        return NextResponse.json(
          {
            success: true,
            count: 0,
          },
          { status: 200 }
        );
      }
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
