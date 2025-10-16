import { catchError } from "@/lib/helper"
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
    try {
        const payload = await request.json()
        const {paramsToSign} = payload
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY)
        return NextResponse.json({signature})
        
    } catch (error) {
        return catchError(error)
    }
}