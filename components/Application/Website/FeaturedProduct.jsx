"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ProductBox from "./ProductBox";

const FeaturedProduct = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get("/api/product/get-featured-product");
        setProductData(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setProductData({ success: false });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-16">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-full border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="h-[200px] md:h-[250px] lg:h-[350px] bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!productData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-16">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Featured Products
            </h2>
            <div className="w-20 h-1 bg-primary mt-3"></div>
          </div>
          <Link
            href={""}
            className='flex items-center gap-2 transition-all duration-300 hover:text-primary relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100'
          >
            View All
            <ArrowRight size={24} />
          </Link>
        </div>
        <p className="text-foreground/60 text-sm sm:text-base mt-2">
          Discover our handpicked selection of premium products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {!productData.success ? (
          <p className="text-center py-5 col-span-full">Something went wrong</p>
        ) : (
          productData.data.map((product) => (
            <div key={product._id}>
              <ProductBox product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
