"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/Routes/AdminPanelRoute";

import { useCallback, useMemo } from "react";
import { DT_CUSTOMER_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import { ADMIN_CUSTOMER_EDIT } from "@/Routes/AdminPanelRoute";


const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: '',
    label: "Customers",
  },
];

const ShowCustomers = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMER_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <EditAction
        key="edit"
        href={ADMIN_CUSTOMER_EDIT(row.original._id)}
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
            <h4 className="text-xl font-semibold">Customers</h4>
          </div>
        </CardHeader>
        <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <DataTableWrapper
            queryKey="customer-data"
            fetchUrl="/api/customer"
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/customer/export"
            deleteEndpoint="/api/customer/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customer`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomers;
