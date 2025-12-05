import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";

export async function PUT(request) {
  try {
    // check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    // Validate Status
    const validOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return res(false, 400, "Invalid order status");
    }

    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res(false, 400, "Invalid payment status");
    }

    if (!orderId || (!orderStatus && !paymentStatus)) {
      return res(false, 400, "Order ID and at least one status are required");
    }

    // connect to database
    await connectDB();

    // Build update object
    const updateData = {};
    if (orderStatus) {
      updateData.orderStatus = orderStatus;

      // Auto-update payment status to 'paid' if order is delivered
      // This is helpful for Cash on Delivery orders
      if (orderStatus === "delivered") {
        updateData.paymentStatus = "paid";
        updateData.paidAt = new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        updateData.paidAt = new Date();
      }
    }

    const order = await OrderModel.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!order) {
      return res(false, 404, "Order not found");
    }

    return res(true, 200, "Order status updated successfully", order);
  } catch (error) {
    return catchError(error);
  }
}
