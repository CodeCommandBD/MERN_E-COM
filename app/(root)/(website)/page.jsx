import Banner from "@/components/Application/Website/Banner";
import FeaturedProduct from "@/components/Application/Website/FeaturedProduct";
import MainSlider from "@/components/Application/Website/MainSlider";

import React from "react";

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
    </div>
  );
};

export default page;
