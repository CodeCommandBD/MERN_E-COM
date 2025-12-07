import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import { NextResponse } from "next/server";
import { escapeRegex } from "@/lib/escapeRegex";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    const deleteType = searchParams.get("deleteType"); // 'SD' | 'PD' | undefined
    const search = searchParams.get("search") || "";

    // SD = show non-deleted, PD = show trashed, undefined = show all
    const filterConditions = [];

    // Add deleteType filter
    if (deleteType === "SD") {
      // Active: deletedAt is null or doesn't exist
      filterConditions.push({
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      });
    } else if (deleteType === "PD") {
      // Trashed: deletedAt exists and is not null
      filterConditions.push({
        deletedAt: { $exists: true, $ne: null },
      });
    }
    // If deleteType is not provided or empty, show all (no filter)

    // Add search filter
    if (search && search.trim()) {
      filterConditions.push({
        $or: [
          { title: { $regex: escapeRegex(search.trim()), $options: "i" } },
          { alt: { $regex: escapeRegex(search.trim()), $options: "i" } },
          { public_id: { $regex: escapeRegex(search.trim()), $options: "i" } },
        ],
      });
    }

    // Combine all conditions with $and, or use empty object if no conditions
    const filter =
      filterConditions.length > 0 ? { $and: filterConditions } : {};

    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();
    const totalMedia = await MediaModel.countDocuments(filter);

    return NextResponse.json({
      mediaData: mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });
  } catch (error) {
    return catchError(error);
  }
}

export async function PATCH(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }
    await connectDB();
    const body = await request.json();
    const ids = Array.isArray(body?.ids) ? body.ids : [];
    const action = body?.action; // 'SD' | 'RSD' | 'PD'
    if (ids.length === 0 || !action) {
      return res(false, 400, "Invalid request payload");
    }
    if (action === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return res(true, 200, "Moved to trash successfully");
    }
    if (action === "RSD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return res(true, 200, "Restored from trash successfully");
    }
    if (action === "PD") {
      await MediaModel.deleteMany({ _id: { $in: ids } });
      return res(true, 200, "Deleted permanently");
    }
    return res(false, 400, "Unknown action");
  } catch (error) {
    return catchError(error);
  }
}
