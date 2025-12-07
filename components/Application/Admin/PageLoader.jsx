"use client";
import React from "react";
import { loader } from "@/public/image";
import Image from "next/image";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Image
          src={loader.src}
          height={80}
          width={80}
          alt="loader"
          className="mx-auto mb-4"
          suppressHydrationWarning={true}
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;

