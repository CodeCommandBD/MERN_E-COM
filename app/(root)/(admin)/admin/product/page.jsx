'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/Routes/AdminPanelRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { DT_PRODUCT_COLUMN } from '@/lib/column'
import EditAction from '@/components/Application/Admin/EditAction'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { columnConfig } from '@/lib/helper'
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper'
import PageLoader from '@/components/Application/Admin/PageLoader'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import useFetch from '@/hooks/useFetch'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_PRODUCT_SHOW,
    label: "Product"
  },


]

const ShowProduct = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/product/stats"
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

  const columns = useMemo(()=>{
    return columnConfig(DT_PRODUCT_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_EDIT(row.original._id)}></EditAction>)
    actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}></DeleteAction>)
    return actionMenu
  }, [])

  // Prepare column filters for category filter
  const columnFilters = useMemo(() => {
    if (categoryFilter === "all") {
      return [];
    }
    return [{ id: "category", value: categoryFilter }];
  }, [categoryFilter]);

  if (isLoading) {
    return <PageLoader message="Loading Products..." />;
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <div className='flex items-center justify-between'>
            <h4 className='text-xl font-semibold'>All Product</h4>
            <Button className='flex items-center gap-2'>
              <FiPlus></FiPlus>
              <Link href={ADMIN_PRODUCT_ADD}>New Product</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={'py-5 px-2'} suppressHydrationWarning={true}>
          <div className="mb-4 grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Input
                placeholder="Search by name, slug, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex md:justify-end">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {(() => {
              const statusData = statsLive?.statusData || stats?.data?.statusData || [];
              const by = (name) => statusData.find((s) => s.status === name)?.count || 0;
              const cards = [
                { label: "Total Products", value: by("total"), color: "text-black" },
                { label: "Active", value: by("active"), color: "text-green-600" },
                { label: "Trashed", value: by("trashed"), color: "text-red-600" },
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
            queryKey='product-data'
            fetchUrl='/api/product'
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint='/api/product/export'
            deleteEndpoint='/api/product/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
            initialGlobalFilter={debouncedSearchTerm}
            initialColumnFilters={columnFilters}
            onDeleteSuccess={refetchStats}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowProduct 



