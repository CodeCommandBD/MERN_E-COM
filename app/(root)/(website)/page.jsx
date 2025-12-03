import Banner from "@/components/Application/Website/Banner";
import FeaturedProduct from "@/components/Application/Website/FeaturedProduct";
import MainSlider from "@/components/Application/Website/MainSlider";
import Testimonial from "@/components/Application/Website/Testimonial";
import { advertisingBanner } from "@/public/image";
import Image from "next/image";
import { BiSupport } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

const page = () => {
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
        <FeaturedProduct />
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
        <Testimonial />
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

export default page;
