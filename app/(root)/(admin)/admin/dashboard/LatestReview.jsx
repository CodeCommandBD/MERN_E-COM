import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { imagePlaceholder } from "@/public/image";
import { IoStar } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ADMIN_REVIEW_SHOW } from "@/Routes/AdminPanelRoute";

const LatestReview = ({ data = [] }) => {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Latest Review</h3>
        <Link href={ADMIN_REVIEW_SHOW}>
          <Button variant="default" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="p-0 overflow-auto h-[calc(100%-60px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={"font-semibold"}>Product</TableHead>
              <TableHead className={"font-semibold"}>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={
                            review.product?.media?.[0]?.secure_url ||
                            imagePlaceholder.src ||
                            imagePlaceholder
                          }
                          alt="Product"
                        />
                        <AvatarFallback>PR</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="line-clamp-1 font-medium">
                          {review.product?.name || "Unknown Product"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {review.user?.name || "Unknown User"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={
                            index < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        >
                          <IoStar />
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LatestReview;
