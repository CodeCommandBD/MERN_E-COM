"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import Image from "next/image";
import OrderStatusTracker from "@/components/Order/OrderStatusTracker";
import { clearCart } from "@/store/reducer/cartReducer";
import { addOrder } from "@/store/reducer/orderReducer";
import { emitOrderCountChange } from "@/lib/orderEvents";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Invalid payment session");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/stripe/verify-payment?session_id=${sessionId}`
        );

        if (response.data.success) {
          setOrderData(response.data.data);
          // Push the freshly completed order into Redux so My Orders shows it immediately
          if (response?.data?.data?.order) {
            dispatch(addOrder(response.data.data.order));
          }
          // Clear cart after successful payment
          dispatch(clearCart());
          // Emit event to update order count and trigger refetch listeners
          emitOrderCountChange();
          // Redirect immediately to My Orders so user sees the order without waiting
          router.push("/my-orders");
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.response?.data?.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
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
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild className="w-full">
            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { order } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. Your payment has been confirmed.
          </p>
          <div className="bg-gray-50 border border-gray-300 rounded-md p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-primary">
              {order.orderNumber}
            </p>
          </div>
        </div>

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

        {/* Order Details */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
          <div className="bg-white border-b border-gray-300 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h2>
          </div>

          <div className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Items Ordered
              </h3>
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
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4 mb-6">
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
                    Total Paid
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ৳{order.pricing.total.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <div className="space-y-2 text-sm">
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

            {/* Delivery Estimate */}
            <div className="bg-blue-50 border border-blue-300 rounded-md p-4 text-center">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Estimated Delivery:</span> 2-3
                business days
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1" variant="outline">
            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
