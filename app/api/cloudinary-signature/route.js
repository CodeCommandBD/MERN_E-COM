import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(request) {
  try {
    // SECURITY: Require admin authentication for Cloudinary uploads
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 401, "Unauthorized. Admin access required.");
    }

    const payload = await request.json();
    const { paramsToSign } = payload;
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY
    );
    return NextResponse.json({ signature });
  } catch (error) {
    return catchError(error);
  }
}
