import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }
    await connectDB();

    // Get recent media files to see what's actually stored
    const recentMedia = await MediaModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const mediaInfo = recentMedia.map((m) => ({
      id: m._id,
      filename: m.filename || "N/A",
      public_id: m.public_id,
      title: m.title || "N/A",
      alt: m.alt || "N/A",
    }));

    return NextResponse.json({
      success: true,
      total: await MediaModel.countDocuments({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      }),
      recentMedia: mediaInfo,
    });
  } catch (error) {
    return catchError(error);
  }
}
