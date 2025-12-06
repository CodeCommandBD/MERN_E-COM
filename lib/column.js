import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userIcon } from "@/public/image";
import { Chip } from "@mui/material";
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
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row?.original?.avatar?.url || userIcon.src} />
      </Avatar>
    ),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "isEmailVerified",
    header: "Is Email Verified",
    Cell: ({ row }) => {
      return row.original.isEmailVerified ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      );
    },
  },
];

export const DT_REVIEW_COLUMN = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "review", header: "Review" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "user", header: "User" },
];

export const DT_ORDER_COLUMN = [
  { accessorKey: "orderNumber", header: "Order ID" },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    Cell: ({ row }) => row.original.transactionId || "-",
  },
  { accessorKey: "customerInfo.name", header: "Customer" },
  { accessorKey: "customerInfo.email", header: "Email" },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    Cell: ({ row }) => (
      <Chip
        size="small"
        label={row.original.paymentMethod?.toUpperCase() || "CASH"}
        color={row.original.paymentMethod === "card" ? "primary" : "default"}
      />
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    Cell: ({ row }) => {
      const PaymentStatusSelect =
        require("@/components/Application/Admin/PaymentStatusSelect").default;
      return (
        <PaymentStatusSelect
          orderId={row.original._id}
          currentStatus={row.original.paymentStatus}
        />
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    Cell: ({ row }) => {
      const OrderStatusSelect =
        require("@/components/Application/Admin/OrderStatusSelect").default;
      return (
        <OrderStatusSelect
          orderId={row.original._id}
          currentStatus={row.original.orderStatus}
        />
      );
    },
  },
  {
    accessorKey: "pricing.total",
    header: "Total",
    Cell: ({ row }) => `৳${row.original.pricing?.total?.toFixed(0) || 0}`,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    Cell: ({ row }) => dayjs(row.original.createdAt).format("MMM DD, YYYY"),
  },
];
