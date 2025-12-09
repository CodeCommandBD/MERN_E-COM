"use client";
import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import {
  sliderOnePc,
  sliderTwoPc,
  sliderThreePc,
  sliderFourPc,
  sliderFivePc,
  sliderSixPc,
  sliderOneMobile,
  sliderTwoMobile,
  sliderThreeMobile,
  sliderFourMobile,
  sliderFiveMobile,
  sliderSixMobile,
} from "@/public/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const MainSlider = () => {
  const slides = [
    {
      desktop: sliderOnePc,
      mobile: sliderOneMobile,
      alt: "New Arrivals at E-Store",
    },
    {
      desktop: sliderTwoPc,
      mobile: sliderTwoMobile,
      alt: "Premium Fashion Collection",
    },
    {
      desktop: sliderThreePc,
      mobile: sliderThreeMobile,
      alt: "Trending Hoodies",
    },
    {
      desktop: sliderFourPc,
      mobile: sliderFourMobile,
      alt: "Oversized T-shirts",
    },
    {
      desktop: sliderFivePc,
      mobile: sliderFiveMobile,
      alt: "Exclusive Deals",
    },
    {
      desktop: sliderSixPc,
      mobile: sliderSixMobile,
      alt: "Shop the Look",
    },
  ];

  return (
    <div className="main-slider relative w-full group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true, dynamicBullets: false }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={800}
        breakpoints={{
          0: { pagination: { enabled: true } },
          768: { pagination: { enabled: true } },
        }}
        className="h-auto w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-auto">
            {/* Desktop Image */}
            <div className="hidden md:block w-full h-auto relative">
              <Image
                src={slide.desktop}
                alt={slide.alt}
                width={1920}
                height={800}
                priority={index === 0}
                placeholder="blur"
                sizes="100vw"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Mobile Image */}
            <div className="block md:hidden w-full h-auto relative">
              <Image
                src={slide.mobile}
                alt={slide.alt}
                width={800}
                height={1000}
                priority={index === 0}
                placeholder="blur"
                sizes="100vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        type="button"
        aria-label="Previous slide"
        className="swiper-button-prev-custom w-10 h-10 md:w-12 md:h-12 flex items-center justify-center absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="swiper-button-next-custom w-10 h-10 md:w-12 md:h-12 flex items-center justify-center absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      <style jsx global>{`
        .main-slider .swiper-pagination {
          bottom: 12px;
        }
        .main-slider .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          margin: 0 4px !important;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .main-slider .swiper-pagination-bullet-active {
          background: #fff;
          width: 24px;
          border-radius: 4px;
        }
        @media (min-width: 768px) {
          .main-slider .swiper-pagination {
            bottom: 24px;
          }
          .main-slider .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            margin: 0 6px !important;
          }
          .main-slider .swiper-pagination-bullet-active {
            width: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(MainSlider);
