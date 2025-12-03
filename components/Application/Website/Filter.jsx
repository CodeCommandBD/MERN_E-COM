"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ButtonLoading } from "../ButtonLoading";
import { useSearchParams, useRouter } from "next/navigation";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Filter = () => {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorsData } = useFetch("/api/product-variant/colors");
  const { data: sizesData } = useFetch("/api/product-variant/sizes");

  const handlePriceRange = (value) => {
    setPriceRange({ min: value[0], max: value[1] });
  };

  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const handleCategoryChange = (categorySlug) => {
    let newSelectedCategory = [...selectedCategory];
    if (newSelectedCategory.includes(categorySlug)) {
      newSelectedCategory = newSelectedCategory.filter(
        (category) => category !== categorySlug
      );
    } else {
      newSelectedCategory.push(categorySlug);
    }
    setSelectedCategory(newSelectedCategory);

    newSelectedCategory.length > 0
      ? urlSearchParams.set("category", newSelectedCategory.join(","))
      : urlSearchParams.delete("category");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };
  const handleColorsChange = (color) => {
    let newSelectedColors = [...selectedColors];
    if (newSelectedColors.includes(color)) {
      newSelectedColors = newSelectedColors.filter((c) => c !== color);
    } else {
      newSelectedColors.push(color);
    }
    setSelectedColors(newSelectedColors);

    newSelectedColors.length > 0
      ? urlSearchParams.set("color", newSelectedColors.join(","))
      : urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleSizesChange = (size) => {
    let newSelectedSizes = [...selectedSizes];
    if (newSelectedSizes.includes(size)) {
      newSelectedSizes = newSelectedSizes.filter((s) => s !== size);
    } else {
      newSelectedSizes.push(size);
    }
    setSelectedSizes(newSelectedSizes);

    newSelectedSizes.length > 0
      ? urlSearchParams.set("size", newSelectedSizes.join(","))
      : urlSearchParams.delete("size");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  useEffect(() => {
    searchParams.get("category")
      ? setSelectedCategory(searchParams.get("category").split(","))
      : setSelectedCategory([]);
    searchParams.get("color")
      ? setSelectedColors(searchParams.get("color").split(","))
      : setSelectedColors([]);
    searchParams.get("size")
      ? setSelectedSizes(searchParams.get("size").split(","))
      : setSelectedSizes([]);

    // Handle minPrice and maxPrice as separate parameters
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 10000,
      });
    } else {
      setPriceRange({ min: 0, max: 10000 });
    }
  }, [searchParams]);

  const handlePriceChange = () => {
    // Set minPrice and maxPrice as separate parameters
    if (priceRange.min > 0) {
      urlSearchParams.set("minPrice", priceRange.min);
    } else {
      urlSearchParams.delete("minPrice");
    }

    if (priceRange.max < 10000) {
      urlSearchParams.set("maxPrice", priceRange.max);
    } else {
      urlSearchParams.delete("maxPrice");
    }

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  return (
    <div className="space-y-4">
      {/* Clear Filter Button */}
      {searchParams.size > 0 && (
        <Button
          type="button"
          asChild
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground border-2 border-destructive"
          variant="destructive"
        >
          <Link
            href={WEBSITE_SHOP}
            className="text-destructive-foreground flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All Filters
          </Link>
        </Button>
      )}

      {/* Filter Accordion */}
      <Accordion
        type="multiple"
        defaultValue={["1", "2", "3", "4"]}
        className="space-y-2"
      >
        {/* Category Filter */}
        <AccordionItem
          value="1"
          className="border-2 border-primary/20 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>CATEGORY</span>
              {selectedCategory.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {selectedCategory.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="max-h-48 overflow-auto space-y-2">
              {categoryData &&
                categoryData.success &&
                categoryData.data?.map((category) => (
                  <label
                    key={category._id}
                    htmlFor={category._id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-primary/5 transition-colors"
                  >
                    <Checkbox
                      id={category._id}
                      onCheckedChange={() =>
                        handleCategoryChange(category.slug)
                      }
                      checked={selectedCategory.includes(category.slug)}
                      className="border-2 border-primary/40"
                    />
                    <span className="text-sm text-foreground">
                      {category.name}
                    </span>
                  </label>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Filter */}
        <AccordionItem
          value="2"
          className="border-2 border-primary/20 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span>COLORS</span>
              {selectedColors.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {selectedColors.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="max-h-48 overflow-auto space-y-2">
              {colorsData &&
                colorsData.success &&
                colorsData.data?.map((color) => (
                  <label
                    key={color}
                    htmlFor={color}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-primary/5 transition-colors"
                  >
                    <Checkbox
                      id={color}
                      onCheckedChange={() => handleColorsChange(color)}
                      checked={selectedColors.includes(color)}
                      className="border-2 border-primary/40"
                    />
                    <span className="text-sm text-foreground capitalize">
                      {color}
                    </span>
                  </label>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes Filter */}
        <AccordionItem
          value="3"
          className="border-2 border-primary/20 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <span>SIZES</span>
              {selectedSizes.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {selectedSizes.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="max-h-48 overflow-auto space-y-2">
              {sizesData &&
                sizesData.success &&
                sizesData.data?.map((size) => (
                  <label
                    key={size}
                    htmlFor={size}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-primary/5 transition-colors"
                  >
                    <Checkbox
                      id={size}
                      onCheckedChange={() => handleSizesChange(size)}
                      checked={selectedSizes.includes(size)}
                      className="border-2 border-primary/40"
                    />
                    <span className="text-sm text-foreground uppercase">
                      {size}
                    </span>
                  </label>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem
          value="4"
          className="border-2 border-primary/20 rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>PRICE RANGE</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="pt-2">
                <Slider
                  defaultValue={[0, 3000]}
                  max={3000}
                  step={1}
                  onValueChange={handlePriceRange}
                  className="cursor-pointer"
                />
                <div className="flex justify-between items-center pt-4">
                  <div className="bg-primary/10 px-3 py-2 rounded-md border-2 border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {priceRange?.min?.toLocaleString("BD", {
                        currency: "BDT",
                        style: "currency",
                        currencyDisplay: "narrowSymbol",
                      })}
                    </span>
                  </div>
                  <div className="text-foreground/40">—</div>
                  <div className="bg-primary/10 px-3 py-2 rounded-md border-2 border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {priceRange?.max?.toLocaleString("BD", {
                        currency: "BDT",
                        style: "currency",
                        currencyDisplay: "narrowSymbol",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <ButtonLoading
                type="button"
                text="Apply Price Filter"
                onClick={handlePriceChange}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
