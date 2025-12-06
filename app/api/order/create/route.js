import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      customerInfo,
      shippingAddress,
      items,
      pricing,
      paymentMethod,
      orderNote,
      couponCode,
      userId,
      transactionId,
    } = body;

    // Validate required fields
    if (
      !customerInfo ||
      !shippingAddress ||
      !items ||
      !pricing ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["cash"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment method for this endpoint" },
        { status: 400 }
      );
    }

    // Create order
    const order = await OrderModel.create({
      userId: userId || null,
      customerInfo,
      shippingAddress,
      items,
      pricing,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      orderNote: orderNote || "",
      couponCode: couponCode || null,
      transactionId: transactionId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          order,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}
