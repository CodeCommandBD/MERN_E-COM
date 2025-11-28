import React from "react";
import CountOverView from "./CountOverView";
import QuickAdd from "./QuickAdd";
import OrderDetails from "./OrderDetails";


const AdminDashBoard = () => {
  return (
    <div className="p-2">
      <CountOverView />
      <QuickAdd />
      <OrderDetails />
      
    </div>
  );
};

export default AdminDashBoard;
