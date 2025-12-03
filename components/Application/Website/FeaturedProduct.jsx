import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductBox from "./ProductBox";

const FeaturedProduct = async () => {
  const { data: productData } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product`
  );
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
            <IoIosArrowRoundForward size={24} />
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
