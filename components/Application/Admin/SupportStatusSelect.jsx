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

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = async (newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put("/api/support/status", {
        ticketId,
        status: newStatus,
      });
      if (response.data.success) {
        setStatus(newStatus);
        
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
        {SUPPORT_STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
