import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import OrderModel from "@/Models/Order.model";
import { escapeRegex } from "@/lib/escapeRegex";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }

    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilters = searchParams.get("globalFilters") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // build match query
    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD" || deleteType === "TD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // Global search
    if (globalFilters) {
      matchQuery.$or = [
        { orderNumber: { $regex: escapeRegex(globalFilters), $options: "i" } },
        {
          "customerInfo.name": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        {
          "customerInfo.email": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        {
          "customerInfo.phone": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        {
          transactionId: { $regex: escapeRegex(globalFilters), $options: "i" },
        },
      ];
    }

    // Column filteration
    filters.forEach((element) => {
      // For orderStatus, use exact match for better accuracy
      if (element.id === "orderStatus") {
        matchQuery[element.id] = element.value;
      } else {
        matchQuery[element.id] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      }
    });

    // sorting
    let sortQuery = {};
    sorting.forEach((element) => {
      sortQuery[element.id] = element.desc ? -1 : 1;
    });

    // Aggregate pipeline
    const aggregatePipeline = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          orderNumber: 1,
          transactionId: 1,
          customerInfo: 1,
          shippingAddress: 1,
          items: 1,
          pricing: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          orderStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getOrders = await OrderModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await OrderModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getOrders,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
