"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

const SUPPORT_STATUSES = [
  { value: "open", label: "OPEN", color: "#22c55e" },
  { value: "in-progress", label: "IN PROGRESS", color: "#3b82f6" },
  { value: "resolved", label: "RESOLVED", color: "#8b5cf6" },
  { value: "closed", label: "CLOSED", color: "#6b7280" },
];

export default function SupportStatusSelect({
  ticketId,
  currentStatus,
  onUpdate,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Sync status when currentStatus prop changes
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const response = await axios.put("/api/support/status", {
        ticketId,
        status: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus);
        
        // Invalidate support-data query to refresh the table
        await queryClient.invalidateQueries({ queryKey: ["support-data"] });
        
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
    SUPPORT_STATUSES.find((s) => s.value === status)?.color || "#6b7280";

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
        {SUPPORT_STATUSES.map((s) => (
          <MenuItem key={s.value} value={s.value}>
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
