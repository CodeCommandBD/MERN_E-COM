"use client";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import React, { useState } from "react";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import Filter from "@/components/Application/Website/Filter";
import Sorting from "@/components/Application/Website/Sorting";
import ProductBox from "@/components/Application/Website/ProductBox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSize";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ButtonLoading } from "@/components/Application/ButtonLoading";

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
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("asc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const windowSize = useWindowSize();

  const fetchProducts = async (pageParam) => {
    try {
      const url = `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams.toString()}`;
      console.log("Fetching URL:", url);

      const response = await axios.get(url);
      const getProduct = response.data;

      console.log("API Response:", getProduct);

      if (!getProduct.success) {
        return { products: [], nextpage: null };
      }

      // Handle both nested data structure (from helper) and potential flat structure
      const responseData = getProduct.data || getProduct;
      const products = responseData.products || [];
      const nextpage = responseData.nextpage;

      console.log("Extracted products length:", products.length);

      return {
        products,
        nextpage,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], nextpage: null };
    }
  };

  const { error, data, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["products", limit, sorting, searchParams.toString()],
      queryFn: ({ pageParam = 0 }) => fetchProducts(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.nextpage !== null && lastPage?.nextpage !== undefined) {
          return lastPage.nextpage;
        }
        // return undefined;
      },
    });

  // Flatten all pages into a single products array and filter out any undefined/null values
  const allProducts =
    data?.pages?.flatMap((page) => page?.products || []).filter(Boolean) || [];

  // Debug logging
  console.log("Query data:", data);
  console.log("All products:", allProducts);

  return (
    <div>
      <WebsiteBreadCrumb props={breadcrumb} />
      <section className="lg:flex lg:px-32 my-20">
        {windowSize.width > 1024 ? (
          <div className="w-72 me-4">
            <div className="sticky top-20 bg-gray-50 p-4 rounded">
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

          {isFetching && allProducts.length === 0 && (
            <div className="text-center py-10">Loading products...</div>
          )}

          {!isFetching && allProducts.length === 0 && (
            <div className="text-center py-10">No products found</div>
          )}

          {error && (
            <div className="text-center py-10 text-red-600">
              Error loading products. Please try again.
            </div>
          )}

          {allProducts.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 lg:gap-10 gap-5 mt-6">
              {allProducts.map((product) => (
                <ProductBox key={product._id} product={product} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="text-center mt-8">
              <ButtonLoading
                type={"button"}
                loading={isFetching}
                text="Load More"
                onClick={() => fetchNextPage()}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
