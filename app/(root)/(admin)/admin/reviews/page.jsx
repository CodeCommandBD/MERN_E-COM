"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/Routes/AdminPanelRoute";

import { useCallback, useMemo, useState, useEffect } from "react";
import { DT_REVIEW_COLUMN } from "@/lib/column";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { columnConfig } from "@/lib/helper";
import DataTableWrapper from "@/components/Application/Admin/DataTableWrapper";
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
    label: "Reviews",
  },
];

const ShowReviews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/review/stats"
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

  // Prepare column filters for rating filter
  const columnFilters = useMemo(() => {
    if (ratingFilter === "all") {
      return [];
    }
    return [{ id: "rating", value: ratingFilter }];
  }, [ratingFilter]);

  if (isLoading) {
    return <PageLoader message="Loading Reviews..." />;
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
            <h4 className="text-xl font-semibold">Reviews</h4>
          </div>
        </CardHeader>
        <CardContent className={"py-5 px-2"} suppressHydrationWarning={true}>
          <div className="mb-4 grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                placeholder="Search by title, review, product, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex md:justify-end">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {(() => {
              const statusData = statsLive?.statusData || stats?.data?.statusData || [];
              const by = (name) => statusData.find((s) => s.status === name);
              const totalData = by("total");
              const averageData = by("average");
              const cards = [
                { 
                  label: "Total Reviews", 
                  value: totalData?.count || 0, 
                  color: "dark:text-white" 
                },
                { 
                  label: "5 Stars", 
                  value: by("5")?.count || 0, 
                  color: "text-green-600" 
                },
                { 
                  label: "4 Stars", 
                  value: by("4")?.count || 0, 
                  color: "text-blue-600" 
                },
                { 
                  label: "Average Rating", 
                  value: averageData?.value || "0.0", 
                  color: "text-purple-600",
                  suffix: "⭐"
                },
              ];
              return cards.map((c, i) => (
                <div key={i} className="rounded-lg border bg-white dark:bg-card p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={`mt-1 text-2xl font-semibold ${c.color}`}>
                    {c.value}{c.suffix || ""}
                  </p>
                </div>
              ));
            })()}
          </div>

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
            initialGlobalFilter={debouncedSearchTerm}
            initialColumnFilters={columnFilters}
            onDeleteSuccess={refetchStats}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowReviews;
