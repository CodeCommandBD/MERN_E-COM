"use client";
import React from "react";
import CountOverView from "./CountOverView";
import QuickAdd from "./QuickAdd";
import OrderDetails from "./OrderDetails";
import useFetch from "@/hooks/useFetch";

const AdminDashBoard = () => {
  const { data: stats, error: statsError, loading } = useFetch(
    "/api/dashboard/admin/stats"
  );

  return (
    <div className="p-2 ">
      {statsError && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
          {statsError}
        </div>
      )}
      <CountOverView />
      <QuickAdd />
      <OrderDetails stats={stats?.data} />
    </div>
  );
};

export default AdminDashBoard;
