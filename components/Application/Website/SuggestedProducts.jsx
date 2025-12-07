"use client";
import React from "react";
import ProductBox from "./ProductBox";
import useFetch from "@/hooks/useFetch";

const SuggestedProducts = ({ currentProductId, categoryId }) => {
  const { data: productsData, isLoading } = useFetch(
    `/api/product/get-featured-product`
  );

  // Filter out the current product and limit to 4 products
  const suggestedProducts =
    productsData?.data
      ?.filter((product) => product._id !== currentProductId)
      ?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900">You may also like</h3>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestedProducts.map((product) => (
            <ProductBox key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedProducts;
