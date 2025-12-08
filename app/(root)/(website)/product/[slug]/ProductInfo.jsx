import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { WEBSITE_PRODUCT_DETAILS } from "@/Routes/WebsiteRoute";

const ProductInfo = ({
  product,
  variant,
  Color,
  Size,
  reviewCount,
  sanitizedDescription,
}) => {
  return (
    <div className="w-full">
      {/* Product Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating Section */}
      <div className="flex items-center gap-2 mb-6 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200 w-fit">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="text-yellow-500 w-5 h-5 fill-yellow-500"
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          ({reviewCount} Reviews)
        </span>
      </div>

      {/* Single Unified Card */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-6 w-full">
        {/* Price Section */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-green-600">
              {product.sellingPrice.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {product.mrp.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
            <div>
              <div className="bg-green-600 text-white px-4 py-1 rounded-xl font-bold text-sm">
                Save{" "}
                {(product.mrp - product.sellingPrice).toLocaleString("BD", {
                  currency: "BDT",
                  style: "currency",
                  currencyDisplay: "narrowSymbol",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Description Preview */}
        <div className="p-4 lg:p-6 bg-gray-50">
          <div
            className="text-gray-700 leading-relaxed text-sm line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: sanitizedDescription,
            }}
          ></div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Color Selection */}
        <div className="p-4 lg:p-6">
          <p className="text-base font-bold mb-3">
            <span className="text-gray-900">Color: </span>
            <span className="text-gray-600">{variant?.color}</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {Color.map((item, index) => (
              <Link
                href={`${WEBSITE_PRODUCT_DETAILS(
                  product.slug
                )}?color=${item}&size=${variant?.size}`}
                key={index}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
                  item === variant?.color
                    ? "bg-primary !text-white border-primary"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Size Selection */}
        <div className="p-4 lg:p-6">
          <p className="text-base font-bold mb-3">
            <span className="text-gray-900">Size: </span>
            <span className="text-gray-600">{variant?.size}</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {Size.map((item, index) => (
              <Link
                href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${
                  variant?.color
                }&size=${item}`}
                key={index}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 ${
                  item === variant?.size
                    ? "bg-primary !text-white border-primary"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
