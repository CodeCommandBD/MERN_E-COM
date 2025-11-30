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
  if(!productData) return null;
    return (
      <div className="lg:px-32 px-4 sm:py-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="sm:text-4xl text-2xl font-semibold">
            Featured Products
        </h2>
        <Link
          href={""}
          className='flex items-center gap-2 transition-all duration-300 hover:text-primary relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100'
        >
          View All
          <IoIosArrowRoundForward />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-10">
        {!productData.success ? (
          <p className="text-center py-5">Something went wrong</p>
        ) : (
          productData.data.map((product) => (
            <div key={product._id}>
                <ProductBox product={product}/>
            </div>

          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
