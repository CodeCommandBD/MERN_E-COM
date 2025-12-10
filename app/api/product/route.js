import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import { NextResponse } from "next/server";
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

    // build base match query for Product collection (before lookups)
    let baseMatchQuery = {};

    if (deleteType === "SD") {
      baseMatchQuery = {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      };
    } else if (deleteType === "PD" || deleteType === "TD") {
      baseMatchQuery = {
        deletedAt: { $exists: true, $ne: null },
      };
    }

    // build aggregation match query (after lookups, can use lookup fields)
    let aggregationMatchQuery = { ...baseMatchQuery };

    // Column filteration
    const columnFilters = {};
    filters.forEach((element) => {
      if (
        element.id === "mrp" ||
        element.id === "sellingPrice" ||
        element.id === "discountPercentage"
      ) {
        columnFilters[element.id] = Number(element.value);
        baseMatchQuery[element.id] = Number(element.value);
      } else if (element.id === "category") {
        // Category filter needs to use categoryData.name after lookup
        columnFilters["categoryData.name"] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      } else {
        columnFilters[element.id] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
        baseMatchQuery[element.id] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      }
    });

    // Build global search conditions (for aggregation match after lookups)
    let globalSearchConditions = null;
    if (globalFilters) {
      // Flexible search like media API - spaces, hyphens, underscores interchangeable
      const normalizedForUnderscore = globalFilters
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
      
      const flexiblePattern = globalFilters
        .replace(/[\s_-]+/g, '[\\s_-]*')
        .toLowerCase();

      globalSearchConditions = [
        // Exact match
        { name: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { slug: { $regex: escapeRegex(globalFilters), $options: "i" } },
        {
          "categoryData.name": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        // Flexible pattern matching for name and slug
        { name: { $regex: flexiblePattern, $options: "i" } },
        { slug: { $regex: flexiblePattern, $options: "i" } },
        // Normalized underscore matching
        { name: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
        { slug: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
      ];
    }

    // Build base search conditions (for base match before lookups)
    let baseSearchConditions = null;
    if (globalFilters) {
      // Flexible search like media API
      const normalizedForUnderscore = globalFilters
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
      
      const flexiblePattern = globalFilters
        .replace(/[\s_-]+/g, '[\\s_-]*')
        .toLowerCase();

      baseSearchConditions = [
        // Exact match
        { name: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { slug: { $regex: escapeRegex(globalFilters), $options: "i" } },
        // Flexible pattern matching
        { name: { $regex: flexiblePattern, $options: "i" } },
        { slug: { $regex: flexiblePattern, $options: "i" } },
        // Normalized underscore matching
        { name: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
        { slug: { $regex: escapeRegex(normalizedForUnderscore), $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilters,
              options: "i",
            },
          },
        },
      ];
    }

    // Combine all conditions for aggregation match query
    const aggregationConditions = [];
    if (Object.keys(baseMatchQuery).length > 0) {
      aggregationConditions.push(baseMatchQuery);
    }
    if (globalSearchConditions) {
      aggregationConditions.push({ $or: globalSearchConditions });
    }
    if (Object.keys(columnFilters).length > 0) {
      aggregationConditions.push(columnFilters);
    }

    let finalAggregationMatchQuery = {};
    if (aggregationConditions.length > 1) {
      finalAggregationMatchQuery = { $and: aggregationConditions };
    } else if (aggregationConditions.length === 1) {
      finalAggregationMatchQuery = aggregationConditions[0];
    }

    // Update baseMatchQuery with global search for count (if needed)
    if (baseSearchConditions) {
      if (Object.keys(baseMatchQuery).length > 0) {
        if (baseMatchQuery.$or) {
          baseMatchQuery = {
            $and: [baseMatchQuery, { $or: baseSearchConditions }],
          };
        } else {
          baseMatchQuery = {
            $and: [baseMatchQuery, { $or: baseSearchConditions }],
          };
        }
      } else {
        baseMatchQuery = { $or: baseSearchConditions };
      }
    }

    // sorting
    let sortQuery = {};

    sorting.forEach((element) => {
      sortQuery[element.id] = element.desc ? -1 : 1;
    });

    // Aggregate pipeline - match deletedAt before lookups for better performance
    const aggregatePipeline = [];

    // Check if we need to match before lookups (simple conditions only)
    const needsPreMatch =
      Object.keys(baseMatchQuery).length > 0 &&
      !globalSearchConditions &&
      Object.keys(columnFilters).length === 0;
    const needsPostMatch =
      globalSearchConditions ||
      Object.keys(columnFilters).length > 0 ||
      (Object.keys(baseMatchQuery).length > 0 && !needsPreMatch);

    // Add initial match for deletedAt if it's a simple condition
    if (needsPreMatch) {
      aggregatePipeline.push({ $match: baseMatchQuery });
    }

    // Add lookups
    aggregatePipeline.push(
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
      }
    );

    // Add match after lookups (for fields that need lookups or combined conditions)
    if (needsPostMatch && Object.keys(finalAggregationMatchQuery).length > 0) {
      aggregatePipeline.push({ $match: finalAggregationMatchQuery });
    }

    // Add sort, skip, limit, and project
    aggregatePipeline.push(
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
          stock: { $ifNull: ["$stock", 0] },
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      }
    );

    // Execute query
    const getProducts = await ProductModel.aggregate(aggregatePipeline);

    // Get TotalRowCount - use aggregation to match the same logic
    const countPipeline = [];

    // Check if we need to match before lookups (simple conditions only)
    const countNeedsPreMatch =
      Object.keys(baseMatchQuery).length > 0 &&
      !globalSearchConditions &&
      Object.keys(columnFilters).length === 0;
    const countNeedsPostMatch =
      globalSearchConditions ||
      Object.keys(columnFilters).length > 0 ||
      (Object.keys(baseMatchQuery).length > 0 && !countNeedsPreMatch);

    // Add initial match for deletedAt if it's a simple condition
    if (countNeedsPreMatch) {
      countPipeline.push({ $match: baseMatchQuery });
    }

    // Add lookups
    countPipeline.push(
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
      }
    );

    // Add match after lookups if needed
    if (
      countNeedsPostMatch &&
      Object.keys(finalAggregationMatchQuery).length > 0
    ) {
      countPipeline.push({ $match: finalAggregationMatchQuery });
    }

    countPipeline.push({ $count: "total" });

    const countResult = await ProductModel.aggregate(countPipeline);
    const totalRowCount = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getProducts,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
