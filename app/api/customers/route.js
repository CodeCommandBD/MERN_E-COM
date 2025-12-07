import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import UserModel from "@/Models/user.models";


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
        { name: { $regex: globalFilters, $options: "i" } },
        { email: { $regex: globalFilters, $options: "i" } },
        { phone: { $regex: globalFilters, $options: "i" } },
        { address: { $regex: globalFilters, $options: "i" } },
        { isEmailVerified: { $regex: globalFilters, $options: "i" } },
      ];
    }

    // Column filteration

    filters.forEach((element) => {
      // Handle boolean fields differently
      if (element.id === "isEmailVerified") {
        matchQuery[element.id] = element.value === "true" || element.value === true;
      } else {
        matchQuery[element.id] = { $regex: element.value, $options: "i" };
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
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          avatar: 1,
          isEmailVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // Execute query
    const getCustomers = await UserModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await UserModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCustomers,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
