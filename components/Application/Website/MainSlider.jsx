"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { sliderFour, sliderOne, sliderThree, sliderTwo } from "@/public/image";
import { LuChevronRight } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";

const MainSlider = () => {
  const slides = [
    { src: sliderOne, alt: "sliderOne" },
    { src: sliderTwo, alt: "sliderTwo" },
    { src: sliderThree, alt: "sliderThree" },
    { src: sliderFour, alt: "sliderFour" },
  ];

  return (
    <div className="main-slider relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={600}
        breakpoints={{
          0: {
            pagination: {
              enabled: false,
            },
          },
          600: {
            pagination: {
              enabled: true,
            },
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Image
              src={slide.src}
              alt={slide.alt}
              width={slide.src.width}
              height={slide.src.height}
              priority={index === 0}
              className="w-full h-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Clean border design */}
      <button
        type="button"
        className="swiper-button-prev-custom w-12 h-12 hidden sm:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-primary/30 rounded-lg cursor-pointer"
      >
        <LuChevronLeft size={20} className="text-primary" />
      </button>
      <button
        type="button"
        className="swiper-button-next-custom w-12 h-12 hidden sm:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-primary/30 rounded-lg cursor-pointer"
      >
        <LuChevronRight size={20} className="text-primary" />
      </button>

      {/* Custom Pagination Styling */}
      <style jsx global>{`
        .main-slider .swiper-pagination {
          bottom: 20px;
        }

        .main-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #fff;
          opacity: 0.6;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .main-slider .swiper-pagination-bullet-active {
          background: hsl(var(--primary));
          opacity: 1;
          border-color: hsl(var(--primary));
        }

        @media (max-width: 600px) {
          .main-slider .swiper-pagination {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MainSlider;
