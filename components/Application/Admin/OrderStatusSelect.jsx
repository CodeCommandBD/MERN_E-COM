"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useStatsUpdate } from "@/app/(root)/(admin)/admin/orders/page";

const ORDER_STATUSES = [
  { value: "pending", label: "PENDING", color: "#f59e0b" },
  { value: "confirmed", label: "CONFIRMED", color: "#3b82f6" },
  { value: "processing", label: "PROCESSING", color: "#8b5cf6" },
  { value: "shipped", label: "SHIPPED", color: "#6366f1" },
  { value: "delivered", label: "DELIVERED", color: "#22c55e" },
  { value: "cancelled", label: "CANCELLED", color: "#ef4444" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onUpdate,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const updateStatsLive = useStatsUpdate();

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = async (newStatus) => {
    const oldStatus = status;
    setLoading(true);
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId,
        orderStatus: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus);
        
        await queryClient.invalidateQueries({ queryKey: ["order-data"] });
        
        if (updateStatsLive) {
          updateStatsLive(oldStatus, newStatus);
        }
        
        if (onUpdate) onUpdate(newStatus);
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const currentColor =
    ORDER_STATUSES.find((s) => s.value === status)?.color || "#6b7280";

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger 
        className="w-[120px] h-8 text-xs font-bold rounded-full border"
        style={{
          backgroundColor: `${currentColor}20`,
          color: currentColor,
          borderColor: currentColor,
        }}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
