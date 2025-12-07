import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import ReviewModel from "@/Models/Review.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized. Please login to submit a review.");
    }
    await connectDB();
    const payload = await request.json();

    const schema = zSchema.pick({
      product: true,
      rating: true,
      title: true,
      review: true,
      userId: true,
    });
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return res(false, 400, "Invalid or missing fields.", validate.error);
    }
    const { product, userId, rating, title, review } = validate.data;
    
    // Validate that userId matches the authenticated user
    if (userId !== auth._id && userId !== auth.userId) {
      return res(false, 403, "You can only submit reviews for your own account.");
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res(false, 400, "Rating must be between 1 and 5.");
    }

    const newReview = new ReviewModel({
      product: product,
      user: auth._id, // Use authenticated user ID from token
      rating: rating,
      title: title,
      review: review,
    });
    await newReview.save();

    return res(true, 200, "Review added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
