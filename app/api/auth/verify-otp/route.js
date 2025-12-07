import { connectDB } from "@/lib/dbConnection";
import { res } from "@/lib/helper";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rateLimit";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/user.models";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Rate limiting: 5 OTP attempts per minute per IP
    const clientIP = getClientIP(req);
    const rateCheck = checkRateLimit(`otp:${clientIP}`, 5, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetIn);
    }

    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return res(false, 400, "Email and OTP are required");
    }

    // Find the OTP in database
    const otpRecord = await OTPModel.findOne({ email, otp });

    if (!otpRecord) {
      return res(false, 400, "Invalid OTP");
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await OTPModel.deleteOne({ _id: otpRecord._id });
      return res(false, 400, "OTP has expired");
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res(false, 404, "User not found");
    }

    const loggedInUserData = {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("7d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: true, // Always true to prevent XSS token theft
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Delete the used OTP
    await OTPModel.deleteOne({ _id: otpRecord._id });

    return res(true, 200, "Login successful", loggedInUserData);
  } catch (error) {
    return res(false, 500, "OTP verification failed");
  }
}
