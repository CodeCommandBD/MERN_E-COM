import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import ReviewModel from "@/Models/review.models";


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
        { "productData.name": { $regex: globalFilters, $options: "i" } },
        { "userData.name": { $regex: globalFilters, $options: "i" } },
        { rating: { $regex: globalFilters, $options: "i" } },
        { title: { $regex: globalFilters, $options: "i" } },
        { review: { $regex: globalFilters, $options: "i" } },
      ];
    }

    // Column filteration

    filters.forEach((element) => {
      if(element.id === "productData"){
        matchQuery["productData.name"] = { $regex: element.value, $options: "i" };
      }
      
      else if(element.id === "user"){
        matchQuery["userData.name"] = { $regex: element.value, $options: "i" };
      }
      
      else{
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
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {path: "productData", preserveNullAndEmptyArrays: true},
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {path: "userData", preserveNullAndEmptyArrays: true},
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          title: 1,
          review: 1,
          rating: 1,
          product: "$productData.name",
          user: "$userData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // Execute query
    const getReviews = await ReviewModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getReviews, 
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
