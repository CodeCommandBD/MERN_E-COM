import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dbConnection";
import { catchError, generateOTP, res } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rateLimit";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/user.models";
import { z } from "zod";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    // Rate limiting: 5 login attempts per minute per IP
    const clientIP = getClientIP(req);
    const rateCheck = checkRateLimit(`login:${clientIP}`, 5, 60000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetIn);
    }

    await connectDB();

    // TODO:######### validation form Data For backend
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    // TODO: ####### Get All DATA from Form
    const payload = await req.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return res(
        false,
        401,
        "Invalid or missing input field",
        validatedData.error
      );
    }
    const { email, password } = validatedData.data;

    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );
    if (!getUser) {
      return res(false, 400, "Invalid login credentials.");
    }

    // TODO:############# resend email verification link
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({
        userId: getUser._id.toString(),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      await sendMail(
        "Email Verification request from Developer Shanto",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );
      return res(
        false,
        401,
        "Your email is not verified. we have sent a verification link to your registered email address"
      );
    }

    //TODO: ########## Password verification

    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return res(false, 400, "Invalid login password.");
    }
    //TODO: ###########  OTP Generate
    await OTPModel.deleteMany({ email }); //TODO ############ deleting old otp

    const otp = generateOTP();
    // TODO ########## Storing otp into database
    const newOtpData = new OTPModel({
      email,
      otp: otp.toString(), // Ensure it's stored as string
    });
    await newOtpData.save();

    const otpEmailStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return res(false, 400, "Failed to send OTP");
    }
    return res(true, 200, "Please verify your device");
  } catch (error) {
    return catchError(error);
  }
}
