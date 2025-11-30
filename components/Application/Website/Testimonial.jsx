"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { sliderFour, sliderOne, sliderThree, sliderTwo } from "@/public/image";
import { LuChevronRight } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { BsChatQuote } from "react-icons/bs";

const testimonial = [
  {
    name: "John Doe",
    review:
      "The application is very user-friendly and easy to navigate. The customer support is also very helpful and responsive.",
    rating: 4.5,
  },
  {
    name: "Sarah Johnson",
    review:
      "Amazing shopping experience! Fast delivery and the product quality exceeded my expectations. Will definitely shop again!",
    rating: 5.0,
  },
  {
    name: "Michael Chen",
    review:
      "Great variety of products at competitive prices. The checkout process was smooth and hassle-free.",
    rating: 4.0,
  },
  {
    name: "Emily Rodriguez",
    review:
      "Love the website design and how easy it is to find what I need. The filter options are really helpful!",
    rating: 4.5,
  },
  {
    name: "David Thompson",
    review:
      "Excellent customer service! They resolved my issue quickly and professionally. Highly recommended!",
    rating: 5.0,
  },
  {
    name: "Priya Sharma",
    review:
      "The product descriptions are accurate and detailed. Got exactly what I ordered. Very satisfied!",
    rating: 4.5,
  },
  {
    name: "James Wilson",
    review:
      "Fast shipping and secure packaging. The tracking system kept me updated throughout the delivery process.",
    rating: 4.0,
  },
  {
    name: "Lisa Anderson",
    review:
      "Best online shopping platform I have used! The deals and discounts are fantastic. Keep up the good work!",
    rating: 5.0,
  },
  {
    name: "Ahmed Hassan",
    review:
      "User-friendly interface with great product selection. The payment process is secure and convenient.",
    rating: 4.5,
  },
  {
    name: "Maria Garcia",
    review:
      "Impressed with the quality and authenticity of products. The return policy is also very fair and transparent.",
    rating: 4.0,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <div className="">
      <h2 className="sm:text-4xl text-2xl font-bold text-center mb-10">
        Customer Reviews
      </h2>
      <Slider {...settings}>
        {testimonial.map((item, index) => {
          return (
            <div key={index} className="px-5">
              <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-gray-50">
                <BsChatQuote size={25} className="text-2xl text-gray-600 mb-2"></BsChatQuote>
                <p className="text-md text-gray-600">{item.review}</p>
                <h2 className="font-bold mb-1 mt-3">{item.name}</h2>
                <div className="flex items-center gap-2">
                  {Array.from({ length: item.rating }, (_, index) => (
                    <span key={index} className="text-yellow-400">
                      <FaStar />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Testimonial;
