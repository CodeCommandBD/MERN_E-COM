import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    await connectDB();

    // Get media statistics - use same filter logic as GET route
    const total = await MediaModel.countDocuments({});
    
    // Active: deletedAt is null or doesn't exist
    const active = await MediaModel.countDocuments({
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } }
      ]
    });
    
    // Trashed: deletedAt exists and is not null
    const trashed = await MediaModel.countDocuments({
      deletedAt: { $exists: true, $ne: null }
    });

    // Format status data
    const statusData = [
      { status: "total", count: total },
      { status: "active", count: active },
      { status: "trashed", count: trashed },
    ];

    return res(true, 200, "Media stats fetched successfully", {
      statusData,
    });
  } catch (error) {
    return catchError(error);
  }
}

