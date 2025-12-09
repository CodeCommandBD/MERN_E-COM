import { isAuthenticated } from "@/lib/authentication";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { NextResponse } from "next/server";
import ReviewModel from "@/Models/Review.model";
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

    // build base match query for Review collection (before lookups)
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

    // Column filteration
    const columnFilters = {};
    filters.forEach((element) => {
      if (element.id === "productData") {
        columnFilters["productData.name"] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      } else if (element.id === "user") {
        columnFilters["userData.name"] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      } else if (element.id === "rating") {
        const ratingValue = parseInt(element.value, 10);
        if (!isNaN(ratingValue)) {
          columnFilters[element.id] = ratingValue;
        }
      } else {
        columnFilters[element.id] = {
          $regex: escapeRegex(element.value),
          $options: "i",
        };
      }
    });

    // Build global search conditions (for aggregation match after lookups)
    let globalSearchConditions = null;
    if (globalFilters) {
      globalSearchConditions = [
        {
          "productData.name": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        {
          "userData.name": {
            $regex: escapeRegex(globalFilters),
            $options: "i",
          },
        },
        { title: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { review: { $regex: escapeRegex(globalFilters), $options: "i" } },
      ];

      const ratingValue = parseInt(globalFilters, 10);
      if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
        globalSearchConditions.push({ rating: ratingValue });
      }
    }

    // Build base search conditions (for base match before lookups)
    let baseSearchConditions = null;
    if (globalFilters) {
      baseSearchConditions = [
        { title: { $regex: escapeRegex(globalFilters), $options: "i" } },
        { review: { $regex: escapeRegex(globalFilters), $options: "i" } },
      ];

      const ratingValue = parseInt(globalFilters, 10);
      if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
        baseSearchConditions.push({ rating: ratingValue });
      }
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

    let aggregationMatchQuery = {};
    if (aggregationConditions.length > 1) {
      aggregationMatchQuery = { $and: aggregationConditions };
    } else if (aggregationConditions.length === 1) {
      aggregationMatchQuery = aggregationConditions[0];
    }

    // Update baseMatchQuery with global search for count (if needed)
    if (baseSearchConditions) {
      if (Object.keys(baseMatchQuery).length > 0) {
        if (baseMatchQuery.$or) {
          // If baseMatchQuery already has $or, combine with $and
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

    // Aggregate pipeline
    const aggregatePipeline = [];

    // 1. Pre-lookup Match
    if (Object.keys(baseMatchQuery).length > 0) {
      aggregatePipeline.push({ $match: baseMatchQuery });
    }

    // 2. Lookups
    aggregatePipeline.push(
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
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
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      }
    );

    // 3. Post-lookup Match
    const postLookupConditions = [];

    if (globalSearchConditions) {
      postLookupConditions.push({ $or: globalSearchConditions });
    }
    if (Object.keys(columnFilters).length > 0) {
      postLookupConditions.push(columnFilters);
    }

    if (postLookupConditions.length > 0) {
      aggregatePipeline.push({
        $match:
          postLookupConditions.length > 1
            ? { $and: postLookupConditions }
            : postLookupConditions[0],
      });
    }

    // 4. Sort, Skip, Limit, Project
    aggregatePipeline.push(
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
      }
    );

    // Execute query
    const getReviews = await ReviewModel.aggregate(aggregatePipeline);

    // Get TotalRowCount
    const countPipeline = [];

    // 1. Pre-lookup Match
    if (Object.keys(baseMatchQuery).length > 0) {
      countPipeline.push({ $match: baseMatchQuery });
    }

    // 2. Lookups (Needed if filters rely on them)
    const needsLookupsForCount =
      globalSearchConditions || Object.keys(columnFilters).length > 0;

    if (needsLookupsForCount) {
      countPipeline.push(
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $unwind: { path: "$productData", preserveNullAndEmptyArrays: true },
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
          $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
        }
      );
    }

    // 3. Post-lookup Match
    if (needsLookupsForCount && postLookupConditions.length > 0) {
      countPipeline.push({
        $match:
          postLookupConditions.length > 1
            ? { $and: postLookupConditions }
            : postLookupConditions[0],
      });
    }

    countPipeline.push({ $count: "total" });

    const countResult = await ReviewModel.aggregate(countPipeline);
    const totalRowCount = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: getReviews,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
