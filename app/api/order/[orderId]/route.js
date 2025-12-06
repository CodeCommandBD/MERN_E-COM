import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Auto-sync: If payment is paid but order is still pending,
    // update order status to confirmed (works for both COD and online payments)
    if (order.paymentStatus === "paid" && order.orderStatus === "pending") {
      order.orderStatus = "confirmed";
      await order.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}
