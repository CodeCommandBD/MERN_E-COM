"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Package, Eye, Calendar, CreditCard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/dashboard/admin/order");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId,
        orderStatus: newStatus,
      });

      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        // You would typically show a toast/notification here
        // alert("Order status updated successfully!");
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId,
        paymentStatus: newStatus,
      });

      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, paymentStatus: newStatus }
              : order
          )
        );
      } else {
        alert(response.data.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error("Update payment status error:", err);
      alert(err.response?.data?.message || "Failed to update payment status");
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Orders Management
        </h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter((o) => o.orderStatus === "pending").length}
          </p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Processing</p>
          <p className="text-2xl font-bold text-purple-600">
            {
              orders.filter((o) =>
                ["confirmed", "processing", "shipped"].includes(o.orderStatus)
              ).length
            }
          </p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.orderStatus === "delivered").length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.orderNumber}
                        </p>
                        {order.transactionId && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 w-fit">
                            <CreditCard className="w-3 h-3" />
                            <span className="font-mono">
                              {order.transactionId}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 font-medium">
                        {order.items.length}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerInfo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerInfo.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        ৳{order.pricing.total.toFixed(0)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {/* Payment Status Dropdown */}
                        <div>
                          {/* Payment Status Dropdown */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border block w-full text-center ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${getStatusColor(
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
                    </td>
                    <td className="px-6 py-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/order/${order._id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
