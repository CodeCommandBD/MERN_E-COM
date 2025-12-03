import React from "react";
import { bannerOne, bannerTwo } from "@/public/image";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-20 pt-8 pb-10">
      <div className="grid grid-cols-2 gap-2 md:gap-6 lg:gap-8">
        <Link
          href={"/"}
          className="block border-2 border-primary/20 rounded-lg overflow-hidden bg-white"
        >
          <Image
            src={bannerOne}
            alt="bannerOne"
            width={bannerOne.width}
            height={bannerOne.height}
            className="w-full h-auto"
          />
        </Link>
        <Link
          href={"/"}
          className="block border-2 border-primary/20 rounded-lg overflow-hidden bg-white"
        >
          <Image
            src={bannerTwo}
            alt="bannerTwo"
            width={bannerTwo.width}
            height={bannerTwo.height}
            className="w-full h-auto"
          />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
