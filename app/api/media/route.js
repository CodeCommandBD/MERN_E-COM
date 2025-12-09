import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import { NextResponse } from "next/server";
import { escapeRegex } from "@/lib/escapeRegex";

export const dynamic = "force-dynamic";

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

    // Add search filter - search by filename, public_id, title, and alt
    if (search && search.trim()) {
      const searchTerm = search.trim();
      // Remove file extension if present for searching
      const searchWithoutExt = searchTerm.replace(/\.[a-zA-Z0-9]+$/, '');
      
      // Escape the original search for exact matching
      const escapedSearch = escapeRegex(searchWithoutExt);
      const searchRegex = { $regex: escapedSearch, $options: "i" };
      
      // Normalize the search term: convert spaces/hyphens to underscores for flexible matching
      const normalizedForUnderscore = searchWithoutExt
        .replace(/[\s-]+/g, '_')  // Replace spaces and hyphens with underscores
        .toLowerCase();
      
      // Also create a pattern that matches any combination of separators
      // This will match "Single Jersey" with "Single_Jersey", "Single-Jersey", "Single Jersey" etc.
      const flexiblePattern = searchWithoutExt
        .replace(/[\s_-]+/g, '[\\s_-]*')  // Allow any whitespace/underscore/hyphen
        .toLowerCase();
      
      // Build comprehensive OR conditions
      const searchConditions = [
        // Exact match in any field
        { filename: searchRegex },
        { public_id: searchRegex },
        { title: searchRegex },
        { alt: searchRegex },
        // Flexible matching (spaces, underscores, hyphens are interchangeable)
        { filename: { $regex: flexiblePattern, $options: "i" } },
        { public_id: { $regex: flexiblePattern, $options: "i" } },
        // Normalized underscore matching
        { filename: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
        { public_id: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
      ];
      
      filterConditions.push({
        $or: searchConditions,
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
