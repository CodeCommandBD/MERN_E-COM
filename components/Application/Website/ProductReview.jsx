"use client";
import React from "react";
import { IoStar } from "react-icons/io5";
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
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";

const ProductReview = ({ product }) => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

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

  const handleReviewSubmit = async (value) => {
    // TODO: Implement category submission
    setLoading(true);
    try {
      const { data: response } = await axios.post("/api/review/create", {
        ...value,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <div className="mb-10">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-lg">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">
              Rating & Reviews
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between flex-wrap items-center gap-5 ">
              <div>
                <h2 className="md:w-1/2 w-full">{product.rating}</h2>
                <div className="md:flex md:gap-10 md:mb-0 mb-5">
                  <div className="md:w-[400px] w-full md:mb-0 mb-5">
                    <h4 className="font-semibold text-center text-8xl">0.0</h4>
                    <div className="flex justify-center gap-2">
                      <IoStar className="text-yellow-500 text-xl"></IoStar>
                      <IoStar className="text-yellow-500 text-xl"></IoStar>
                      <IoStar className="text-yellow-500 text-xl"></IoStar>
                      <IoStar className="text-yellow-500 text-xl"></IoStar>
                      <IoStar className="text-yellow-500 text-xl"></IoStar>
                    </div>
                    <p className="text-center mt-3">(00 Ratings & Reviews)</p>
                  </div>
                  <div className="md:w-[calc(100%-200px)] flex items-center ">
                    <div className="w-full">
                      {[5, 4, 3, 2, 1].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <div className="flex items-center gap-1">
                            <p className="w-3">{item}</p>
                            <IoStar className=""></IoStar>
                          </div>
                          <Progress value={20} />
                          <span className="text-sm">20</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-fit md:text-end text-center">
                <Button type="button" className="md:w-fit py-6 px-10">
                  Write a Review
                </Button>
              </div>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleReviewSubmit)}
                  className="space-y-8"
                >
                  <p className="text-center text-xl font-semibold">
                    Write a Review
                  </p>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Rating
                              value={field.value}
                              size="large"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Review Title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Write your review here..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-5">
                    <ButtonLoading
                      loading={loading}
                      type={"submit"}
                      text={"Submit Review"}
                      className={"cursor-pointer duration-300"}
                    ></ButtonLoading>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
