import { Chip } from "@mui/material";

export const DT_CATEGORY_COLUMN = [
  { accessorKey: "name", header: "category Name" },
  { accessorKey: "slug", header: "Slug" },
];
export const DT_PRODUCT_COLUMN = [
  { accessorKey: "name", header: "Product Name" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "mrp", header: "MRP" },
  { accessorKey: "sellingPrice", header: "Selling Price" },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
];
export const DT_PRODUCT_VARIANT_COLUMN = [
  { accessorKey: "product", header: "Product Name" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "size", header: "Size" },
  { accessorKey: "mrp", header: "MRP" },
  { accessorKey: "sellingPrice", header: "Selling Price" },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
];
export const DT_COUPON_COLUMN = [
  { accessorKey: "code", header: "Coupon Code" },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
  { accessorKey: "miniShoppingAmount", header: "Mini Shopping Amount" },
  { accessorKey: "validity", header: "Validity" , cell: ({ renderCellValue }) =>(new Date() > new Date(renderCellValue) ? <Chip color="error" label={renderCellValue}></Chip>: <Chip color="success" label={renderCellValue}></Chip>)},
];
