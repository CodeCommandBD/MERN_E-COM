import React from "react";
import { bannerOne, bannerTwo } from "@/public/image";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <div className="grid-cols-2 grid  gap-2 md:gap-10">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Link href={"/"} className="block relative group">
            <div className="transition-all duration-300 group-hover:scale-110">
              <Image
                src={bannerOne}
                alt="bannerOne"
                width={bannerOne.width}
                height={bannerOne.height}
              />
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Link href={"/"} className="block relative group">
            <div className="transition-all duration-300 group-hover:scale-110">
              <Image
                src={bannerTwo}
                alt="bannerTwo"
                width={bannerTwo.width}
                height={bannerTwo.height}
              />
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
