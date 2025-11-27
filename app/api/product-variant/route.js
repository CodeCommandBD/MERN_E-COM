import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
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
        { name: { $regex: globalFilters, $options: "i" } },
        { slug: { $regex: globalFilters, $options: "i" } },
        { 'categoryData.name': { $regex: globalFilters, $options: "i" } },
        {
            $expr:{
                $regexMatch: {
                    input: {$toString: '$mrp'},
                    regex: globalFilters,
                    options: "i"
                }
            }
        },
        {
            $expr:{
                $regexMatch: {
                    input: {$toString: '$sellingPrice'},
                    regex: globalFilters,
                    options: "i"
                }
            }
        },
        {
            $expr:{
                $regexMatch: {
                    input: {$toString: '$discountPercentage'},
                    regex: globalFilters,
                    options: "i"
                }
            }
        }
      ];
    }

    // Column filteration

    filters.forEach((element) => {
        if(element.id === 'mrp' || element.id === 'sellingPrice' || element.id === 'discountPercentage'){
            matchQuery[element.id] =  Number(element.value)
        }else{
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
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // Execute query
    const getProducts = await ProductModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProducts,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
