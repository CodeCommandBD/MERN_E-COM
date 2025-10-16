import { jwtVerify } from "jose"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

export const isAuthenticated = async (role) => {
    try {
        const cookieStore = await cookies()
        if(!cookieStore.has('access_token')){
            return {
                isAuth: false
            }
        }
        const access_token = cookieStore.get('access_token')
        const { payload } = await jwtVerify(access_token.value, new TextEncoder().encode(process.env.SECRET_KEY))
        if(payload.role !== role){
            return {
                isAuth:false
            }
        }
        return{
            isAuth: true,
            userId: payload._id
        }
    } catch (error) {
        return{
            isAuth: false,
            error
        }
    }
}