import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import UserModel from "@/Models/user.models";

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

    // Get customer statistics
    let statsData = [];
    try {
      statsData = await UserModel.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: "$isEmailVerified",
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (_) {
      statsData = [];
    }

    // Get total count
    const total = await UserModel.countDocuments(activeFilter);
    
    // Get verified and unverified counts
    const verifiedCount = statsData.find((s) => s._id === true)?.count || 0;
    const unverifiedCount = statsData.find((s) => s._id === false || s._id === null)?.count || 0;

    // Format status data similar to orders
    const statusData = [
      { status: "total", count: total },
      { status: "verified", count: verifiedCount },
      { status: "unverified", count: unverifiedCount },
    ];

    return res(true, 200, "Customer stats fetched successfully", {
      statusData,
    });
  } catch (error) {
    return catchError(error);
  }
}

