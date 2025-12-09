import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";
import { NextResponse } from "next/server";

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
        { name: { $regex: globalFilters, $options: "i" } },
        { slug: { $regex: globalFilters, $options: "i" } },
      ];
    }

    // Column filteration

    filters.forEach((element) => {
      matchQuery[element.id] = { $regex: element.value, $options: "i" };
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
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // Execute query
    const getCategory = await CategoryModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await CategoryModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCategory,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
