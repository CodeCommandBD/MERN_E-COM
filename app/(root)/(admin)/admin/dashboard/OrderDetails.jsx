import React from "react";
import { OrderOverView } from "./OrderOverView";
import { OrderStatus } from "./OrderStatus";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";

const OrderDetails = ({ stats }) => {
  return (
    <div>
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <div className="lg:w-[70%] w-full h-[400px]">
          <OrderOverView data={stats?.monthlyOrders} />
        </div>
        <div className="lg:w-[30%] w-full h-[400px]">
          <OrderStatus data={stats?.statusData} />
        </div>
      </div>
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <div className="lg:w-[70%] w-full h-[400px]">
          <LatestOrder data={stats?.latestOrders} />
        </div>
        <div className="lg:w-[30%] w-full h-[400px]">
          <LatestReview data={stats?.latestReviews} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
