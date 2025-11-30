import { WEBSITE_SHOP } from '@/Routes/WebsiteRoute'
import React from 'react'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'

const breadcrumb = {
    title: "Shop",
    links: [
        {
            label: "Shop",
            href: WEBSITE_SHOP
        }
    ]
}
    

const Shop = () => {
  return (
    <div>
       <WebsiteBreadCrumb props={breadcrumb} /> 
    </div>
  )
}

export default Shop