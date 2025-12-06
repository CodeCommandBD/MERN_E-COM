import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ReviewModel from "@/Models/Review.model.js";

export async function GET(request) {
  try {
    // Check authentication
    const auth = await isAuthenticated();
    if (!auth.isAuth) {
      return res(false, 401, "Unauthorized");
    }

    await connectDB();

    // Get reviews by user with product info
    const reviews = await ReviewModel.aggregate([
      {
        $match: {
          user: auth._id,
          deletedAt: null,
        },
      },
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
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          review: 1,
          rating: 1,
          createdAt: 1,
          product: {
            _id: "$productData._id",
            name: "$productData.name",
            image: { $arrayElemAt: ["$productData.images", 0] },
            url: "$productData.url",
          },
        },
      },
    ]);

    return res(true, 200, "Reviews fetched successfully", reviews);
  } catch (error) {
    return catchError(error);
  }
}
