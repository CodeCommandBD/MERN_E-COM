import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BreadCrumb = ({ breadcrumbData }) => {
    return (
        <Breadcrumb className={'mb-5'}>
            <BreadcrumbList>
                {Array.isArray(breadcrumbData) && breadcrumbData.length > 0 ? (
                    breadcrumbData.map((breadcrumb, index) => {
                        const isLast = index === breadcrumbData.length - 1
                        const key = breadcrumb?.href || `${breadcrumb?.label || 'crumb'}-${index}`
                        return (
                            <React.Fragment key={key}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </React.Fragment>
                        )
                    })
                ) : (
                    !!breadcrumbData && (
                        <>
                            <BreadcrumbItem>
                                {typeof breadcrumbData === 'object' && breadcrumbData?.href ? (
                                    <BreadcrumbLink href={breadcrumbData.href}>{breadcrumbData.label}</BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{typeof breadcrumbData === 'string' ? breadcrumbData : breadcrumbData?.label}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </>
                    )
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb
