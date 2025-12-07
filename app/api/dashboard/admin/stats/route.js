import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model";
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

    // 1. Order Overview (Monthly Orders)
    // Use a robust JS computation to avoid aggregation failures
    const activeFilter = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };
    let monthlyOrdersDocs = [];
    try {
      monthlyOrdersDocs = await OrderModel.find(activeFilter, "createdAt").lean();
    } catch (_) {
      monthlyOrdersDocs = [];
    }

    const monthCounts = Array(12).fill(0);
    for (const doc of monthlyOrdersDocs) {
      const d = new Date(doc.createdAt);
      if (!isNaN(d)) {
        monthCounts[d.getMonth()]++;
      }
    }

    // Map month numbers to names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const fullMonthlyData = monthNames.map((month, index) => ({
      month,
      amount: monthCounts[index] || 0,
    }));

    // 2. Order Summary (Status Distribution)
    let statusCounts = [];
    try {
      statusCounts = await OrderModel.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (_) {
      statusCounts = [];
    }

    // Define all possible statuses ensuring colors match standard UI
    const allStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "confirmed",
    ];

    const statusData = allStatuses.map((status) => {
      const found = statusCounts.find((s) => s._id === status);
      return {
        status,
        count: found ? found.count : 0,
        fill: `var(--color-${status})`,
      };
    });

    // 3. Latest Orders
    let latestOrders = [];
    try {
      latestOrders = await OrderModel.find(activeFilter)
        .select(
          "orderNumber transactionId items orderStatus pricing.total createdAt paymentMethod"
        )
        .sort({ createdAt: -1 })
        .limit(10);
    } catch (_) {
      latestOrders = [];
    }

    // 4. Latest Reviews
    let latestReviews = [];
    try {
      latestReviews = await ReviewModel.find({ deletedAt: null })
        .populate({
          path: "product",
          select: "name media",
          populate: {
            path: "media",
            select: "secure_url",
          },
        })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .limit(10);
    } catch (_) {
      latestReviews = [];
    }

    return res(true, 200, "Dashboard stats fetched successfully", {
      monthlyOrders: fullMonthlyData,
      statusData,
      latestOrders,
      latestReviews,
    });
  } catch (error) {
    return catchError(error);
  }
}
