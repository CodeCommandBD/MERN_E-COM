import { NextResponse } from "next/server"

export const res = (success, statusCode, message, data ={}) => {
    return NextResponse.json({
        success, statusCode, message, data
    })
}

export const catchError = (error, customMessage) =>{
    if(error.code === 11000){
        const keys = Object.keys(error.keyPattern).join(',')
        error.message = `Duplicate field: ${keys}. These fields value must be unique`
    }
    let errorObj = {}
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
    return NextResponse.json({
        success: false,
        statusCode: error.code,
        ...errorObj
    })
}
export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
} 