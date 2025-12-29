import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication"; // Assuming this exists or similar auth check
import cloudinary from "@/lib/cloudinary";
import { res, catchError } from "@/lib/helper";

export async function POST(req) {
  try {
    // 1. Authenticate Request
    const auth = await isAuthenticated();
    if (!auth.isAuth) {
      return res(false, 401, "Unauthorized");
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return res(false, 400, "No file provided");
    }

    // 3. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary (using Promise wrapper for stream)
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "e_com_users",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Write buffer to stream
      uploadStream.end(buffer);
    });

    // 5. Return Result
    return NextResponse.json({
      success: true,
      data: {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}
