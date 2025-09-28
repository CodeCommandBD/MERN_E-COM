import { connectDB } from "@/lib/dbConnection";
import { res } from "@/lib/helper";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/user.models";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, otp } = await req.json();
    
    if (!email || !otp) {
      return res(false, 400, 'Email and OTP are required');
    }
    
    // Find the OTP in database
    const otpRecord = await OTPModel.findOne({ email, otp });
    
    if (!otpRecord) {
      return res(false, 400, 'Invalid OTP');
    }
    
    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await OTPModel.deleteOne({ _id: otpRecord._id });
      return res(false, 400, 'OTP has expired');
    }
    
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res(false, 404, 'User not found');
    }


    
    // Delete the used OTP
    await OTPModel.deleteOne({ _id: otpRecord._id });
    
    return res(true, 200, 'OTP verified');
    
  } catch (error) {
    return res(false, 500, 'OTP verification failed');
  }
}
