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

const LatestReview = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={"font-semibold"}>Product</TableHead>
          <TableHead className={"font-semibold"}>Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={imagePlaceholder.src || imagePlaceholder}
                    alt="Product"
                  />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <span>Lorem ipsum dolor sit amet.</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="text-yellow-500">
                    <IoStar />
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestReview;
