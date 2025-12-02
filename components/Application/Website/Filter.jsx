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
    <div>
      {searchParams.size > 0 && (
        <Button
          type="button"
          asChild
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          variant={"destructive"}
        >
          <Link href={WEBSITE_SHOP} className="text-white">
            Clear Filter
          </Link>
        </Button>
      )}
      <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
        <AccordionItem value="1">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto ">
              <ul className="flex flex-col gap-2">
                {categoryData &&
                  categoryData.success &&
                  categoryData.data?.map((category) => (
                    <li key={category._id}>
                      <label
                        htmlFor={category._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          id={category._id}
                          onCheckedChange={() =>
                            handleCategoryChange(category.slug)
                          }
                          checked={selectedCategory.includes(category.slug)}
                        />
                        {category.name}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Colors
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul className="flex flex-col gap-2">
                {colorsData &&
                  colorsData.success &&
                  colorsData.data?.map((color) => (
                    <li key={color}>
                      <label
                        htmlFor={color}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          id={color}
                          onCheckedChange={() => handleColorsChange(color)}
                          checked={selectedColors.includes(color)}
                        />
                        {color}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Sizes
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul className="flex flex-col gap-2">
                {sizesData &&
                  sizesData.success &&
                  sizesData.data?.map((size) => (
                    <li key={size}>
                      <label
                        htmlFor={size}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          id={size}
                          onCheckedChange={() => handleSizesChange(size)}
                          checked={selectedSizes.includes(size)}
                        />
                        {size}
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto p-4">
              <ul className="flex flex-col gap-2">
                <li>
                  <Slider
                    defaultValue={[0, 3000]}
                    max={3000}
                    step={1}
                    onValueChange={handlePriceRange}
                  />
                  <div className="flex justify-between items-center pt-2">
                    <span>
                      {priceRange?.min?.toLocaleString("BD", {
                        currency: "BDT",
                        style: "currency",
                        currencyDisplay: "narrowSymbol",
                      })}
                    </span>
                    <span>
                      {priceRange?.max?.toLocaleString("BD", {
                        currency: "BDT",
                        style: "currency",
                        currencyDisplay: "narrowSymbol",
                      })}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <ButtonLoading
                type="button"
                text={"Filter Price"}
                onClick={handlePriceChange}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
              ></ButtonLoading>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
