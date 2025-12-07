import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/Models/user.models";
import { SignJWT } from "jose";

import {
  checkRateLimit,
  getClientIP,
  rateLimitResponse,
} from "@/lib/rateLimit";

export async function POST(req) {
  try {
    // Rate limiting: 3 registrations per hour per IP
    const clientIP = getClientIP(req);
    const rateCheck = checkRateLimit(`register:${clientIP}`, 3, 3600000);
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetIn);
    }

    // TODO: ####### Connected DATABASE
    await connectDB();

    // TODO:######### validation form Data For backend
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
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

    const { name, email, password } = validatedData.data;

    // TODO: ########## user already Exist

    const checkUser = await UserModel.exists({ email });

    if (checkUser) {
      return res(false, 409, "User already registered");
    }
    // TODO: ##### new registration
    const NewRegistration = new UserModel({
      name,
      email,
      password,
    });
    await NewRegistration.save();

    // TODO: ######### email verification

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: NewRegistration._id.toString() })
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
      true,
      200,
      "Registration success, Please verify your email address"
    );
  } catch (error) {
    return res(false, 500, "Internal server error");
  }
}
