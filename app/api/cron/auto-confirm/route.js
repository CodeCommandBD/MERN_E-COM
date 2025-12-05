import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();

    // Calculate time 12 hours ago
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // Find all pending orders older than 12 hours
    // We update them to 'confirmed'
    const result = await OrderModel.updateMany(
      {
        orderStatus: "pending",
        createdAt: { $lte: twelveHoursAgo },
      },
      {
        $set: { orderStatus: "confirmed" },
      }
    );

    console.log(`Auto-confirmed ${result.modifiedCount} orders.`);

    return NextResponse.json(
      {
        success: true,
        message: `Auto-confirmed ${result.modifiedCount} orders`,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auto-confirm error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to auto-confirm orders",
      },
      { status: 500 }
    );
  }
}
