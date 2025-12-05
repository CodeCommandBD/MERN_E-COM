import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request) {
  try {
    // Check if Stripe secret key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "STRIPE_SECRET_KEY is not set",
        },
        { status: 500 }
      );
    }

    // Try to initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Try to list products (this will fail if key is invalid)
    await stripe.products.list({ limit: 1 });

    return NextResponse.json(
      {
        success: true,
        message: "Stripe connection successful",
        keyPrefix: process.env.STRIPE_SECRET_KEY.substring(0, 20) + "...",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
