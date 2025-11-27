'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_PRODUCT_VARIANT_ADD } from '@/Routes/AdminPanelRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import { useCallback, useMemo } from 'react'
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import EditAction from '@/components/Application/Admin/EditAction'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { columnConfig } from '@/lib/helper'
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: "Product Variant"
  },
]

const ShowProductVariant = () => {

  const columns = useMemo(()=>{
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}></EditAction>)
    actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType}></DeleteAction>)
    return actionMenu
  }, [])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <div className='flex items-center justify-between'>
            <h4 className='text-xl font-semibold'>Product Variant List</h4>
            <Button className='flex items-center gap-2'>
              <FiPlus></FiPlus>
              <Link href={ADMIN_PRODUCT_VARIANT_ADD}>New Variant</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={'py-5 px-2'} suppressHydrationWarning={true}>
          <DataTableWrapper
            queryKey='product-variant-data'
            fetchUrl='/api/product-variant'
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint='/api/product-variant/export'
            deleteEndpoint='/api/product-variant/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=product-variant`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowProductVariant 



