import { isAuthenticated } from "@/lib/authentication";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import ProductVariantModel from "@/Models/Product.Variant.model";
import { escapeRegex } from "@/lib/escapeRegex";

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

    // build match query (before lookup)
    let preLookupMatch = {};
    let postLookupMatch = {};

    if (deleteType === "SD") {
      preLookupMatch = { deletedAt: null };
    } else if (deleteType === "PD" || deleteType === "TD") {
      preLookupMatch = { deletedAt: { $ne: null } };
    }

    // Global search
    if (globalFilters) {
      postLookupMatch.$or = [
        { sku: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { color: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { size: { $regex: escapeRegex(globalFilters), $options: "i" } },
        {
          "productData.name": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: escapeRegex(globalFilters),
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
              regex: escapeRegex(globalFilters),
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: escapeRegex(globalFilters),
              options: "i",
            },
          },
        },
      ];
    }

    // Column filteration
    filters.forEach((element) => {
      if (
        element.id === "mrp" ||
        element.id === "sellingPrice" ||
        element.id === "discountPercentage"
      ) {
        postLookupMatch[element.id] = Number(element.value);
      } else if (element.id === "product") {
        postLookupMatch["productData.name"] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      } else {
        postLookupMatch[element.id] = {
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
      { $match: preLookupMatch },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(Object.keys(postLookupMatch).length > 0
        ? [{ $match: postLookupMatch }]
        : []),
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          sku: 1,
          color: 1,
          size: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getProductVariant = await ProductVariantModel.aggregate(
      aggregatePipeline
    );

    // Get TotalRowCount using aggregation
    const countPipeline = [
      { $match: preLookupMatch },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(Object.keys(postLookupMatch).length > 0
        ? [{ $match: postLookupMatch }]
        : []),
      { $count: "total" },
    ];

    const countResult = await ProductVariantModel.aggregate(countPipeline);
    const totalRowCount = countResult.length > 0 ? countResult[0].total : 0;

    return NextResponse.json({
      success: true,
      data: getProductVariant,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
