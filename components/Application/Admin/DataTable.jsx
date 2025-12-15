import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  Recycle,
  Trash2,
  Trash,
  RotateCcw,
  RefreshCw,
  MoreVertical,
  Filter,
  Maximize,
  Minimize,
  AlignJustify,
  AlignLeft,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ButtonLoading } from "../ButtonLoading";
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
  refetchInterval,
}) => {
  const [columnFilters, setColumnFilters] = useState(initialColumnFilters);
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [density, setDensity] = useState("normal");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showColumnFilters, setShowColumnFilters] = useState(true);

  const prevColumnFiltersRef = useRef(
    JSON.stringify(initialColumnFilters)
  );

  // Sync external filters with internal state
  useEffect(() => {
    setGlobalFilter(initialGlobalFilter);
  }, [initialGlobalFilter]);

  useEffect(() => {
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

  const queryClient = useQueryClient();

  const deleteMutation = useDeleteMutation(
    queryKey,
    deleteEndpoint,
    onDeleteSuccess,
    {
      onMutate: async ({ ids, deleteType: actionType }) => {
        await queryClient.cancelQueries({ queryKey: [queryKey] });
        const previousQueries = queryClient.getQueriesData({
          queryKey: [queryKey],
        });

        queryClient.setQueriesData({ queryKey: [queryKey] }, (old) => {
          if (!old) return old;
          let newData = [];
          let newTotal = 0;

          const idSet = new Set(ids);
          const filterFn = (item) => !idSet.has(item._id);

          if (Array.isArray(old)) {
            newData = old.filter(filterFn);
            return newData;
          } else if (old.data && Array.isArray(old.data)) {
            newData = old.data.filter(filterFn);
            newTotal = Math.max(
              0,
              (old.meta?.totalRowCount || old.data.length) - ids.length
            );

            return {
              ...old,
              data: newData,
              meta: {
                ...old.meta,
                totalRowCount: newTotal,
              },
            };
          }
          return old;
        });

        return { previousQueries };
      },
      onError: (err, newTodo, context) => {
        if (context?.previousQueries) {
          context.previousQueries.forEach(([key, data]) => {
            queryClient.setQueryData(key, data);
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    }
  );

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
    setRowSelection({});
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

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "csv-data",
      });
      let csv;
      const selectedRows = table.getSelectedRowModel().rows;
      if (selectedRows.length > 0) {
        const rowData = selectedRows.map((row) => row.original);
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
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      {
        columnFilters,
        globalFilter,
        pagination,
        sorting,
        deleteType,
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
      Url.searchParams.set("_t", Date.now());

      const { data } = await axios.get(Url.href);
      return data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: typeof refetchInterval === "number" ? refetchInterval : false,
  });

  // Create columns with selection and actions
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      ...columnsConfig,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {createAction(row, deleteType, handleDelete).map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [columnsConfig, createAction, deleteType]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: meta?.totalRowCount
      ? Math.ceil(meta.totalRowCount / pagination.pageSize)
      : -1,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getRowId: (originalRow) => originalRow._id,
    meta: {
      onStatusUpdate,
    },
  });

  const getPaddingByDensity = () => {
    switch (density) {
      case "compact":
        return "py-1 px-2";
      case "comfortable":
        return "py-3 px-4";
      default:
        return "py-2 px-3";
    }
  };

  return (
    <div
      className={`w-full ${
        isFullScreen
          ? "fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-background p-4"
          : ""
      }`}
    >
      <div className="w-full mb-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800">
        {/* Toolbar */}
        <TooltipProvider>
          <div className="flex items-center gap-2 p-4 flex-wrap border-b">
            <div className="flex-1">
              {Object.keys(rowSelection).length > 0 && (
                <p className="text-sm font-medium">
                  {Object.keys(rowSelection).length} selected
                </p>
              )}
            </div>

            {exportEndpoint && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <ButtonLoading
                    type="button"
                    text={
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden md:inline">Export</span>
                      </div>
                    }
                    loading={exportLoading}
                    onClick={handleExport}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export to CSV</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowColumnFilters(!showColumnFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Filters</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setDensity((prev) =>
                      prev === "normal"
                        ? "compact"
                        : prev === "compact"
                        ? "comfortable"
                        : "normal"
                    )
                  }
                >
                  {density === "compact" ? (
                    <AlignLeft className="h-4 w-4" />
                  ) : (
                    <AlignJustify className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Density</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>

            {deleteType !== "PD" && trashView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={trashView}>
                    <Button variant="outline" size="icon">
                      <Recycle className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Trash</p>
                </TooltipContent>
              </Tooltip>
            )}

            {deleteType === "SD" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={Object.keys(rowSelection).length === 0}
                      onClick={() =>
                        handleDelete(Object.keys(rowSelection), deleteType)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Move to Trash</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={Object.keys(rowSelection).length === 0}
                      onClick={() => handleDelete(Object.keys(rowSelection), "PD")}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Permanently</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {deleteType === "PD" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={Object.keys(rowSelection).length === 0}
                      onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Restore</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={Object.keys(rowSelection).length === 0}
                      onClick={() => handleDelete(Object.keys(rowSelection), "PD")}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Permanently</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {isError && (
          <div className="m-4 p-4 bg-destructive/10 text-destructive dark:bg-red-900/30 dark:text-red-400 rounded-md">
            Error loading data
          </div>
        )}

        {isRefetching && <Progress value={undefined} className="h-1" />}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  <TableRow>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`font-bold dark:text-white ${getPaddingByDensity()}`}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-2">
                            {header.column.getCanSort() ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-3 h-8"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                  desc: <ArrowDown className="ml-2 h-4 w-4" />,
                                }[header.column.getIsSorted()] ?? null}
                              </Button>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            )}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                  {showColumnFilters && (
                    <TableRow>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={getPaddingByDensity()}
                        >
                          {header.column.getCanFilter() && (
                            <Input
                              placeholder="Filter..."
                              value={
                                (columnFilters.find(
                                  (f) => f.id === header.column.id
                                )?.value || "")
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                setColumnFilters((prev) => {
                                  const existing = prev.filter(
                                    (f) => f.id !== header.column.id
                                  );
                                  if (value) {
                                    return [
                                      ...existing,
                                      { id: header.column.id, value },
                                    ];
                                  }
                                  return existing;
                                });
                              }}
                              className="h-8"
                            />
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={getPaddingByDensity()}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="flex-1 text-sm text-muted-foreground">
            {Object.keys(rowSelection).length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(e.target.value),
                  });
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 px-2 text-sm"
              >
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex - 1,
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))
                }
                disabled={
                  pagination.pageIndex >= (table.getPageCount() || 1) - 1
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

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
