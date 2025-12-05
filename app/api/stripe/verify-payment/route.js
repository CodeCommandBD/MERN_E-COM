import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import StripePaymentModel from "@/Models/StripePayment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Find payment record
    const stripePayment = await StripePaymentModel.findOne({ sessionId });

    if (!stripePayment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    // Find order
    const order = await OrderModel.findById(stripePayment.orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update payment status if paid
    if (session.payment_status === "paid" && order.paymentStatus !== "paid") {
      // Update Order
      order.paymentStatus = "paid";
      // Keep orderStatus as pending to allow 12h cancellation window
      order.orderStatus = "pending";
      order.transactionId = session.payment_intent;
      order.paidAt = new Date();
      await order.save();

      // Update Stripe Payment Record
      stripePayment.status = "succeeded";
      stripePayment.paymentIntentId = session.payment_intent;
      stripePayment.customerId = session.customer;
      stripePayment.paymentCompletedAt = new Date();
      await stripePayment.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          paymentStatus: session.payment_status,
          order: {
            orderNumber: order.orderNumber,
            orderId: order._id,
            customerInfo: order.customerInfo,
            shippingAddress: order.shippingAddress,
            items: order.items,
            pricing: order.pricing,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
