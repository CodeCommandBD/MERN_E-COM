import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sizes = [
  {
    value: "S",
    label: "S",
  },
  {
    value: "M",
    label: "M",
  },
  {
    value: "L",
    label: "L",
  },
  {
    value: "XL",
    label: "XL",
  },
  {
    value: "XXL",
    label: "XXL",
  },
  {
    value: "XXXL",
    label: "XXXL",
  },
];

export const sorts = [
  {
    value: "default",
    label: "Default Sorting",
  },
  {
    value: "asc",
    label: "Ascending Order",
  },
  {
    value: "desc",
    label: "Descending Order",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
];