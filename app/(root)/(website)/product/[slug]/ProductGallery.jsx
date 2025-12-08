"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { imagePlaceholder } from "@/public/image";

const ProductGallery = ({ media = [], productName, activeColor }) => {
  const [activeThumb, setActiveThumb] = useState(media[0]?.secure_url || "");

  // Reset active image when color changes (new media passed)
  useEffect(() => {
    if (media && media.length > 0) {
      setActiveThumb(media[0].secure_url);
    } else {
      setActiveThumb("");
    }
  }, [media, activeColor]);

  const handleThumbClick = useCallback((thumb) => {
    setActiveThumb(thumb);
  }, []);

  const displayMedia = media && media.length > 0 ? media : [{ secure_url: "" }];

  if (!displayMedia) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Thumbnail Images */}
      <div className="flex gap-3 p-2 overflow-x-auto w-full shrink-0 pb-2 scrollbar-hide">
        {displayMedia.map((item, index) => (
          <div
            key={index}
            onClick={() => handleThumbClick(item.secure_url)}
            className={`relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden shrink-0 w-16 h-16 lg:w-20 lg:h-20 ${
              item.secure_url === activeThumb
                ? "ring-2 ring-primary scale-105 opacity-100"
                : "ring-1 ring-gray-200 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={item.secure_url || imagePlaceholder.src}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 64px, 80px"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="w-full relative group">
        <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 w-full aspect-[4/5] lg:aspect-square">
          <Image
            src={activeThumb || imagePlaceholder.src}
            alt={productName}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            priority={true}
            sizes="(max-width: 1024px) 100vw, 50vw"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
