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

  // Generate descriptive alt text for SEO
  const altText = mediaItem?.alt || `${product?.name} - Shop at E-Store`;

  // Format price for display
  const formatPrice = (price) => {
    return price?.toLocaleString("BD", {
      currency: "BDT",
      style: "currency",
      currencyDisplay: "narrowSymbol",
    });
  };

  return (
    <article
      className="h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link
        href={WEBSITE_PRODUCT_DETAILS(product?.slug)}
        aria-label={`View ${product?.name} details`}
      >
        <Suspense fallback={<ImageSkeleton />}>
          <Image
            src={imageSrc}
            alt={altText}
            title={mediaItem?.title || product?.name}
            width={400}
            height={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full lg:h-[350px] md:h-[250px] h-[200px] object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=="
            itemProp="image"
          />
        </Suspense>
        <div className="p-3">
          <h2 className="text-lg font-semibold" itemProp="name">
            {product?.name}
          </h2>
          <p
            className="flex items-center gap-2"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <span
              className="line-through text-gray-400"
              aria-label="Original price"
            >
              {formatPrice(product?.mrp)}
            </span>
            <span
              className="text-primary font-semibold"
              itemProp="price"
              content={product?.sellingPrice}
              aria-label="Sale price"
            >
              {formatPrice(product?.sellingPrice)}
            </span>
            <meta itemProp="priceCurrency" content="BDT" />
            <meta
              itemProp="availability"
              content="https://schema.org/InStock"
            />
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductBox;
