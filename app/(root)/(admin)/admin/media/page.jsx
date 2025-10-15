import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD } from '@/Routes/AdminPanelRoute'
import React from 'react'
const breadcrumbData = [
    {href: ADMIN_DASHBOARD, label: 'Home'},
    {href: '', label: 'Media'},
]

const Media = () => {
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
    </div>
  )
}

export default Media
