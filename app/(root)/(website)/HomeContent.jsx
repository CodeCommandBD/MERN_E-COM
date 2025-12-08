import dynamic from "next/dynamic";
import { advertisingBanner } from "@/public/image";
import Image from "next/image";
import { BiSupport } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { TbRosetteDiscountFilled } from "react-icons/tb";
import LazyLoad from "@/components/Common/LazyLoad";

// Loading Skeletons
const MainSliderSkeleton = () => (
  <div className="h-[200px] md:h-[400px] w-full bg-gray-100 animate-pulse" />
);

const BannerSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-2 gap-4">
      <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />
      <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />
    </div>
  </div>
);

const FeaturedProductSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="h-8 w-48 bg-gray-100 animate-pulse rounded mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

const TestimonialSkeleton = () => (
  <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
);

const MainSlider = dynamic(
  () => import("@/components/Application/Website/MainSlider"),
  {
    loading: MainSliderSkeleton,
  }
);

const Banner = dynamic(
  () => import("@/components/Application/Website/Banner"),
  {
    loading: BannerSkeleton,
  }
);

const FeaturedProduct = dynamic(
  () => import("@/components/Application/Website/FeaturedProduct"),
  {
    loading: FeaturedProductSkeleton,
  }
);

const Testimonial = dynamic(
  () => import("@/components/Application/Website/Testimonial"),
  {
    loading: TestimonialSkeleton,
  }
);

const HomeContent = () => {
  const features = [
    {
      icon: GiReturnArrow,
      title: "7-Days Return Policy",
      description: "If not satisfied, return within 7 days for a full refund.",
    },
    {
      icon: FaShippingFast,
      title: "Free Shipping",
      description: "No extra costs, just the price you see.",
    },
    {
      icon: BiSupport,
      title: "24/7 Support",
      description: "24/7 support, always here just for you.",
    },
    {
      icon: TbRosetteDiscountFilled,
      title: "Member Discounts",
      description: "Get exclusive discounts and rewards for being a member.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hidden H1 for accessibility/SEO */}
      <h1 className="sr-only">
        E-Store - Premium Fashion & Clothing | Shop T-shirts, Hoodies, Oversized
      </h1>

      {/* Hero Slider */}
      <section>
        <MainSlider />
      </section>

      {/* Banner Section */}
      <section>
        <Banner />
      </section>

      {/* Featured Products */}
      <section>
        <LazyLoad placeholder={<FeaturedProductSkeleton />}>
          <FeaturedProduct />
        </LazyLoad>
      </section>

      {/* Advertising Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
        <div className="border-2 border-primary/20 rounded-lg overflow-hidden">
          <Image
            src={advertisingBanner}
            alt="advertisingBanner"
            width={advertisingBanner.width}
            height={advertisingBanner.height}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
        <LazyLoad placeholder={<TestimonialSkeleton />}>
          <Testimonial />
        </LazyLoad>
      </section>

      {/* Features Section */}
      <section className="bg-primary/5 py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Why Choose Us
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-foreground/60 text-sm sm:text-base max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-primary/20 rounded-lg p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
