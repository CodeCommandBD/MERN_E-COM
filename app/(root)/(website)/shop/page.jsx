"use client";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import React, { useState, useEffect } from "react";
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
import Loading from "@/components/Application/Loading";

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
  const [isLoading, setIsLoading] = useState(true);
  const windowSize = useWindowSize();

  useEffect(() => {
    // Show loader initially, then hide it after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async (pageParam) => {
    try {
      const url = `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams.toString()}`;

      const response = await axios.get(url);
      const getProduct = response.data;

      if (!getProduct.success) {
        return { products: [], nextpage: null };
      }

      // Handle both nested data structure (from helper) and potential flat structure
      const responseData = getProduct.data || getProduct;
      const products = responseData.products || [];
      const nextpage = responseData.nextpage;

      return {
        products,
        nextpage,
      };
    } catch (error) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />

      {/* SEO H1 - visually hidden but accessible to screen readers and search engines */}
      <h1 className="sr-only">
        Shop All Products - E-Store Fashion Collection
      </h1>

      {/* Main Shop Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:flex lg:gap-8">
          {/* Desktop Filter Sidebar */}
          {windowSize.width > 1024 ? (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="border-2 border-primary/20 rounded-lg overflow-hidden">
                  <div className="bg-primary px-4 py-3">
                    <h2 className="text-lg font-semibold text-primary-foreground">
                      Filters
                    </h2>
                  </div>
                  <div className="bg-white p-4">
                    <Filter />
                  </div>
                </div>
              </div>
            </aside>
          ) : (
            /* Mobile Filter Sheet */
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetContent
                className="block w-[300px] sm:w-[400px]"
                side="left"
              >
                <SheetHeader className="border-b border-primary/20 pb-4">
                  <SheetTitle className="text-primary text-xl">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 h-[calc(100vh-5rem)] overflow-auto">
                  <Filter />
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Products Section */}
          <main className="flex-1 min-w-0">
            {/* Sorting & Controls Bar */}
            <div className="mb-6">
              <Sorting
                limit={limit}
                setLimit={setLimit}
                sorting={sorting}
                setSorting={setSorting}
                mobileFilterOpen={mobileFilterOpen}
                setMobileFilterOpen={setMobileFilterOpen}
              />
            </div>

            {/* Loading State */}
            {isFetching && allProducts.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-lg text-foreground/70">
                    Loading products...
                  </p>
                </div>
              </div>
            )}

            {/* No Products State */}
            {!isFetching && allProducts.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-primary/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-foreground/60">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 border-4 border-destructive/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-destructive mb-2">
                    Error loading products
                  </h3>
                  <p className="text-foreground/60">Please try again later</p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {allProducts.length > 0 && (
              <>
                {/* Products Count */}
                <div className="mb-4">
                  <p className="text-sm text-foreground/60">
                    Showing{" "}
                    <span className="font-semibold text-primary">
                      {allProducts.length}
                    </span>{" "}
                    products
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {allProducts.map((product) => (
                    <ProductBox key={product._id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center mt-10">
                    <ButtonLoading
                      type="button"
                      loading={isFetching}
                      text="Load More Products"
                      onClick={() => fetchNextPage()}
                      className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default Shop;
