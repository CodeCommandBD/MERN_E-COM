import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dbConnection";
import { catchError, generateOTP, res } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/user.models";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rateLimit";

export async function POST(req){
    try {
        // Rate limiting: 3 OTP requests per 5 minutes per IP
        const clientIP = getClientIP(req);
        const rateCheck = await checkRateLimit(`reset-otp-send:${clientIP}`, 3, 300000);
        if (!rateCheck.allowed) {
            return rateLimitResponse(rateCheck.resetIn);
        }

        await connectDB()
        const payload = await req.json()
        const validationSchema = zSchema.pick({
            email: true
        })
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return res(false, 401, 'Invalid or missing input field', validatedData.error)
        }
        const {email} = validatedData.data
        const getUser = await UserModel.findOne({deletedAt: null, email}).lean()
        if(!getUser){
            return res(false, 404, 'User not found')
        }
        // remove old otp
        await OTPModel.deleteMany({email})
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email, otp
        })
        await newOtpData.save()

        const otpSendStatus = await sendMail('your login verification code', email, otpEmail(otp))
        if(!otpSendStatus.success){
            return res(false, 400, 'Failed to resend otp')

        }
        return res(true, 200, 'Please verify your account')

    } catch (error) {
        catchError(error)
    }
}