"use client";
import { useState } from "react";
import axios from "axios";
import { Select, MenuItem, FormControl } from "@mui/material";

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

  const handleChange = async (e) => {
    const newStatus = e.target.value;
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
    <FormControl size="small" disabled={loading}>
      <Select
        value={status}
        onChange={handleChange}
        sx={{
          minWidth: 100,
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
        {PAYMENT_STATUSES.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
