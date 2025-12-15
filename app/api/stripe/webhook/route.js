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
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      // SECURITY: Fail-safe - reject in production if webhook secret not configured
      if (process.env.NODE_ENV === "production") {
        console.error("STRIPE_WEBHOOK_SECRET not configured in production!");
        return NextResponse.json(
          { success: false, message: "Webhook configuration error" },
          { status: 500 }
        );
      }
      // Development mode: parse event without verification (with warning)
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET not set - skipping signature verification (dev only)");
      event = JSON.parse(body);
    } else {
      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        return NextResponse.json(
          { success: false, message: `Webhook Error: ${err.message}` },
          { status: 400 }
        );
      }
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
        // Auto-confirm order when payment is successful
        order.orderStatus = "confirmed";
        order.transactionId = session.payment_intent;
        order.paidAt = new Date();
        await order.save();
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
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Webhook handler failed",
      },
      { status: 500 }
    );
  }
}
