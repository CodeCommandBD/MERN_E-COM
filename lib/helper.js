
import { NextResponse } from "next/server"

export const res = (success, statusCode, message, data ={}) => {
    return NextResponse.json(
        { success, statusCode, message, data },
        { status: statusCode }
    )
}

export const catchError = (error, customMessage) =>{
    if(error.code === 11000){
        const keys = Object.keys(error.keyPattern).join(',')
        error.message = `Duplicate field: ${keys}. These fields value must be unique`
    }
    let errorObj = {}
    const status = error.status || error.statusCode || 500
    if(process.env.NODE_ENV === 'development'){
        errorObj = {
            message: error.message,
            error
        }
    }else{
        errorObj = {
            message: customMessage || 'Internal server error'
        }
    }
    return NextResponse.json(
        {
            success: false,
            statusCode: status,
            ...errorObj
        },
        { status }
    )
}
export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
} 



export const columnConfig = (column, isCreatedAt=false, isUpdatedAt=false, isDeletedAt=false) => {
    const newColumn = [...column]
    if(isCreatedAt){
        newColumn.push({ 
            accessorKey: "createdAt", 
            header: "Created At",
            cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
        })
    }
    if(isUpdatedAt){
        newColumn.push({ 
            accessorKey: "updatedAt", 
            header: "Updated At",
            cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
        })
    }
    if(isDeletedAt){
        newColumn.push({ 
            accessorKey: "deletedAt", 
            header: "Deleted At",
            cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
        })
    }

    return newColumn
}