import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import StripePaymentModel from "@/Models/StripePayment.model.js";
import ProductVariantModel from "@/Models/Product.Variant.model.js";
import { isAuthenticated } from "@/lib/authentication";
import xss from "xss";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // SECURITY: Verify userId from JWT, not request body to prevent spoofing
    const auth = await isAuthenticated();
    let validatedUserId = null;
    let guestId = null;

    if (auth.isAuth) {
      // User is logged in - use authenticated user ID
      validatedUserId = auth._id.toString();
    } else {
      // Guest checkout - use guestId from request or generate server-side
      guestId = null; // Will be set by body.guestId below
    }

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
      guestId: clientGuestId,
      // userId removed - no longer accept from client
    } = body;

    // For guest users, use client's guestId if not authenticated
    if (!auth.isAuth && clientGuestId) {
      guestId = clientGuestId;
    }

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || !pricing) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // SECURITY: Validate prices against database to prevent price manipulation
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      // Fetch actual price and stock from database
      const variant = await ProductVariantModel.findById(item.variantId)
        .select('sellingPrice mrp stock name');

      if (!variant) {
        return NextResponse.json(
          { success: false, message: `Product variant not found: ${item.name}` },
          { status: 400 }
        );
      }

      // Check stock availability
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${variant.name}. Available: ${variant.stock}` },
          { status: 400 }
        );
      }

      // Use DB price, not client-provided price
      const validatedItem = {
        ...item,
        sellingPrice: variant.sellingPrice, // ← Use DB value, ignore client
        mrp: variant.mrp,
      };

      validatedItems.push(validatedItem);
      calculatedSubtotal += variant.sellingPrice * item.quantity;
    }

    // Calculate server-side pricing
    const productDiscount = validatedItems.reduce((total, item) => {
      return total + (item.mrp - item.sellingPrice) * item.quantity;
    }, 0);

    const serverPricing = {
      subtotal: calculatedSubtotal + productDiscount, // MRP total
      discount: productDiscount,
      couponDiscount: pricing.couponDiscount || 0,
      shippingFee: 0,
      total: calculatedSubtotal - (pricing.couponDiscount || 0),
    };

    // CRITICAL: Verify client's total matches server calculation
    const priceDifference = Math.abs(serverPricing.total - pricing.total);
    if (priceDifference > 0.01) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Price mismatch detected. Please refresh your cart and try again.",
          debug: process.env.NODE_ENV === "development" ? {
            clientTotal: pricing.total,
            serverTotal: serverPricing.total,
            difference: priceDifference
          } : undefined
        },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize all text inputs to prevent XSS attacks
    const sanitizedCustomerInfo = {
      name: xss(customerInfo.name?.trim() || ''),
      email: customerInfo.email?.trim().toLowerCase() || '',
      phone: xss(customerInfo.phone?.trim() || ''),
    };

    const sanitizedShippingAddress = {
      landmark: xss(shippingAddress.landmark?.trim() || ''),
      city: xss(shippingAddress.city?.trim() || ''),
      state: xss(shippingAddress.state?.trim() || ''),
      country: xss(shippingAddress.country?.trim() || ''),
      pincode: xss(shippingAddress.pincode?.trim() || ''),
    };

    const sanitizedOrderNote = xss(orderNote?.trim() || '');

    // Create pending order using new + save to trigger pre-save hook
    const order = new OrderModel({
      userId: validatedUserId, // Use verified ID from JWT, not client
      guestId: guestId, // Track guest orders
      customerInfo: sanitizedCustomerInfo,
      shippingAddress: sanitizedShippingAddress,
      items: validatedItems, // Use validated items with DB prices
      pricing: serverPricing, // Use server-calculated pricing
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "pending",
      orderNote: sanitizedOrderNote,
      couponCode: couponCode || null,
    });

    // Save to trigger pre-save hook that generates orderNumber
    await order.save();

    // Create Stripe line items from server-validated items
    const lineItems = validatedItems.map((item) => ({
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
