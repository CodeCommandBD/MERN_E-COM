"use client";
import React from "react";
import OrderStatusTracker from "@/components/Order/OrderStatusTracker";

const OrderStatusDemo = () => {
  // Example order data for different statuses
  const orderExamples = [
    {
      title: "Pending Order",
      orderStatus: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      paidAt: null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
    },
    {
      title: "Confirmed Order",
      orderStatus: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      paidAt: new Date().toISOString(),
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
    },
    {
      title: "Processing Order",
      orderStatus: "processing",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      paidAt: new Date(Date.now() - 86400000).toISOString(),
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
    },
    {
      title: "Shipped Order",
      orderStatus: "shipped",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      paidAt: new Date(Date.now() - 172800000).toISOString(),
      shippedAt: new Date(Date.now() - 86400000).toISOString(),
      deliveredAt: null,
      cancelledAt: null,
    },
    {
      title: "Delivered Order",
      orderStatus: "delivered",
      paymentStatus: "paid",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      paidAt: new Date(Date.now() - 345600000).toISOString(),
      shippedAt: new Date(Date.now() - 259200000).toISOString(),
      deliveredAt: new Date().toISOString(),
      cancelledAt: null,
    },
    {
      title: "Cancelled Order",
      orderStatus: "cancelled",
      paymentStatus: "failed",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      paidAt: null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Status Tracker - Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Preview of different order statuses and delivery stages
          </p>

          <div className="space-y-8">
            {orderExamples.map((example, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {example.title}
                </h2>
                <OrderStatusTracker
                  orderStatus={example.orderStatus}
                  paymentStatus={example.paymentStatus}
                  createdAt={example.createdAt}
                  paidAt={example.paidAt}
                  shippedAt={example.shippedAt}
                  deliveredAt={example.deliveredAt}
                  cancelledAt={example.cancelledAt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusDemo;
