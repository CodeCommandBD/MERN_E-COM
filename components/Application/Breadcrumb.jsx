'use client'
import React from 'react'
import { 
  Breadcrumb as BreadcrumbPrimitive, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb'

const Breadcrumb = ({ data = [], className = "" }) => {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <BreadcrumbPrimitive className={className}>
      <BreadcrumbList>
        {data.map((item, index) => (
          <React.Fragment key={item.label || index}>
            <BreadcrumbItem>
              {index < data.length - 1 ? (
                <BreadcrumbLink href={item.href || '#'}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < data.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  )
}

export default Breadcrumb
