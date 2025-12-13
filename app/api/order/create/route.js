import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import OrderModel from "@/Models/Order.model.js";
import ProductVariantModel from "@/Models/Product.Variant.model.js";
import { isAuthenticated } from "@/lib/authentication";
import xss from "xss";
import mongoose from "mongoose";

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

    // Authenticate user to determine valid userId
    // If authenticated, we MUST use the authored ID to prevent spoofing
    const auth = await isAuthenticated();
    let validatedUserId = null;
    let guestId = null;

    if (auth.isAuth) {
      validatedUserId = String(auth._id);
    } else {
      // For guest users, generate or use a guestId from request
      // This can be a UUID stored in browser localStorage
      guestId = body.guestId || null;
    }

    // SECURITY: Validate prices and stock against database
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const variant = await ProductVariantModel.findById(item.variantId)
        .select('sellingPrice mrp stock name');

      if (!variant) {
        return NextResponse.json(
          { success: false, message: `Product variant not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${variant.name}. Available: ${variant.stock}` },
          { status: 400 }
        );
      }

      const validatedItem = {
        ...item,
        sellingPrice: variant.sellingPrice,
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
      couponDiscount: pricing?.couponDiscount || 0,
      shippingFee: 0,
      total: calculatedSubtotal - (pricing?.couponDiscount || 0),
    };

    // Optional: verify client total vs server total
    if (pricing && typeof pricing.total === 'number') {
      const priceDifference = Math.abs(serverPricing.total - pricing.total);
      if (priceDifference > 0.01) {
        return NextResponse.json(
          {
            success: false,
            message: "Price mismatch detected. Please refresh your cart and try again.",
          },
          { status: 400 }
        );
      }
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

    // Atomically decrement stock and create order inside a transaction
    const session = await mongoose.startSession();
    let createdOrder;
    await session.withTransaction(async () => {
      // Decrement stock for each item with concurrency safety
      for (const item of validatedItems) {
        const updateRes = await ProductVariantModel.updateOne(
          { _id: item.variantId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (!updateRes.matchedCount || !updateRes.modifiedCount) {
          throw new Error(
            `Insufficient stock for ${item.name}. Please refresh and try again.`
          );
        }
      }

      // Create order using validated items and pricing
      createdOrder = await OrderModel.create(
        [
          {
            userId: validatedUserId,
            guestId: guestId,
            customerInfo: sanitizedCustomerInfo,
            shippingAddress: sanitizedShippingAddress,
            items: validatedItems,
            pricing: serverPricing,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
            orderNote: sanitizedOrderNote,
            couponCode: couponCode || null,
            transactionId: transactionId || null,
          },
        ],
        { session }
      );

      createdOrder = createdOrder[0];
    });
    session.endSession();

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: {
          orderId: createdOrder._id,
          orderNumber: createdOrder.orderNumber,
          order: createdOrder,
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
