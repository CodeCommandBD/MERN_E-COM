import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/dbConnection";
import { res } from "@/lib/helper";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rateLimit";
import { sendMail } from "@/lib/sendMail";
import UserModel from "@/Models/user.models";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    // Rate limiting: 3 resend attempts per 5 minutes per IP
    const clientIP = getClientIP(req);
    const rateCheck = await checkRateLimit(
      `resend-verification:${clientIP}`,
      3,
      300000
    );
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetIn);
    }

    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return res(false, 400, "Email is required");
    }

    // Find user
    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) {
      return res(false, 404, "User not found");
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res(false, 400, "Email is already verified");
    }

    // Generate verification token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Send verification email
    const emailStatus = await sendMail(
      "Email Verification - Developer Shanto",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    if (!emailStatus.success) {
      return res(false, 500, "Failed to send verification email");
    }

    return res(true, 200, "Verification email sent successfully");
  } catch (error) {
    console.error("Resend verification error:", error);
    return res(false, 500, "Failed to resend verification email");
  }
}
