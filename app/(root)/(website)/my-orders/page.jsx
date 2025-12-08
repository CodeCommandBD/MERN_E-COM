"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Eye, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import { logout } from "@/store/reducer/authReducer";
import { persistor } from "@/store/store";

const breadcrumb = {
  title: "My Orders",
  links: [
    {
      label: "My Orders",
      href: "/my-orders",
    },
  ],
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MyOrders() {
  const auth = useSelector((state) => state.authStore.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLoginRedirect = async () => {
    try {
      await axios.post("/api/auth/logout");
      dispatch(logout());
      await persistor.flush();
      window.location.href = WEBSITE_LOGIN;
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = WEBSITE_LOGIN;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth?._id && !auth?.email) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      try {
        // First, get user email if not in auth
        let userEmail = auth.email;

        if (!userEmail && auth._id) {
          try {
            const userResponse = await axios.get(`/api/user/${auth._id}`);
            if (userResponse.data.success) {
              userEmail = userResponse.data.data.email;
            }
          } catch (error) {
            console.error("Failed to fetch user email:", error);
          }
        }

        // Send both userId and email for better matching
        let params = `userId=${auth._id}`;
        if (userEmail) {
          params += `&email=${userEmail}`;
        }

        const response = await axios.get(`/api/order/user?${params}`);

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth]);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axios.put("/api/order/cancel", {
        orderId: selectedOrder._id,
      });
      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, orderStatus: "cancelled", cancelledAt: new Date() }
              : order
          )
        );
        setIsDialogOpen(false);
        setSelectedOrder(null);
      } else {
        alert(response.data.message);
        setIsDialogOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
      setIsDialogOpen(false);
    }
  };

  const openCancelDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 p-12 text-center max-w-md mx-4">
          <p className="text-red-500 text-lg mb-6">
            Please login to view your orders
          </p>
          <Button
            onClick={handleLoginRedirect}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-lg"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">
              Track and manage your orders ({orders.length} total)
            </p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 md:mt-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.items.length} item(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total Amount
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ৳{order.pricing.total.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Payment Method
                        </p>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {order.paymentMethod === "card"
                              ? "Card"
                              : order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons & Helper Text */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {["pending", "confirmed"].includes(order.orderStatus) &&
                          order.paymentStatus !== "paid" &&
                          (new Date() - new Date(order.createdAt)) /
                            (1000 * 60 * 60) <=
                            12 && (
                            <p>You can cancel this order within 12 hours.</p>
                          )}
                        {order.paymentStatus === "paid" &&
                          ["pending", "confirmed"].includes(
                            order.orderStatus
                          ) && (
                            <p className="text-amber-600">
                              Paid orders cannot be cancelled online. Contact
                              support for refunds.
                            </p>
                          )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full md:w-auto"
                        >
                          <Link href={`/order/${order._id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>

                        {/* Cancel Button - Only for unpaid orders (COD) */}
                        {["pending", "confirmed"].includes(order.orderStatus) &&
                          order.paymentStatus !== "paid" &&
                          (new Date() - new Date(order.createdAt)) /
                            (1000 * 60 * 60) <=
                            12 && (
                            <Button
                              variant="destructive"
                              onClick={() => openCancelDialog(order)}
                              className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
                            >
                              Cancel Order
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
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
        </div>
      </div>
    </div>
  );
}
