import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model.js";

export async function PUT(request) {
  try {
    // Check authentication
    const auth = await isAuthenticated();

    if (!auth.isAuth) {
      const dbgMsg = auth.error ? auth.error.message : "No token found";
      return res(false, 401, `Unauthorized: ${dbgMsg}`);
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return res(false, 400, "Order ID is required");
    }

    // Connect to database
    await connectDB();

    // Find the order
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res(false, 404, "Order not found");
    }

    // Verify ownership
    // Converting both to strings for safe comparison
    if (order.userId && order.userId.toString() !== auth._id.toString()) {
      // If order has a userId, it must match the logged in user
      return res(false, 403, "You are not authorized to cancel this order");
    } else if (!order.userId) {
      // If order has no userId (guest checkout), check email match
      if (order.customerInfo.email !== auth.email) {
        return res(false, 403, "You are not authorized to cancel this order");
      }
    }

    // IDEMPOTENCY: If order is already cancelled, return success
    // This prevents errors when user clicks cancel button multiple times
    if (order.orderStatus === "cancelled") {
      return res(true, 200, "Order already cancelled", order);
    }

    // specific status check
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res(
        false,
        400,
        "Only pending or confirmed orders can be cancelled"
      );
    }

    // Prevent cancellation of orders that have already been paid (Stripe/bKash)
    // Only Cash on Delivery orders with pending payment can be cancelled by users
    if (order.paymentStatus === "paid") {
      return res(
        false,
        400,
        "Orders that have been paid cannot be cancelled. Please contact customer support for refund assistance."
      );
    }

    // Check time window (12 hours)
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - orderDate; // in milliseconds
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 12) {
      return res(false, 400, "Cancellation window (12 hours) has expired");
    }

    // Update order status
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();

    // If payment was not made (pending), mark it as failed (cancelled)
    if (order.paymentStatus === "pending") {
      order.paymentStatus = "failed"; // "failed" acts as "cancelled" for payment
    }
    // If paymentStatus is "paid", we KEEP it as "paid" so admin knows to refund.

    await order.save();

    return res(true, 200, "Order cancelled successfully", order);
  } catch (error) {
    return catchError(error);
  }
}
