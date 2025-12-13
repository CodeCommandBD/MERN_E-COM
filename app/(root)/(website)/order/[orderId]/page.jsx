"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Package, Mail, Phone, MapPin, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_LOGIN, WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import Image from "next/image";
import OrderStatusTracker from "@/components/Order/OrderStatusTracker";
import { useSelector } from "react-redux";
import { emitOrderCountChange } from "@/lib/orderEvents";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderTracking() {
  const params = useParams();
  const pathname = usePathname();
  const orderId = params?.orderId;
  const auth = useSelector((state) => state.authStore.auth);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [cancelInProgress, setCancelInProgress] = useState(false);

  // Extract fetchOrder as a separate function for reusability
  const fetchOrder = async () => {
    if (!orderId) {
      setError("Invalid order ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/order/${orderId}`);

      if (response.data.success) {
        setOrder(response.data.data);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Refetch when navigating to this page (handles browser back/forward navigation)
  useEffect(() => {
    if (pathname && pathname.includes("/order/") && orderId) {
      fetchOrder();
    }
  }, [pathname]);

  const handleCancelOrder = async () => {
    if (cancelInProgress) return;

    setCancelInProgress(true);
    try {
      const response = await axios.put("/api/order/cancel", {
        orderId: order._id,
      });
      if (response.data.success) {
        // Update local state to reflect cancellation
        setOrder({
          ...order,
          orderStatus: "cancelled",
          cancelledAt: new Date(),
        });
        setIsDialogOpen(false);
        // Emit event to update order count in header instantly
        emitOrderCountChange();
        // No need to refetch - local state update is sufficient
      } else {
        alert(response.data.message);
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      // Handle errors gracefully (API is now idempotent)
      alert(err.response?.data?.message || "Failed to cancel order");
      setIsDialogOpen(false);
    } finally {
      setCancelInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-300 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild className="w-full">
            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href={WEBSITE_SHOP}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        {/* Order Header */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber}
              </p>
              {order.transactionId && (
                <p className="text-sm text-gray-600 mt-1">
                  Transaction ID:{" "}
                  <span className="font-medium font-mono text-gray-800">
                    {order.transactionId}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                ৳{order.pricing.total.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment Method</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {order.paymentMethod === "card"
                  ? "Card Payment"
                  : order.paymentMethod === "bkash"
                  ? "bKash"
                  : "Cash on Delivery"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div>
            {["pending", "confirmed"].includes(order.orderStatus) &&
              order.paymentStatus !== "paid" &&
              (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60) <=
                12 && (
                <div className="text-sm text-gray-500">
                  <p>
                    You can cancel this order within 12 hours of placing it.
                  </p>
                </div>
              )}
            {order.paymentStatus === "paid" &&
              ["pending", "confirmed"].includes(order.orderStatus) && (
                <div className="text-sm text-amber-600">
                  <p>
                    This order has been paid and cannot be cancelled online.
                    Please contact customer support for refund assistance.
                  </p>
                </div>
              )}
          </div>
          <div>
            {["pending", "confirmed"].includes(order.orderStatus) &&
              order.paymentStatus !== "paid" &&
              (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60) <=
                12 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!auth) {
                      setIsLoginDialogOpen(true);
                    } else {
                      setIsDialogOpen(true);
                    }
                  }}
                  disabled={cancelInProgress}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Order
                </Button>
              )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login Required
              </DialogTitle>
              <DialogDescription>
                You need to be logged in to cancel this order. Please login to
                verify your identity.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsLoginDialogOpen(false)}
              >
                Close
              </Button>
              <Button asChild>
                <Link href={`${WEBSITE_LOGIN}?callback=/order/${order._id}`}>
                  Login Now
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Order Status Tracker */}
        <div className="mb-6">
          <OrderStatusTracker
            orderStatus={order.orderStatus}
            paymentStatus={order.paymentStatus}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
            shippedAt={order.shippedAt}
            deliveredAt={order.deliveredAt}
            cancelledAt={order.cancelledAt}
          />
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="bg-white border-b border-gray-300 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h4>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ৳{(item.sellingPrice * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 bg-gray-50 border border-gray-300 rounded-md p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ৳{order.pricing.subtotal.toFixed(0)}
                  </span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Product Discount</span>
                    <span className="text-green-700">
                      -৳{order.pricing.discount.toFixed(0)}
                    </span>
                  </div>
                )}
                {order.pricing.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Coupon Discount</span>
                    <span className="text-green-700">
                      -৳{order.pricing.couponDiscount.toFixed(0)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ৳{order.pricing.total.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-gray-300 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">
              Delivery Information
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.customerInfo.name}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.landmark}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600">{order.customerInfo.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600">{order.customerInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
