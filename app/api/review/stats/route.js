import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ReviewModel from "@/Models/Review.model";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // Check authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    await connectDB();

    const activeFilter = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };

    // Get review statistics by rating
    let ratingStats = [];
    try {
      ratingStats = await ReviewModel.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
    } catch (_) {
      ratingStats = [];
    }

    // Get total count
    const total = await ReviewModel.countDocuments(activeFilter);
    
    // Get counts by rating (1-5 stars)
    const ratingCounts = {
      5: ratingStats.find((s) => s._id === 5)?.count || 0,
      4: ratingStats.find((s) => s._id === 4)?.count || 0,
      3: ratingStats.find((s) => s._id === 3)?.count || 0,
      2: ratingStats.find((s) => s._id === 2)?.count || 0,
      1: ratingStats.find((s) => s._id === 1)?.count || 0,
    };

    // Calculate average rating
    const totalRatingSum = ratingStats.reduce((sum, s) => sum + (s._id * s.count), 0);
    const averageRating = total > 0 ? (totalRatingSum / total).toFixed(1) : "0.0";

    // Format status data
    const statusData = [
      { status: "total", count: total },
      { status: "5", count: ratingCounts[5] },
      { status: "4", count: ratingCounts[4] },
      { status: "3", count: ratingCounts[3] },
      { status: "average", value: averageRating },
    ];

    return res(true, 200, "Review stats fetched successfully", {
      statusData,
    });
  } catch (error) {
    return catchError(error);
  }
}

