import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sorts } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";



const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  mobileFilterOpen,
  setMobileFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap bg-gray-50 p-4 gap-2">
    <Button className={'lg:hidden'} type="button" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
        <IoFilter className=""></IoFilter>
        Filter
    </Button>
      <ul className="flex gap-4">
        <li className="font-semibold">Show</li>
        {[9, 18, 27, 36, 45].map((item) => (
          <li
            key={item}
            className="cursor-pointer"
            onClick={() => setLimit(item)}
          >
            <button
              type="button"
              className={` w-8 h-8 ${
                item === limit
                  ? "bg-primary  flex items-center justify-center text-white rounded-full cursor-pointer"
                  : ""
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger   className={"md:w-[180px] w-full bg-white"}>
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          {sorts.map((item,index) => (
            <SelectItem key={index} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;
