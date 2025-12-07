"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, FormControl } from "@mui/material";
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

  // Sync status when currentStatus prop changes
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    const oldStatus = status;
    setLoading(true);
    try {
      const response = await axios.put("/api/dashboard/admin/order/status", {
        orderId,
        orderStatus: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus);
        
        // Invalidate order-data query to refresh the table
        await queryClient.invalidateQueries({ queryKey: ["order-data"] });
        
        // Update stats live if context is available
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
    <FormControl size="small" disabled={loading}>
      <Select
        value={status}
        onChange={handleChange}
        sx={{
          minWidth: 120,
          fontSize: "0.75rem",
          fontWeight: "bold",
          backgroundColor: `${currentColor}20`,
          color: currentColor,
          border: `1px solid ${currentColor}`,
          borderRadius: "9999px",
          "& .MuiSelect-select": {
            padding: "4px 12px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        {ORDER_STATUSES.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
