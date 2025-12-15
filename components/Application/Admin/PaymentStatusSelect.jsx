"use client";
import { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAYMENT_STATUSES = [
  { value: "pending", label: "PENDING", color: "#f59e0b" },
  { value: "paid", label: "PAID", color: "#22c55e" },
  { value: "failed", label: "FAILED", color: "#ef4444" },
  { value: "refunded", label: "REFUNDED", color: "#6b7280" },
];

export default function PaymentStatusSelect({
  orderId,
  currentStatus,
  onUpdate,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId,
        paymentStatus: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus);
        if (onUpdate) onUpdate(newStatus);
      } else {
        alert(response.data.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error("Payment status update error:", err);
      alert(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  const currentColor =
    PAYMENT_STATUSES.find((s) => s.value === status)?.color || "#6b7280";

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger 
        className="w-[100px] h-8 text-xs font-bold rounded-full border"
        style={{
          backgroundColor: `${currentColor}20`,
          color: currentColor,
          borderColor: currentColor,
        }}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
