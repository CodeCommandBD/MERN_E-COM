"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
  ADMIN_COUPON_SHOW,
} from "@/Routes/AdminPanelRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useCallback, useMemo } from "react";
import { DT_COUPON_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import { ADMIN_COUPON_EDIT } from "@/Routes/AdminPanelRoute";
import { ADMIN_COUPON_ADD } from "@/Routes/AdminPanelRoute";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: "Coupon",
  },
];

const ShowCoupon = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_COUPON_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <EditAction
        key="edit"
        href={ADMIN_COUPON_EDIT(row.original._id)}
      ></EditAction>
    );
    actionMenu.push(
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      ></DeleteAction>
    );
    return actionMenu;
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
            <h4 className="text-xl font-semibold">All Coupon</h4>
            <Button className="flex items-center gap-2">
              <FiPlus></FiPlus>
              <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <DataTableWrapper
            queryKey="coupon-data"
            fetchUrl="/api/coupon"
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/coupon/export"
            deleteEndpoint="/api/coupon/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=coupon`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCoupon;
