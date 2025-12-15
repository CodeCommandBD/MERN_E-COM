import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SearchModel from "./SearchModel";

const AdminSearch = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:w-[350px] w-full dark:text-white">
      <div className="relative flex items-center justify-between">
        <Input
          placeholder="Search....."
          readOnly
          className={"rounded-full coursor-pointer dark:text-white dark:placeholder:text-white dark:bg-card"}
          onClick={() => setOpen(true)}
        />
        <button
          type="button"
          className="absolute right-3 top-3 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <IoIosSearch />
        </button>
      </div>

      <SearchModel open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminSearch;
