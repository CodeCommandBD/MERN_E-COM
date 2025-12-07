import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import { Tooltip, IconButton } from "@mui/material";
import Link from "next/link";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import RefreshIcon from "@mui/icons-material/Refresh";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ButtonLoading } from "../ButtonLoading";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";
import ConfirmModal from "./ConfirmModal";
const DataTable = ({
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
}) => {
  const [columnFilters, setColumnFilters] = useState(initialColumnFilters);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [selectedRows, setSelectedRows] = useState({});
  const prevColumnFiltersRef = React.useRef(
    JSON.stringify(initialColumnFilters)
  );

  // Sync external filters with internal state
  React.useEffect(() => {
    setGlobalFilter(initialGlobalFilter);
  }, [initialGlobalFilter]);

  React.useEffect(() => {
    const currentFiltersStr = JSON.stringify(initialColumnFilters);
    if (prevColumnFiltersRef.current !== currentFiltersStr) {
      setColumnFilters(initialColumnFilters);
      prevColumnFiltersRef.current = currentFiltersStr;
    }
  }, [initialColumnFilters]);

  const [exportLoading, setExportLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    ids: [],
    deleteType: "",
  });

  const deleteMutation = useDeleteMutation(
    queryKey,
    deleteEndpoint,
    onDeleteSuccess
  );

  // Delete method
  const handleDelete = (ids, deleteType) => {
    let title = "";
    let message = "";

    if (deleteType === "PD") {
      title = "Permanently Delete";
      message =
        "Are you sure you want to delete the data permanently? This action cannot be undone.";
    } else if (deleteType === "RSD") {
      title = "Restore Data";
      message = "Are you sure you want to restore the selected items?";
    } else {
      title = "Move to Trash";
      message = "Are you sure you want to move the selected items to trash?";
    }

    setConfirmModal({
      open: true,
      title,
      message,
      ids,
      deleteType,
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate({
      ids: confirmModal.ids,
      deleteType: confirmModal.deleteType,
    });
    setSelectedRows({});
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      ids: [],
      deleteType: "",
    });
  };

  const handleCloseModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      ids: [],
      deleteType: "",
    });
  };

  // Export method
  const handleExport = async (table) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "csv-data",
      });
      let csv;
      const selectedRowModel = table.getSelectedRowModel();
      if (selectedRowModel.rows.length > 0) {
        const rowData = selectedRowModel.rows.map((row) => row.original);
        csv = generateCsv(csvConfig)(rowData);
      } else {
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) {
          throw new Error(response.message);
        }
        const rowData = response.data;
        csv = generateCsv(csvConfig)(rowData);
      }
      download(csvConfig)(csv);
      showToast("success", "Data exported successfully");
    } catch (error) {
      showToast("error", error.message || "Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      {
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
        deleteType, //refetch when deleteType changes
      },
    ],
    queryFn: async () => {
      const Url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      Url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      Url.searchParams.set("size", `${pagination.pageSize}`);
      Url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      Url.searchParams.set("globalFilters", globalFilter ?? "");
      Url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      Url.searchParams.set("deleteType", deleteType);

      //use whatever fetch library you want, fetch, axios, etc
      const { data } = await axios.get(Url.href);
      return data;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setSelectedRows,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection: selectedRows,
    },
    meta: {
      onStatusUpdate,
    },
    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && trashView && (
          <Tooltip title={"Recycle Bin"}>
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon></RecyclingIcon>
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {/* Delete all */}
        {deleteType === "SD" && (
          <>
            <Tooltip title={"Delete All"}>
              <IconButton
                disabled={Object.keys(selectedRows).length === 0}
                onClick={() =>
                  handleDelete(Object.keys(selectedRows), deleteType)
                }
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title={"Permanently Delete"}>
              <IconButton
                disabled={Object.keys(selectedRows).length === 0}
                onClick={() => handleDelete(Object.keys(selectedRows), "PD")}
              >
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </>
        )}
        {/* Restore */}
        {deleteType === "PD" && (
          <>
            <Tooltip title={"Restore Data"}>
              <IconButton
                disabled={Object.keys(selectedRows).length === 0}
                onClick={() => handleDelete(Object.keys(selectedRows), "RSD")}
              >
                <RestoreIcon></RestoreIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title={"Permanently Delete"}>
              <IconButton
                disabled={Object.keys(selectedRows).length === 0}
                onClick={() => handleDelete(Object.keys(selectedRows), "PD")}
              >
                <DeleteForeverIcon></DeleteForeverIcon>
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),

    renderTopToolbarCustomActions: ({ table }) => (
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}
      >
        {exportEndpoint && (
          <Tooltip arrow title="Export Data">
            <ButtonLoading
              type="button"
              text={
                <div>
                  <div className="semi-bold cursor-pointer hidden md:block">
                    Export <FileDownloadIcon />
                  </div>
                  <div className="semi-bold cursor-pointer md:hidden">
                    <FileDownloadIcon />
                  </div>
                </div>
              }
              loading={exportLoading}
              onClick={() => handleExport(table)}
            ></ButtonLoading>
          </Tooltip>
        )}
      </div>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <ConfirmModal
        open={confirmModal.open}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.deleteType === "RSD" ? "Restore" : "Delete"}
      />
    </div>
  );
};

export default DataTable;
