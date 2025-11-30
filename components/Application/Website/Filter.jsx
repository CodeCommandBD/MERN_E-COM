"use client";
import useFetch from "@/hooks/useFetch";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ButtonLoading } from "../ButtonLoading";

const Filter = () => {
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 10000 });
  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorsData } = useFetch("/api/product-variant/colors");
  const { data: sizesData } = useFetch("/api/product-variant/sizes");

  const handlePriceRange = (value) => {
    setPriceRange({ min: value[0], max: value[1] });
  };

  return (
    <div>
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
                        <Checkbox id={category._id} />
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
                        <Checkbox id={color} />
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
                        <Checkbox id={size} />
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
                      {priceRange.min.toLocaleString("BD", {
                        currency: "BDT",
                        style: "currency",
                        currencyDisplay: "narrowSymbol",
                      })}
                    </span>
                    <span>
                      {priceRange.max.toLocaleString("BD", {
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
              <ButtonLoading type="button" text={'Filter Price'} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Apply
              </ButtonLoading>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
