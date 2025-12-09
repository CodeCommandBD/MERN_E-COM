import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import SupportChatModel from "@/Models/SupportChat.model";
import { escapeRegex } from "@/lib/escapeRegex";

export const dynamic = "force-dynamic";

// Get all support tickets (for admin) - Updated to support DataTableWrapper
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

    if (deleteType === "SD" || !deleteType || deleteType === "undefined") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD" || deleteType === "TD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // Global search
    if (globalFilters) {
      matchQuery.$or = [
        { ticketNumber: { $regex: escapeRegex(globalFilters), $options: "i" } },
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
      ];
    }

    // Column filteration
    filters.forEach((element) => {
      // For status, use exact match for better accuracy
      if (element.id === "status") {
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

    // Check if stats only is requested
    const statsOnly = searchParams.get("statsOnly") === "true";

    if (statsOnly) {
      // Return only stats counts - only for non-deleted items
      const statsMatchQuery =
        deleteType === "SD" ? { deletedAt: null } : matchQuery;
      const totalTickets = await SupportChatModel.countDocuments(
        statsMatchQuery
      );
      const openTickets = await SupportChatModel.countDocuments({
        ...statsMatchQuery,
        status: "open",
      });
      const inProgressTickets = await SupportChatModel.countDocuments({
        ...statsMatchQuery,
        status: "in-progress",
      });
      const resolvedTickets = await SupportChatModel.countDocuments({
        ...statsMatchQuery,
        status: "resolved",
      });

      return NextResponse.json({
        success: true,
        data: {
          total: totalTickets,
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
        },
      });
    }

    // Aggregate pipeline
    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $sort: Object.keys(sortQuery).length
          ? sortQuery
          : { lastMessageAt: -1 },
      },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          ticketNumber: 1,
          customerInfo: 1,
          status: 1,
          messages: 1,
          lastMessageAt: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getTickets = await SupportChatModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await SupportChatModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getTickets,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
