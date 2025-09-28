import { connectDB } from "@/lib/dbConnection";
import { res, catchError } from "@/lib/helper";
import UserModel from "@/Models/user.models";
import { jwtVerify } from "jose";
import { z } from "zod";

export async function POST(req) {
    try {
        await connectDB()
        const {token, email} = await req.json()

        // If email is provided, manually verify it (for testing)
        if(email && !token) {
            const user = await UserModel.findOne({ email });
            if(!user){
                return res(false, 404, 'User not found.')
            }
            user.isEmailVerified = true
            await user.save()
            return res(true, 200, `Email ${email} has been verified successfully!`)
        }

        if(!token){
            return res(false, 400, 'Missing token.')
        }

        const secretKey = process.env.SECRET_KEY
        if(!secretKey){
            throw new Error('SECRET_KEY is not configured')
        }
        const secret = new TextEncoder().encode(secretKey);
        const decoded = await jwtVerify(token, secret)
        const userId = decoded.payload.userId

        // TODO: ###### Get user
        const user = await UserModel.findById(userId)
        if(!user){
            return res(false, 404, 'User not found.')
        }
        user.isEmailVerified = true
        await user.save()
        return res(true, 200, 'Email verification is success.')
    } catch (error) {
        return res(false, 500, 'Email verification failed')
    }
}