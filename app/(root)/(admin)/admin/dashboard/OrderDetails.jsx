import React from 'react'
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderOverView } from "./OrderOverView";
import { OrderStatus } from "./OrderStatus";

const OrderDetails = () => {
  return (
    
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
          <CardContent>
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
          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>
      </div>
  )
}

export default OrderDetails