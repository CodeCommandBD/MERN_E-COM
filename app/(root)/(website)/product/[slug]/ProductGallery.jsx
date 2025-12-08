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
    }
  }, [media, activeColor]);

  const handleThumbClick = useCallback((thumb) => {
    setActiveThumb(thumb);
  }, []);

  if (!media || media.length === 0) return null;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 lg:sticky lg:top-24 w-full">
      {/* Thumbnail Images */}
      {/* Mobile: Horizontal Scroll bottom, Desktop: Vertical Scroll left */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:w-24 shrink-0 pb-2 lg:pb-0 scrollbar-hide max-h-[500px]">
        {media.map((item, index) => (
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
