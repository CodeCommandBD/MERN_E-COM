"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { sliderFour, sliderOne, sliderThree, sliderTwo } from "@/public/image";
import { LuChevronRight } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button
      type="button"
      className="w-14 h-14 flex items-center justify-center absolute right-0 top-1/2 z-10 bg-white rounded-full hover:bg-white/80 transition-all duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      <LuChevronRight />
    </button>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      type="button"
      className="w-14 h-14 flex items-center justify-center absolute left-0 top-1/2 z-10 bg-white rounded-full hover:bg-white/80 transition-all duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      <LuChevronLeft />
    </button>
  );
}

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: false,
          arrows: false,
          nextArrow: "",
          prevArrow: "",
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>
        <div>
          <Image
            src={sliderOne}
            alt="sliderOne"
            width={sliderOne.width}
            height={sliderOne.height}
          />
        </div>
        <div>
          <Image
            src={sliderTwo}
            alt="sliderTwo"
            width={sliderTwo.width}
            height={sliderTwo.height}
          />
        </div>
        <div>
          <Image
            src={sliderThree}
            alt="sliderThree"
            width={sliderThree.width}
            height={sliderThree.height}
          />
        </div>
        <div>
          <Image
            src={sliderFour}
            alt="sliderFour"
            width={sliderFour.width}
            height={sliderFour.height}
          />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlider;
