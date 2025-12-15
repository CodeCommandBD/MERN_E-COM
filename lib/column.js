import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userIcon } from "@/public/image";
import { Badge } from "@/components/ui/badge";
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
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      const stockValue = Number(stock) || 0;

      if (stockValue === 0) {
        return <Badge variant="destructive">Stock Out</Badge>;
      }
      return <span className="font-semibold text-green-600">{stockValue}</span>;
    },
  },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
];
export const DT_COUPON_COLUMN = [
  { accessorKey: "code", header: "Coupon Code" },
  { accessorKey: "discountPercentage", header: "Discount Percentage" },
  { accessorKey: "miniShoppingAmount", header: "Mini Shopping Amount" },
  {
    accessorKey: "validity",
    header: "Validity",
    cell: ({ row }) => {
      const validityDate = dayjs(row.original.validity);
      const isExpired = dayjs().isAfter(validityDate);
      const formattedDate = validityDate.format("MMM DD, YYYY");

      return isExpired ? (
        <Badge variant="destructive">{formattedDate}</Badge>
      ) : (
        <Badge variant="default" className="bg-green-100 text-green-800">{formattedDate}</Badge>
      );
    },
  },
];

export const DT_CUSTOMER_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row?.original?.avatar?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="flex items-center gap-2">
          <span>{row.original.name}</span>
          {role === "admin" && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
              (admin)
            </span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {role === "admin" ? "Admin" : "User"}
        </span>
      );
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Email Verified",
    cell: ({ row }) => {
      return row.original.isEmailVerified ? (
        <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>
      ) : (
        <Badge variant="destructive">Not Verified</Badge>
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
    cell: ({ row }) => row.original.transactionId || "-",
  },
  { accessorKey: "customerInfo.name", header: "Customer" },
  { accessorKey: "customerInfo.email", header: "Email" },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant={row.original.paymentMethod === "card" ? "default" : "secondary"}>
        {row.original.paymentMethod?.toUpperCase() || "CASH"}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
    cell: ({ row }) => `৳${row.original.pricing?.total?.toFixed(0) || 0}`,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => dayjs(row.original.createdAt).format("MMM DD, YYYY"),
  },
];

export const DT_SUPPORT_COLUMN = [
  { accessorKey: "ticketNumber", header: "Ticket" },
  {
    accessorKey: "customerInfo",
    header: "Customer",
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
    cell: ({ row }) => {
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
    cell: ({ row, table }) => {
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
