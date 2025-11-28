import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderOverView } from "./OrderOverView";
import { OrderStatus } from "./OrderStatus";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";

const OrderDetails = () => {
  return (
    <div>
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full">
          <CardHeader className="flex justify-between px-4  border-b ">
            <div className="flex items-center justify-between w-full">
              <span className=" font-semibold">Order Overview</span>
              <Button type="button" className="text-sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent >
            <OrderOverView />
          </CardContent>
        </Card>
        <Card className="rounded-lg lg:w-[30%] w-full">
          <CardHeader className="flex justify-between px-4 border-b">
            <div className="flex items-center justify-between w-full">
              <span className=" font-semibold">Order Summary</span>
              <Button type="button" className="text-sm">
                <Link href="/admin/orders/summary">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent >
            <OrderStatus />
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full h-[400px]">
          <CardHeader className="flex justify-between px-4  border-b ">
            <div className="flex items-center justify-between w-full">
              <span className=" font-semibold">Latest Order</span>
              <Button type="button" className="text-sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className={'p-2 overflow-y-auto'}>
            <LatestOrder />
          </CardContent>
        </Card>
        <Card className="rounded-lg lg:w-[30%] w-full h-[400px] ">
          <CardHeader className="flex justify-between px-4 border-b">
            <div className="flex items-center justify-between w-full">
              <span className=" font-semibold">Latest Review</span>
              <Button type="button" className="text-sm">
                <Link href="">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className={'p-2 overflow-y-auto'}>
            <LatestReview />  
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
