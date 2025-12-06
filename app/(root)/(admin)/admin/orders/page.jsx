"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";

import { useCallback, useMemo } from "react";
import { DT_ORDER_COLUMN } from "@/lib/column";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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

const ShowOrders = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    // View action only
    return [
      <Button key="view" asChild variant="outline" size="sm">
        <Link href={`/admin/orders/${row.original._id}`}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Link>
      </Button>,
    ];
  }, []);

  return (
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
          <DataTableWrapper
            queryKey="order-data"
            fetchUrl="/api/order"
            columnsConfig={columns}
            initialPageSize={10}
            deleteEndpoint="/api/order/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=order`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrders;
