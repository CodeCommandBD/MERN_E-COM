"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";

import { useCallback, useMemo } from "react";
import { DT_REVIEW_COLUMN } from "@/lib/column";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Reviews",
  },
];

const ShowReviews = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_REVIEW_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
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
            <h4 className="text-xl font-semibold">Reviews</h4>
          </div>
        </CardHeader>
        <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <DataTableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowReviews;
