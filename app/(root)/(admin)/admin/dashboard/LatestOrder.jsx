import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ADMIN_ORDER_SHOW } from "@/Routes/AdminPanelRoute";

const LatestOrder = ({ data = [] }) => {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Latest Order</h3>
        <Link href={ADMIN_ORDER_SHOW}>
          <Button variant="default" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="p-0 overflow-auto h-[calc(100%-60px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Total Item</TableHead>
              <TableHead>status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((order) => (
                <TableRow key={order._id || order.orderNumber}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {(order.paymentMethod || "CASH").toUpperCase()}
                  </TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell>${order.pricing?.total?.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LatestOrder;
