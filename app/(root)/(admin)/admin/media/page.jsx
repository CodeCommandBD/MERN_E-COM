import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
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
      <UploadMedia></UploadMedia>
    </div>
  )
}

export default Media
