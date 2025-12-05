"use client";
import React from "react";
import {
  Package,
  CheckCircle,
  Truck,
  Home,
  Clock,
  XCircle,
} from "lucide-react";

const OrderStatusTracker = ({
  orderStatus,
  paymentStatus,
  createdAt,
  paidAt,
  shippedAt,
  deliveredAt,
  cancelledAt,
}) => {
  // Define order stages
  const stages = [
    {
      id: "pending",
      label: "Order Placed",
      icon: Package,
      description: "Your order has been received",
    },
    {
      id: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      description: "Order confirmed and being prepared",
    },
    {
      id: "processing",
      label: "Processing",
      icon: Clock,
      description: "Your order is being processed",
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: Truck,
      description: "Order is on the way",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: Home,
      description: "Order has been delivered",
    },
  ];

  // Determine current stage index
  const getCurrentStageIndex = () => {
    if (orderStatus === "cancelled") return -1;
    const stageIndex = stages.findIndex((stage) => stage.id === orderStatus);
    return stageIndex;
  };

  const currentStageIndex = getCurrentStageIndex();
  const isCancelled = orderStatus === "cancelled";

  // Get timestamp for each stage
  const getStageTimestamp = (stageId) => {
    switch (stageId) {
      case "pending":
        return createdAt;
      case "confirmed":
        return paidAt;
      case "shipped":
        return shippedAt;
      case "delivered":
        return deliveredAt;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isCancelled) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3 text-red-600">
          <XCircle className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Order Cancelled</h3>
            <p className="text-sm text-gray-600">
              {cancelledAt && `Cancelled on ${formatDate(cancelledAt)}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
        <p className="text-sm text-gray-600 mt-1">
          Track your order delivery progress
        </p>
      </div>

      {/* Status Tracker */}
      <div className="p-6">
        {/* Payment Status Badge */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Payment Status:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              paymentStatus === "paid"
                ? "bg-green-100 text-green-700 border border-green-300"
                : paymentStatus === "pending"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {paymentStatus === "paid"
              ? "Paid"
              : paymentStatus === "pending"
              ? "Pending"
              : "Failed"}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isLast = index === stages.length - 1;
            const Icon = stage.icon;
            const timestamp = getStageTimestamp(stage.id);

            return (
              <div key={stage.id} className="relative">
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-16 ${
                      isCompleted ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Stage Item */}
                <div className="flex items-start gap-4 pb-8">
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isCurrent
                        ? "bg-white border-primary text-primary"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-base font-bold ${
                          isCompleted ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {stage.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isCompleted ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {stage.description}
                    </p>
                    {timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery */}
        {orderStatus !== "delivered" && orderStatus !== "cancelled" && (
          <div className="mt-4 bg-blue-50 border border-blue-300 rounded-md p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Estimated Delivery:</span> 2-3
              business days from order confirmation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
