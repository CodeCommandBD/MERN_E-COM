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
    <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Mobile Filter Button */}
        <Button
          className="lg:hidden bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 w-full sm:w-auto"
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <IoFilter className="w-4 h-4" />
          <span>Show Filters</span>
        </Button>

        {/* Items Per Page */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            Items per page:
          </span>
          <div className="flex gap-2">
            {[9, 18, 27, 36, 45].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLimit(item)}
                className={`
                  w-10 h-10 rounded-lg font-medium text-sm
                  transition-colors duration-200
                  ${
                    item === limit
                      ? "bg-primary text-primary-foreground border-2 border-primary"
                      : "bg-white text-foreground border-2 border-primary/20 hover:border-primary/40"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap hidden sm:block">
            Sort by:
          </span>
          <Select value={sorting} onValueChange={(value) => setSorting(value)}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white border-2 border-primary/20 hover:border-primary/40 focus:border-primary">
              <SelectValue placeholder="Default Sorting" />
            </SelectTrigger>
            <SelectContent>
              {sorts.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Sorting;
