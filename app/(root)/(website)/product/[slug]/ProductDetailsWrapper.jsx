"use client";

import React, { useState, useEffect } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";

const ProductDetailsWrapper = ({
  product,
  variant,
  Color,
  Size,
  reviewCount,
  sanitizedDescription,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when variant changes (new product data loaded)
  useEffect(() => {
    setIsLoading(false);
  }, [variant?._id]);

  return (
    <>
      {/* Visuals (Client Component) */}
      <div className="w-full">
        <ProductGallery
          key={variant?._id || product._id}
          media={variant.media || product.media}
          productName={product.name}
          activeColor={variant.color}
          isLoading={isLoading}
        />
      </div>

      {/* Info (Client Component) */}
      <div className="w-full flex flex-col gap-6">
        <ProductInfo
          product={product}
          variant={variant}
          Color={Color}
          Size={Size}
          reviewCount={reviewCount}
          sanitizedDescription={sanitizedDescription}
          onLoadingChange={setIsLoading}
        />
        {/* Client Actions: Quantity, Add to Cart */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden w-full">
          <ProductActions product={product} variant={variant} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsWrapper;
