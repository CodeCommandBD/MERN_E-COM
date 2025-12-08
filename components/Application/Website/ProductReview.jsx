"use client";
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useSelector } from "react-redux";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReviewList from "./ReviewList";
import { useQueryClient } from "@tanstack/react-query";
import useFetch from "@/hooks/useFetch";
import SuggestedProducts from "./SuggestedProducts";

const ProductReview = ({ product }) => {
  const queryClient = useQueryClient();
  const auth = useSelector((state) => state.authStore.auth);
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [reviewsCount, setReviewsCount] = useState({});

  const { data: reviewDetails, refetch: refetchReviewDetails } = useFetch(
    `/api/review/details?productId=${product._id}`
  );

  useEffect(() => {
    if (reviewDetails && reviewDetails.success) {
      const reviewData = reviewDetails.data;
      setReviewsCount(reviewData || {});
    }
  }, [reviewDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    product: true,
    userId: true,
    rating: true,
    title: true,
    review: true,
  });
  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: product?._id,
      userId: auth?._id,
      rating: 0,
      title: "",
      review: "",
    },
  });

  useEffect(() => {
    form.setValue("userId", auth?._id);
  }, [auth]);

  const handleReviewSubmit = async (value) => {
    // Check if user is authenticated
    if (!auth || !auth._id) {
      showToast("error", "Please login to submit a review");
      return;
    }

    // Validate rating
    if (!value.rating || value.rating === 0) {
      showToast("error", "Please select a rating");
      return;
    }

    setLoading(true);
    try {
      const { data: response } = await axios.post("/api/review/create", {
        ...value,
        userId: auth._id, // Ensure userId is set from auth
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      form.setValue("rating", 0); // Reset rating
      setIsReview(false); // Close the form
      queryClient.invalidateQueries({
        queryKey: ["reviews", product._id],
      });
      refetchReviewDetails();
      showToast("success", response.message);
    } catch (error) {
      // Better error handling
      const errorMessage =
        error.response?.data?.message || error.response?.status === 403
          ? "You must be logged in to submit a review. Please login and try again."
          : error.message || "Failed to submit review. Please try again.";
      showToast("error", errorMessage);

      // If 403, redirect to login
      if (error.response?.status === 403) {
        setTimeout(() => {
          window.location.href = `${WEBSITE_LOGIN}?callback=${encodeURIComponent(
            window.location.href
          )}`;
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchReview = async (pageParam) => {
    const { data: response } = await axios.get(
      `/api/review/get?productId=${product._id}&page=${pageParam}`
    );

    if (!response.success) {
      return;
    }
    return response.data;
  };

  const { error, data, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["reviews", product._id],
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => await fetchReview(pageParam),
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return lastPage.nextPage;
        }
        return undefined;
      },
    });

  return (
    <div className=" mx-auto">
      {/* Main Reviews Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Ratings & Reviews
          </h2>
        </div>

        {/* Rating Overview Section */}
        <div className="p-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Overall Rating */}
            <div className="lg:col-span-4">
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="mb-3">
                  <span className="text-6xl font-bold text-gray-900">
                    {reviewsCount?.averageRating || "0.0"}
                  </span>
                  <span className="text-2xl text-gray-500">/5</span>
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(reviewsCount?.averageRating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Based on {reviewsCount?.totalReviews || 0} reviews
                </p>
              </div>
            </div>

            {/* Middle: Rating Distribution */}
            <div className="lg:col-span-5">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-medium text-gray-700 w-3">
                        {rating}
                      </span>
                      <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={reviewsCount?.percentage?.[rating] || 0}
                        className="h-2.5"
                        aria-label={`${rating} star ratings`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-[45px] text-right">
                      {reviewsCount?.rating?.[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Write Review Button */}
            <div className="lg:col-span-3 flex lg:justify-end justify-center">
              <Button
                onClick={() => setIsReview(!isReview)}
                type="button"
                className="px-8 py-6 text-base font-semibold w-full lg:w-auto"
              >
                Write a Review
              </Button>
            </div>
          </div>

          {/* Write Review Form */}
          {isReview && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Share Your Experience
                </h3>

                {!auth ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-4">
                      Please login to write a review
                    </p>
                    <Button
                      type="button"
                      asChild
                      className="px-8 py-6 text-base font-semibold"
                    >
                      <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}>
                        Login to Continue
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleReviewSubmit)}
                      className="space-y-6"
                    >
                      {/* Rating Field */}
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900">
                              Your Rating
                            </FormLabel>
                            <FormControl>
                              <div className="py-2 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => field.onChange(star)}
                                    className="focus:outline-none transition-colors"
                                  >
                                    <Star
                                      className={`h-8 w-8 ${
                                        star <= field.value
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300 fill-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Title Field */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900">
                              Review Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Summarize your experience"
                                className="h-12 text-base"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Review Field */}
                      <FormField
                        control={form.control}
                        name="review"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900">
                              Your Review
                            </FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us what you think about this product..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <div className="pt-2">
                        <ButtonLoading
                          loading={loading}
                          type="submit"
                          text="Submit Review"
                          className="px-8 py-6 text-base font-semibold"
                        />
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900">
              All Reviews ({data?.pages[0]?.totalReviews || 0})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data && data.pages.length > 0 ? (
              data.pages.map((page) =>
                page.reviews.map((review) => (
                  <div key={review._id} className="p-6">
                    <ReviewList review={review} />
                  </div>
                ))
              )
            ) : (
              <div className="p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <p className="mt-4 text-gray-500 font-medium">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetching}
                className="w-full py-6 text-base font-semibold"
                variant="outline"
              >
                {isFetching ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Load More Reviews"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Products Section */}
      <div className="mt-8">
        <SuggestedProducts
          currentProductId={product._id}
          categoryId={product.category}
        />
      </div>
    </div>
  );
};

export default ProductReview;
