"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
      "Amazing shopping experience! Fast delivery and the product quality exceeded my expectations.",
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
];

const Testimonial = () => {
  return (
    <div className="py-8 md:py-12 px-4 md:px-6 lg:px-16 bg-white">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
        Customer Review
      </h2>
      <div className="testimonial-slider max-w-6xl mx-auto pb-12">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          speed={500}
          breakpoints={{
            768: { slidesPerView: 1, spaceBetween: 20 },
            1024: { slidesPerView: 2, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {testimonial.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="pb-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-7 mx-auto max-w-lg h-full">
                  <div className="mb-5">
                    <BsChatQuote size={32} className="text-gray-800" />
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 min-h-[100px]">
                    {item.review}
                  </p>
                  <div className="pt-2">
                    <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {Array.from(
                        { length: Math.floor(item.rating) },
                        (_, i) => (
                          <span key={i} className="text-yellow-400">
                            <FaStar size={16} />
                          </span>
                        )
                      )}
                      {item.rating % 1 !== 0 && (
                        <span className="text-yellow-400">
                          <FaStar size={16} className="opacity-50" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonial-slider .swiper-pagination {
          bottom: 0;
        }
        .testimonial-slider .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
        }
        .testimonial-slider .swiper-pagination-bullet-active {
          background: #000;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;
