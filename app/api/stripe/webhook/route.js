import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import StripePaymentModel from "@/Models/StripePayment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;

    // Only verify webhook signature if webhook secret is configured
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
          { success: false, message: `Webhook Error: ${err.message}` },
          { status: 400 }
        );
      }
    } else {
      // Development mode: parse event without verification
      console.warn(
        "⚠️  Webhook secret not configured - skipping signature verification (development only)"
      );
      event = JSON.parse(body);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Get order ID from metadata
      const orderId = session.metadata.orderId;

      // Update Stripe payment record
      const stripePayment = await StripePaymentModel.findOne({
        sessionId: session.id,
      });

      if (stripePayment) {
        stripePayment.paymentIntentId = session.payment_intent;
        stripePayment.customerId = session.customer;
        stripePayment.status = "succeeded";
        stripePayment.paymentCompletedAt = new Date();
        await stripePayment.save();
      }

      // Update order status
      const order = await OrderModel.findById(orderId);

      if (order) {
        order.paymentStatus = "paid";
        // Keep orderStatus as pending to allow 12h cancellation window
        order.orderStatus = "pending";
        order.transactionId = session.payment_intent;
        order.paidAt = new Date();
        await order.save();

        console.log(`Order ${order.orderNumber} payment confirmed`);
      }
    }

    // Handle payment_intent.payment_failed event
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      // Update payment record
      const stripePayment = await StripePaymentModel.findOne({
        paymentIntentId: paymentIntent.id,
      });

      if (stripePayment) {
        stripePayment.status = "failed";
        await stripePayment.save();

        // Update order
        const order = await OrderModel.findById(stripePayment.orderId);
        if (order) {
          order.paymentStatus = "failed";
          await order.save();
        }
      }
    }

    return NextResponse.json(
      { success: true, received: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Webhook handler failed",
      },
      { status: 500 }
    );
  }
}
