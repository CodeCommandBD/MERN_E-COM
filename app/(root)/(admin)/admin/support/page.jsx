"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";
import React, { useCallback, useMemo } from "react";
import { DT_SUPPORT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";


const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Support",
  },
];

const AdminSupport = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/support/list?deleteType=SD&statsOnly=true"
  );

  // Debounce search term to avoid too many API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const columns = useMemo(() => {
    return columnConfig(DT_SUPPORT_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    const id = row?.original?._id;
    const items = [
      <MenuItem key="view">
        <Link href={`/admin/support/${id}`}>View Chat</Link>
      </MenuItem>,
    ];
    return items;
  }, []);

  // Prepare column filters for status filter
  const columnFilters = useMemo(() => {
    if (statusFilter === "all") {
      return [];
    }
    return [{ id: "status", value: statusFilter }];
  }, [statusFilter]);

  // Get stats from API response
  const statsData = stats?.data || {};
  const totalTickets = statsData.total || 0;
  const openTickets = statsData.open || 0;
  const inProgressTickets = statsData.inProgress || 0;
  const resolvedTickets = statsData.resolved || 0;

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
            <h4 className="text-xl font-semibold">Support Tickets</h4>
          </div>
        </CardHeader>
        <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <div className="mb-4 grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                placeholder="Search by ticket number, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex md:justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border bg-white dark:bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Tickets</p>
              <p className="mt-1 text-2xl font-semibold text-black">
                {totalTickets}
              </p>
            </div>
            <div className="rounded-lg border bg-white dark:bg-card p-4">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">
                {openTickets}
              </p>
            </div>
            <div className="rounded-lg border bg-white dark:bg-card p-4">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">
                {inProgressTickets}
              </p>
            </div>
            <div className="rounded-lg border bg-white dark:bg-card p-4">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="mt-1 text-2xl font-semibold text-purple-600">
                {resolvedTickets}
              </p>
            </div>
          </div>

          <DataTableWrapper
            queryKey="support-data"
            fetchUrl="/api/support/list"
            columnsConfig={columns}
            initialPageSize={10}
            deleteEndpoint="/api/support/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=support`}
            createAction={action}
            initialGlobalFilter={debouncedSearchTerm}
            initialColumnFilters={columnFilters}
            onDeleteSuccess={refetchStats}
            onStatusUpdate={refetchStats}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupport;
