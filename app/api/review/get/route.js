import { catchError, res } from "@/lib/helper";
import { connectDB } from "@/lib/dbConnection";
import ReviewModel from "@/Models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = searchParams.get("page");
    const limit = 3;
    const skip = page * limit;

    let matchQuery = {
      deleteAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };
    // aggregate pipeline
    const aggregatePipeline = [
      {
        $match: matchQuery,
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
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },

      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 1,
          reviewBy: "$userData.name",
          avatar: "$userData.avatar",
          title: 1,
          review: 1,
          rating: 1,
          createdAt: 1,
        },
      },
      {
        $skip: skip,
      },
    ];

    const reviews = await ReviewModel.aggregate(aggregatePipeline);
    const totalReviews = await ReviewModel.countDocuments(matchQuery);

    // check if more data exists

    let nextPage = null;
    if (reviews.length > limit) {
      nextPage = Number(page) + 1;
      reviews.pop();
    }
    return res(true, 200, "Review data", { reviews, nextPage, totalReviews });
  } catch (error) {
    return catchError(error);
  }
}
