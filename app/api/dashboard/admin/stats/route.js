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
    const monthlyOrders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          amount: { $sum: 1 }, // Count orders
        },
      },
      { $sort: { _id: 1 } },
    ]);

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

    // Fill in missing months with 0
    const fullMonthlyData = monthNames.map((month, index) => {
      const found = monthlyOrders.find((m) => m._id === index + 1);
      return {
        month,
        amount: found ? found.amount : 0,
      };
    });

    // 2. Order Summary (Status Distribution)
    const statusCounts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

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
    const latestOrders = await OrderModel.find()
      .select(
        "orderNumber transactionId items orderStatus pricing.total createdAt paymentMethod"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    // 4. Latest Reviews
    const latestReviews = await ReviewModel.find({ deletedAt: null })
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
