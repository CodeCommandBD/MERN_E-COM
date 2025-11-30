import Banner from "@/components/Application/Website/Banner";
import FeaturedProduct from "@/components/Application/Website/FeaturedProduct";
import MainSlider from "@/components/Application/Website/MainSlider";
import Testimonial from "@/components/Application/Website/Testimonial";
import { advertisingBanner } from "@/public/image";
import Image from "next/image";
import { GiReturnArrow } from "react-icons/gi";



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
        <FeaturedProduct/>
      </section>
      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <Image src={advertisingBanner}   alt="advertisingBanner" width={advertisingBanner.width} height={advertisingBanner.height} className="w-full h-[300px] object-cover"/>
      </section>
      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <Testimonial/>
      </section>

      <section className="lg:px-32 px-4 py-5 sm:py-10">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center flex flex-col items-center"> 
            <p className="flex justify-center  items-center mb-3">
              <GiReturnArrow size={30}/></p>
              <span className="text-xl font-semibold">7-Days Return Policy</span>
              <span className="text-gray-600">If not satisfied, return within 7 days for a full refund.</span>
          </div>
          <div className="text-center flex flex-col items-center"> 
            <p className="flex justify-center  items-center mb-3">
              <GiReturnArrow size={30}/></p>
              <span className="text-xl font-semibold">7-Days Return Policy</span>
              <span className="text-gray-600">If not satisfied, return within 7 days for a full refund.</span>
          </div>
          <div className="text-center flex flex-col items-center"> 
            <p className="flex justify-center  items-center mb-3">
              <GiReturnArrow size={30}/></p>
              <span className="text-xl font-semibold">7-Days Return Policy</span>
              <span className="text-gray-600">If not satisfied, return within 7 days for a full refund.</span>
          </div>
          <div className="text-center flex flex-col items-center"> 
            <p className="flex justify-center  items-center mb-3">
              <GiReturnArrow size={30}/></p>
              <span className="text-xl font-semibold">7-Days Return Policy</span>
              <span className="text-gray-600">If not satisfied, return within 7 days for a full refund.</span>
          </div>

        </div>
      </section>

    </div>
  );
};

export default page;
