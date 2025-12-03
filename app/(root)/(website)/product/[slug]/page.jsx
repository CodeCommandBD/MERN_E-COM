import React from "react";
import ProductDetails from "./ProductDetails";
import axios from "axios";

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { color, size } = await searchParams;

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;
  if (color && size) {
    url += `?color=${color}&size=${size}`;
  }

  try {
    const { data: getProduct } = await axios.get(url);

    return (
      <div>
        <ProductDetails
          product={getProduct.data.products}
          variant={getProduct.data.variant}
          Color={getProduct.data.getColor}
          Size={getProduct.data.getSize}
          reviewCount={getProduct.data.reviewCount}
        />
      </div>
    );
  } catch (error) {
    if (error.response?.status === 404) {
      return (
        <div className="flex items-center justify-center h-screen text-4xl font-bold text-red-500">
          Product not found
        </div>
      );
    }
    return <div>Something went wrong</div>;
  }
};

export default ProductPage;
