import { imagePlaceholder } from "@/public/image";
import Image from "next/image";
import React, { Suspense } from "react";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/Routes/WebsiteRoute";

// Loading skeleton component
const ImageSkeleton = () => (
  <div className="w-full lg:h-[350px] md:h-[250px] h-[200px] bg-gray-200 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
  </div>
);

const ProductBox = ({ product }) => {
  // Get first media item from array
  const mediaItem = product?.media?.[0];
  const imageSrc = mediaItem?.secure_url || imagePlaceholder;

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer">
      <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
        <Suspense fallback={<ImageSkeleton />}>
          <Image
            src={imageSrc}
            alt={mediaItem?.alt || product?.name}
            title={mediaItem?.title || product?.name}
            width={400}
            height={400}
            className="w-full lg:h-[350px] md:h-[250px] h-[200px] object-cover "
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=="
          />
        </Suspense>
        <div className="p-3">
          <h2 className="text-lg font-semibold ">{product?.name}</h2>
          <p className="flex items-center gap-2">
            <span className="line-through text-gray-400">
              {product?.mrp.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
            <span className="text-primary font-semibold ">
              {product?.sellingPrice.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductBox;
