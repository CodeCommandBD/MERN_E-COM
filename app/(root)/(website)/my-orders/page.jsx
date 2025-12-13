"use client";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Package, Eye, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import { logout } from "@/store/reducer/authReducer";
import { persistor } from "@/store/store";
import { emitOrderCountChange, ORDER_COUNT_CHANGED } from "@/lib/orderEvents";
import { setOrders, updateOrderStatus } from "@/store/reducer/orderReducer";

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
  const orders = useSelector((state) => state.orderStore.orders);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(orders.length === 0);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelInProgress, setCancelInProgress] = useState(false);

  // Keep a ref of latest orders to avoid stale closure during fetch reconciliation
  const ordersRef = useRef([]);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // As soon as Redux has any orders, hide the loader so the user sees them immediately
  useEffect(() => {
    if (orders && orders.length > 0) {
      setLoading(false);
    }
  }, [orders]);

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

  // Extract fetchOrders as a separate function for reusability
  const fetchOrders = async () => {
    try {
      // If we already have some orders in Redux, keep showing them while we refresh in background
      setLoading(orders.length === 0);
      // First, get user email if not in auth
      let userEmail = auth.email;

      if (!userEmail && auth._id) {
        try {
          const userResponse = await axios.get(`/api/user/${auth._id}`, {
            withCredentials: true,
          });
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

      const response = await axios.get(`/api/order/user?${params}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Reconcile server with local so UI updates immediately without flicker
        const serverOrders = response.data.data || [];
        const byId = new Map();
        // Seed with server orders first
        serverOrders.forEach((o) => byId.set(o._id, o));
        // Merge local orders: keep local if it's cancelled or has newer updatedAt; also include local-only
        const localOrders = ordersRef.current || [];
        const now = Date.now();
        localOrders.forEach((local) => {
          const server = byId.get(local._id);
          if (!server) {
            const createdAtMs = local.createdAt ? new Date(local.createdAt).getTime() : 0;
            const ageMs = now - createdAtMs;
            if (ageMs < 60000) {
              byId.set(local._id, local);
            }
            return;
          }
          const localCancelled = local.orderStatus === "cancelled";
          const serverCancelled = server.orderStatus === "cancelled";
          if (localCancelled && !serverCancelled) {
            byId.set(local._id, local);
            return;
          }
          const localUpdated = local.updatedAt ? new Date(local.updatedAt).getTime() : 0;
          const serverUpdated = server.updatedAt ? new Date(server.updatedAt).getTime() : 0;
          if (localUpdated > serverUpdated) {
            byId.set(local._id, local);
          }
        });
        const merged = Array.from(byId.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(setOrders(merged));
        setError(null); // Clear any previous errors
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount only
  useEffect(() => {
    fetchOrders();
  }, [auth]);

  useEffect(() => {
    const id = setInterval(() => {
      fetchOrders();
    }, 15000);
    return () => clearInterval(id);
  }, [auth]);

  useEffect(() => {
    const onVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchOrders();
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisible);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisible);
      }
    };
  }, [auth]);

  // Listen for order count change events (order created/cancelled) and refresh orders
  useEffect(() => {
    const onCountChanged = () => {
      fetchOrders();
    };
    if (typeof window !== "undefined") {
      window.addEventListener(ORDER_COUNT_CHANGED, onCountChanged);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(ORDER_COUNT_CHANGED, onCountChanged);
      }
    };
  }, [auth]);

  // New helper to cancel by orderId (usable from button or dialog)
  const cancelOrder = async (orderId) => {
    if (!orderId || cancelInProgress) return;

    setCancelInProgress(true);
    try {
      const response = await axios.put(
        "/api/order/cancel",
        { orderId },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update Redux state to reflect cancellation
        dispatch(
          updateOrderStatus({
            orderId,
            status: "cancelled",
          })
        );
        setIsDialogOpen(false);
        setSelectedOrder(null);
        // Emit event to sync with server count
        emitOrderCountChange();
        // Re-validate with server to reflect authoritative state
        fetchOrders();
      } else {
        alert(response.data.message || "Cancel failed");
        setIsDialogOpen(false);
      }
    } catch (err) {
      // Handle errors gracefully (API is now idempotent, so duplicate cancels won't error)
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || "Failed to cancel order";
      if (status === 401) {
        alert("Please login again to cancel this order.");
      } else if (status === 403) {
        alert(msg + " (Make sure you're logged in with the same email that placed the order.)");
      } else {
        alert(msg);
      }
      setIsDialogOpen(false);
    } finally {
      setCancelInProgress(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    await cancelOrder(selectedOrder._id);
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

                        {/* Cancel Button - Only for unpaid orders (COD) - immediate cancel */}
                        {["pending", "confirmed"].includes(order.orderStatus) &&
                          order.paymentStatus !== "paid" &&
                          (new Date() - new Date(order.createdAt)) /
                            (1000 * 60 * 60) <=
                            12 && (
                            <Button
                              variant="destructive"
                              onClick={() => cancelOrder(order._id)}
                              disabled={cancelInProgress}
                              className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
