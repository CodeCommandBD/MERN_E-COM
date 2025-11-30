import { WEBSITE_SHOP } from '@/Routes/WebsiteRoute'
import React from 'react'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import Filter from '@/components/Application/Website/Filter'

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
       <section className='lg:flex lg:px-32 my-20'>
        <div className='w-72 me-4'>
            <div className='sticky top-0 bg-gray-50 p-4 rounded'>
                <Filter></Filter>
            </div>
        </div>
       </section>
    </div>
  )
}

export default Shop