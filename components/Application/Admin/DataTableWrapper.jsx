"use client";

import DataTable from "./DataTable";
import { useEffect, useState } from "react";

const DataTableWrapper = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteType,
  deleteEndpoint,
  trashView,
  createAction,
  initialGlobalFilter = "",
  initialColumnFilters = [],
  onDeleteSuccess,
  onStatusUpdate,
  refetchInterval,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
      <DataTable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteType={deleteType}
        deleteEndpoint={deleteEndpoint}
        trashView={trashView}
        createAction={createAction}
        initialGlobalFilter={initialGlobalFilter}
        initialColumnFilters={initialColumnFilters}
        onDeleteSuccess={onDeleteSuccess}
        onStatusUpdate={onStatusUpdate}
        refetchInterval={refetchInterval}
      ></DataTable>
  );
};

export default DataTableWrapper;
