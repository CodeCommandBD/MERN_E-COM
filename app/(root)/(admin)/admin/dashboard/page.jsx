"use client";
import React from "react";
import CountOverView from "./CountOverView";
import QuickAdd from "./QuickAdd";
import OrderDetails from "./OrderDetails";
import useFetch from "@/hooks/useFetch";

const AdminDashBoard = () => {
  const { data: stats } = useFetch("/api/dashboard/admin/stats");

  return (
    <div className="p-2 ">
      <CountOverView />
      <QuickAdd />
      <OrderDetails stats={stats?.data} />
    </div>
  );
};

export default AdminDashBoard;
