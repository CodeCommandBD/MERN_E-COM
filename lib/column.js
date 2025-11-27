import { AvatarImage } from "@/components/ui/avatar";
import { Avatar, Chip } from "@mui/material";
import dayjs from "dayjs";

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
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ row }) => {
      const validityDate = dayjs(row.original.validity);
      const isExpired = dayjs().isAfter(validityDate);
      const formattedDate = validityDate.format("MMM DD, YYYY");

      return isExpired ? (
        <Chip color="error" label={formattedDate} />
      ) : (
        <Chip color="success" label={formattedDate} />
      );
    },
  },
];

export const DT_CUSTOMER_COLUMN = [
   
  {accessorKey: "avatar", header: "Avatar",
    Cell: ({ row }) => {
      <Avatar>
        <AvatarImage src={row?.original?.avatar?.url || userIcon} />
      </Avatar>   
      
    },
  },
  {accessorKey: "name", header: "Name"},
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "Address", header: "Address" },
  { accessorKey: "IsEmailVerified", header: "Is Email Verified",
    Cell: ({ row }) => {
      return row.original.IsEmailVerified ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      );
    },
   },
   

];

