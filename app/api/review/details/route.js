import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ReviewModel from "@/Models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return res(false, 404, "Product ID is missing");
    }

    const review = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    // Total review count
    const totalReviews = review.reduce(
      (total, rating) => total + rating.count,
      0
    );

    // Calculate average rating
    const averageRating =
      totalReviews > 0
        ? (
            review.reduce(
              (total, rating) => total + rating._id * rating.count,
              0
            ) / totalReviews
          ).toFixed(1)
        : "0.0";

    const rating = review.reduce((total, rating) => {
      total[rating._id] = rating.count;
      return total;
    }, {});

    const percentage = review.reduce((total, rating) => {
      total[rating._id] = (rating.count / totalReviews) * 100;
      return total;
    }, {});

    return res(true, 200, "Review fetched successfully", {
      review,
      totalReviews,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
