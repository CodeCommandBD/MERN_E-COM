'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/Routes/AdminPanelRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { useCallback, useMemo, useState, useEffect } from 'react'
import { DT_CATEGORY_COLUMN } from '@/lib/column'
import EditAction from '@/components/Application/Admin/EditAction'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { columnConfig } from '@/lib/helper'
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper'
import PageLoader from '@/components/Application/Admin/PageLoader'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import useFetch from '@/hooks/useFetch'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: "Category"
  },
  {
    href: '',
    label: "All Category"
  },

]

const ShowCategory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: stats, refetch: refetchStats } = useFetch(
    "/api/category/stats"
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
    return columnConfig(DT_CATEGORY_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<EditAction key='edit' href={ADMIN_CATEGORY_EDIT(row.original._id)}></EditAction>)
    actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}></DeleteAction>)
    return actionMenu
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Categories..." />;
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <div className='flex items-center justify-between'>
            <h4 className='text-xl font-semibold'>All Category</h4>
            <Button >
              <FiPlus></FiPlus>
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={'py-5 px-2'} suppressHydrationWarning={true}>
          <div className="mb-4">
            <div className="relative">
              <Input
                placeholder="Search by name or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg pl-9"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {(() => {
              const statusData = statsLive?.statusData || stats?.data?.statusData || [];
              const by = (name) => statusData.find((s) => s.status === name)?.count || 0;
              const cards = [
                { label: "Total Categories", value: by("total"), color: "text-black dark:text-white" },
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
            queryKey='category-data'
            fetchUrl='/api/category'
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint='/api/category/export'
            deleteEndpoint='/api/category/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
            initialGlobalFilter={debouncedSearchTerm}
            onDeleteSuccess={refetchStats}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowCategory

