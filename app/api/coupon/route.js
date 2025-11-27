import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CouponModel from "@/Models/Coupon.model"; 
import { NextResponse } from "next/server";

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
        { code: { $regex: globalFilters, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
        // {
        //   $expr: {
        //     $regexMatch: {
        //       input: { $toString: "$validity" },
        //       regex: globalFilters,
        //       options: "i",
        //     },
        //   },
        // },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$miniShoppingAmount" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
      ];
    }

    // Column filteration

    filters.forEach((element) => {
        if(element.id === 'discountPercentage' || element.id === 'miniShoppingAmount'){
            matchQuery[element.id] =  Number(element.value)
        }
        else if(element.id === 'validity'){
            matchQuery[element.id] =  {$gte: new Date(element.value)}
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
     
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          discountPercentage: 1,
          validity: 1,
          miniShoppingAmount: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // Execute query
    const getCoupons = await CouponModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCoupons,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
