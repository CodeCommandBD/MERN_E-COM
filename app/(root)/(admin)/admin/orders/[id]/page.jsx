"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  User,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/dashboard/admin/order/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Fetch order error:", err);
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId: id,
        orderStatus: newStatus,
      });

      if (response.data.success) {
        setOrder({ ...order, orderStatus: newStatus });
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-700 border-blue-300",
      processing: "bg-purple-100 text-purple-700 border-purple-300",
      shipped: "bg-indigo-100 text-indigo-700 border-indigo-300",
      delivered: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Order {order.orderNumber}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 rounded-md font-semibold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${getStatusColor(
              order.orderStatus
            )}`}
          >
            <option value="pending">PENDING</option>
            <option value="confirmed">CONFIRMED</option>
            <option value="processing">PROCESSING</option>
            <option value="shipped">SHIPPED</option>
            <option value="delivered">DELIVERED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ৳{item.sellingPrice.toFixed(0)}
                    </p>
                    {item.mrp > item.sellingPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ৳{item.mrp.toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{order.pricing.subtotal.toFixed(0)}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{order.pricing.discount.toFixed(0)}</span>
                  </div>
                )}
                {order.pricing.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-৳{order.pricing.couponDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span>৳{order.pricing.shippingFee.toFixed(0)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>৳{order.pricing.total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer & Address */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                Customer Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {order.customerInfo.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {order.customerInfo.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {order.customerInfo.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                Shipping Address
              </h2>
            </div>
            <div className="p-6 space-y-1 text-sm text-gray-600">
              <p className="text-gray-900 font-medium">
                {order.shippingAddress?.landmark}
              </p>
              <p>{order.shippingAddress?.city}</p>
              {order.shippingAddress?.state && (
                <p>{order.shippingAddress?.state}</p>
              )}
              <p>
                {order.shippingAddress?.state}, {order.shippingAddress?.country}{" "}
                - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                Payment Info
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Method</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Transaction ID
                  </p>
                  <p className="text-xs font-mono bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 p-2 rounded border border-gray-200 dark:border-gray-600 break-all">
                    {order.transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
