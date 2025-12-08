"use server";

import { connectDB } from "@/lib/dbConnection";
import ReviewModel from "@/Models/Review.model";
import UserModel from "@/Models/user.models"; // Ensure User model is registered

export const getTestimonials = async () => {
  try {
    await connectDB();

    // Fetch up to 6 latest active reviews (regardless of rating for now to verify data flow)
    // We prefer 5-star, but if none, show others.
    // Actually, let's try to get high rated ones first.
    const reviews = await ReviewModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    })
      .populate("user", "name avatar")
      .sort({ rating: -1, createdAt: -1 }) // Best ratings first, then newest
      .limit(6)
      .lean();

    // Serialize for Client Component
    if (!reviews || reviews.length === 0) {
      console.log("No testimonials found in DB.");
      return [];
    }

    return reviews.map((review) => ({
      _id: review._id.toString(),
      name: review.user?.name || "Anonymous",
      review: review.review,
      rating: review.rating,
      avatar: review.user?.avatar?.url || null,
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};
