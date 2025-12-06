import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ReviewModel from "@/Models/Review.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const getReviews = await ReviewModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    if (!getReviews) {
      return res(false, 404, "Collection empty.");
    }

    return res(true, 200, "Reviews found.", getReviews);
  } catch (error) {
    return catchError(error);
  }
}
