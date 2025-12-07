"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";

import React, { useCallback, useMemo, createContext, useContext } from "react";
import { DT_ORDER_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { MenuItem } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Orders",
  },
];

// Create context for stats update
const StatsUpdateContext = createContext(null);

export const useStatsUpdate = () => {
  const context = useContext(StatsUpdateContext);
  return context;
};

const ShowOrders = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/dashboard/admin/stats"
  );
  const [statsLive, setStatsLive] = React.useState(null);

  React.useEffect(() => {
    if (stats?.data) {
      setStatsLive(stats.data);
    }
  }, [stats]);

  // Debounce search term to avoid too many API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Function to update stats live
  const updateStatsLive = useCallback(async (oldStatus, newStatus) => {
    try {
      // Optimistically update the stats
      setStatsLive((prev) => {
        if (!prev?.statusData) return prev;
        
        const newStatusData = prev.statusData.map((s) => {
          if (s.status === oldStatus) {
            return { ...s, count: Math.max(0, (s.count || 0) - 1) };
          }
          if (s.status === newStatus) {
            return { ...s, count: (s.count || 0) + 1 };
          }
          return s;
        });
        
        return { ...prev, statusData: newStatusData };
      });

      // Then refetch to get accurate data
      await refetchStats();
      const fresh = await axios.get("/api/dashboard/admin/stats");
      if (fresh?.data?.success) {
        setStatsLive(fresh.data.data);
      }
    } catch (error) {
      console.error("Error updating stats:", error);
      // Refetch on error to ensure accuracy
      await refetchStats();
      const fresh = await axios.get("/api/dashboard/admin/stats");
      if (fresh?.data?.success) {
        setStatsLive(fresh.data.data);
      }
    }
  }, [refetchStats]);
  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN);
  }, []);

  const updateOrderStatus = useCallback(async (orderId, nextStatus, oldStatus) => {
    try {
      const { data } = await axios.put(
        "/api/dashboard/admin/order/status",
        { orderId, orderStatus: nextStatus }
      );
      if (!data?.success) {
        throw new Error(data?.message || "Failed to update status");
      }
      showToast("success", "Order status updated");
      await queryClient.invalidateQueries({ queryKey: ["order-data"] });
      
      // Update stats live if oldStatus is provided
      if (oldStatus) {
        updateStatsLive(oldStatus, nextStatus);
      } else {
        // Fallback to refetch if oldStatus is not provided
        await refetchStats();
        try {
          const fresh = await axios.get("/api/dashboard/admin/stats");
          if (fresh?.data?.success) {
            setStatsLive(fresh.data.data);
          }
        } catch (_) {}
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Failed";
      showToast("error", msg);
    }
  }, [refetchStats, queryClient, updateStatsLive]);

  const action = useCallback((row, deleteType, handleDelete) => {
    const status = row?.original?.orderStatus;
    const id = row?.original?._id;
    const items = [
      <MenuItem key="view">
        <Link href={`/admin/orders/${id}`}>View</Link>
      </MenuItem>,
    ];
    if (status === "pending") {
      items.push(
        <MenuItem key="confirm" onClick={() => updateOrderStatus(id, "confirmed", status)}>Confirm</MenuItem>
      );
    }
    if (status === "confirmed") {
      items.push(
        <MenuItem key="processing" onClick={() => updateOrderStatus(id, "processing", status)}>Processing</MenuItem>
      );
    }
    if (status === "processing") {
      items.push(
        <MenuItem key="shipped" onClick={() => updateOrderStatus(id, "shipped", status)}>Mark Shipped</MenuItem>
      );
    }
    if (status === "shipped") {
      items.push(
        <MenuItem key="delivered" onClick={() => updateOrderStatus(id, "delivered", status)}>Mark Delivered</MenuItem>
      );
    }
    if (status !== "delivered" && status !== "cancelled") {
      items.push(
        <MenuItem key="cancel" onClick={() => updateOrderStatus(id, "cancelled", status)}>Cancel</MenuItem>
      );
    }
    return items;
  }, [updateOrderStatus]);

  // Prepare column filters for status filter
  const columnFilters = useMemo(() => {
    if (statusFilter === "all") {
      return [];
    }
    return [{ id: "orderStatus", value: statusFilter }];
  }, [statusFilter]);

  return (
    <StatsUpdateContext.Provider value={updateStatsLive}>
      <div>
        <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
        <Card
          className="py-0 rounded shadow-sm border"
          suppressHydrationWarning={true}
        >
          <CardHeader
            className="pt-3 px-3 pb-1"
            style={{ borderBottom: "1px solid #e5e7eb" }}
            suppressHydrationWarning={true}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">Orders</h4>
            </div>
          </CardHeader>
          <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <div className="mb-4 grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                placeholder="Search by order number, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex md:justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {(() => {
              const statusData = statsLive?.statusData || stats?.data?.statusData || [];
              const total = statusData.reduce((acc, s) => acc + (s.count || 0), 0);
              const by = (name) => statusData.find((s) => s.status === name)?.count || 0;
              const cards = [
                { label: "Total Orders", value: total, color: "text-black" },
                { label: "Pending", value: by("pending"), color: "text-yellow-600" },
                { label: "Processing", value: by("processing"), color: "text-blue-600" },
                { label: "Delivered", value: by("delivered"), color: "text-green-600" },
              ];
              return cards.map((c, i) => (
                <div key={i} className="rounded-lg border bg-white dark:bg-card p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={`mt-1 text-2xl font-semibold ${c.color}`}>{c.value}</p>
                </div>
              ));
            })()}
          </div>

          <DataTableWrapper
            queryKey="order-data"
            fetchUrl="/api/order"
            columnsConfig={columns}
            initialPageSize={10}
            deleteEndpoint="/api/order/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=order`}
            createAction={action}
            initialGlobalFilter={debouncedSearchTerm}
            initialColumnFilters={columnFilters}
            onDeleteSuccess={refetchStats}
          />
          </CardContent>
        </Card>
      </div>
    </StatsUpdateContext.Provider>
  );
};

export default ShowOrders;
