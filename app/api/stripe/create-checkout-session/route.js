import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import StripePaymentModel from "@/Models/StripePayment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    } = body;

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || !pricing) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create pending order using new + save to trigger pre-save hook
    const order = new OrderModel({
      userId: userId || null,
      customerInfo,
      shippingAddress,
      items,
      pricing,
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "pending",
      orderNote: orderNote || "",
      couponCode: couponCode || null,
    });

    // Save to trigger pre-save hook that generates orderNumber
    await order.save();

    // Create Stripe line items from cart items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd", // Change to 'bdt' if your Stripe account supports it
        product_data: {
          name: item.name,
          description: `Color: ${item.color}, Size: ${item.size}`,
          images: [item.image],
        },
        unit_amount: Math.round(item.sellingPrice * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
      customer_email: customerInfo.email,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    // Create Stripe payment record
    await StripePaymentModel.create({
      orderId: order._id,
      sessionId: session.id,
      amount: pricing.total,
      currency: "usd",
      status: "pending",
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      metadata: {
        orderNumber: order.orderNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Checkout session created successfully",
        data: {
          sessionId: session.id,
          url: session.url,
          orderId: order._id,
          orderNumber: order.orderNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create checkout session",
        error:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
