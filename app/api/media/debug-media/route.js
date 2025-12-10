import { connectDB } from "@/lib/dbConnection";
import MediaModel from "@/Models/Media.model";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";

/**
 * DEBUG endpoint to check media database
 */
export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    // Count all media
    const totalCount = await MediaModel.countDocuments({});

    // Count active media (deletedAt is null)
    const activeCount = await MediaModel.countDocuments({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    // Count deleted media
    const deletedCount = await MediaModel.countDocuments({
      deletedAt: { $exists: true, $ne: null },
    });

    // Get first 5 media with details
    const sampleMedia = await MediaModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalCount,
        activeCount,
        deletedCount,
      },
      sampleMedia: sampleMedia.map((m) => ({
        _id: m._id,
        filename: m.filename,
        public_id: m.public_id,
        title: m.title,
        deletedAt: m.deletedAt,
      })),
    });
  } catch (error) {
    console.error("Debug media error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
