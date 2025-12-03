import { userIcon } from "@/public/image";
import Image from "next/image";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

dayjs.extend(relativeTime);

const ReviewList = ({ review }) => {
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-400" />);
    }

    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={review?.avatar?.url || userIcon.src}
              width={56}
              height={56}
              alt="avatar"
              className="rounded-full object-cover border-2 border-gray-100"
            />
            {/* Verified Badge - Optional */}
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* User Info & Rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg leading-tight">
                {review?.reviewBy}
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">
                {dayjs(review?.createdAt).fromNow()}
              </p>
            </div>
            {/* Rating Stars */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {renderStars(review?.rating || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Review Title */}
      <h3 className="font-bold text-gray-900 text-xl mb-3 leading-snug">
        {review?.title}
      </h3>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed text-base">
        {review?.review}
      </p>

      {/* Footer Accent Line */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200">
              {review?.rating?.toFixed(1)} ★
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Verified Purchase
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
