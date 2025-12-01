"use client";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import React, { useState } from "react";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import Filter from "@/components/Application/Website/Filter";
import Sorting from "@/components/Application/Website/Sorting";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSize";
const breadcrumb = {
  title: "Shop",
  links: [
    {
      label: "Shop",
      href: WEBSITE_SHOP,
    },
  ],
};

const Shop = () => {
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("asc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const windowSize = useWindowSize();
  return (
    <div>
      <WebsiteBreadCrumb props={breadcrumb} />
      <section className="lg:flex lg:px-32 my-20">
        {windowSize.width > 1024 ? (
          <div className="w-72 me-4">
            <div className="sticky top-0 bg-gray-50 p-4 rounded">
              <Filter></Filter>
            </div>
          </div>
        ) : (
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetContent className=" block" side="left">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="p-4 h-[calc(100vh-4rem)] overflow-auto">
                <Filter></Filter>
              </div>
            </SheetContent>
          </Sheet>
        )}
        <div className="lg:w-[calc(100%-18rem)]">
          <Sorting
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            mobileFilterOpen={mobileFilterOpen}
            setMobileFilterOpen={setMobileFilterOpen}
          ></Sorting>
        </div>
      </section>
    </div>
  );
};

export default Shop;
