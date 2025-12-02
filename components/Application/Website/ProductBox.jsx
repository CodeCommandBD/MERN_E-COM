import { imagePlaceholder } from "@/public/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/Routes/WebsiteRoute";
const ProductBox = ({ product }) => {
  // Get first media item from array
  const mediaItem = product?.media?.[0];
  const imageSrc = mediaItem?.secure_url || imagePlaceholder;

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer">
    <Link href={WEBSITE_PRODUCT_DETAILS(product?.slug)}>
      <Image
        src={imageSrc}
        alt={mediaItem?.alt || product?.name}
        title={mediaItem?.title || product?.name}
        width={400}
        height={400}
        className="w-full lg:h-[350px] md:h-[250px] h-[200px] object-cover "
      />
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
