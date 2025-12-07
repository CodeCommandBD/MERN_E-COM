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

export const DT_SUPPORT_COLUMN = [
  { accessorKey: "ticketNumber", header: "Ticket" },
  {
    accessorKey: "customerInfo",
    header: "Customer",
    Cell: ({ row }) => {
      const customer = row.original.customerInfo;
      return (
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-gray-900">
            {customer?.name || "-"}
          </div>
          {customer?.phone && (
            <div className="text-xs text-gray-500">{customer.phone}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "messages",
    header: "Messages",
    Cell: ({ row }) => {
      const messages = row.original.messages || [];
      const unreadCount = messages.filter(
        (m) => m.sender === "customer" && !m.isRead
      ).length;
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {messages.length} messages
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "lastMessageAt",
    header: "Last Activity",
    Cell: ({ row }) => {
      const date = row.original.lastMessageAt;
      if (!date) return "-";
      return (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}{" "}
          {new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ row, table }) => {
      const SupportStatusSelect =
        require("@/components/Application/Admin/SupportStatusSelect").default;
      return (
        <SupportStatusSelect
          ticketId={row.original._id}
          currentStatus={row.original.status}
          onUpdate={table.options.meta?.onStatusUpdate}
        />
      );
    },
  },
];
