"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";

import { useCallback, useMemo, useState, useEffect } from "react";
import { DT_CUSTOMER_COLUMN } from "@/lib/column";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
import { ADMIN_CUSTOMER_EDIT } from "@/Routes/AdminPanelRoute";
import PageLoader from "@/components/Application/Admin/PageLoader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
    label: "Customers",
  },
];

const ShowCustomers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/customers/stats"
  );
  const [statsLive, setStatsLive] = useState(null);

  useEffect(() => {
    // Show loader initially and hide it after component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stats?.data) {
      setStatsLive(stats.data);
    }
  }, [stats]);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMER_COLUMN);
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

  // Prepare column filters for verification filter
  const columnFilters = useMemo(() => {
    if (verificationFilter === "all") {
      return [];
    }
    return [{ id: "isEmailVerified", value: verificationFilter === "verified" ? "true" : "false" }];
  }, [verificationFilter]);

  if (isLoading) {
    return <PageLoader message="Loading Customers..." />;
  }

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
          <div className="mb-4 grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex md:justify-end">
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {(() => {
              const statusData = statsLive?.statusData || stats?.data?.statusData || [];
              const by = (name) => statusData.find((s) => s.status === name)?.count || 0;
              const cards = [
                { label: "Total Customers", value: by("total"), color: "text-black" },
                { label: "Verified", value: by("verified"), color: "text-green-600" },
                { label: "Unverified", value: by("unverified"), color: "text-orange-600" },
              ];
              return cards.map((c, i) => (
                <div key={i} className="rounded-lg border bg-white dark:bg-card p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={`mt-1 text-2xl font-semibold ${c.color}`}>{c.value}</p>
                </div>
              ));
            })()}
          </div>

          <DataTableWrapper
            queryKey="customer-data"
            fetchUrl="/api/customers"
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customer`}
            createAction={action}
            initialGlobalFilter={debouncedSearchTerm}
            initialColumnFilters={columnFilters}
            onDeleteSuccess={refetchStats}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomers;
