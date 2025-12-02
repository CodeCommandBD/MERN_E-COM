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
  return (
    <div>
      <section>
        <MainSlider />
      </section>
      <section>
        <Banner />
      </section>
      <section>
        <FeaturedProduct />
      </section>
      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <Image
          src={advertisingBanner}
          alt="advertisingBanner"
          width={advertisingBanner.width}
          height={advertisingBanner.height}
          className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] object-cover rounded-lg"
        />
      </section>
      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <Testimonial />
      </section>

      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center flex flex-col items-center">
            <p className="flex justify-center  items-center mb-3">
              <GiReturnArrow size={30} />
            </p>
            <span className="text-xl font-semibold">7-Days Return Policy</span>
            <span className="text-gray-600">
              If not satisfied, return within 7 days for a full refund.
            </span>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="flex justify-center  items-center mb-3">
              <FaShippingFast size={30} />
            </p>
            <span className="text-xl font-semibold">Free Shipping</span>
            <span className="text-gray-600">
              No extra costs, just the price you see.
            </span>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="flex justify-center  items-center mb-3">
              <BiSupport size={30} />
            </p>
            <span className="text-xl font-semibold">24/7 Support</span>
            <span className="text-gray-600">
              24/7 support, alway here just for you.
            </span>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="flex justify-center  items-center mb-3">
              <TbRosetteDiscountFilled size={30} />
            </p>
            <span className="text-xl font-semibold">Member Discounts</span>
            <span className="text-gray-600">
              Get exclusive discounts and rewards for being a member.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
