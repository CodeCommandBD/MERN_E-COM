
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import searchData from "@/lib/search";

const options = {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3,
}

const SearchModel = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const fuse = new Fuse(searchData, options)
  useEffect(() => {
    if(query.trim() === ''){
        setResult([]);
        return;
    }
    const res = fuse.search(query)
    setResult(res.map((i) => i.item))
  }, [query]);

  const searchHandler = () => {
    setOpen(false);
    setQuery('');
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Search</DialogTitle>
            <DialogDescription>
              Find and navigate to any admin section instantly. Type a keyword
              to search.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search..."
          />

          <ul className="mt-4 max-h-60 overflow-y-auto">
            {
                result.map((item) => (
                    <li key={item.url} className="py-2 px-3 rounded hover:bg-muted cursor-pointer duration-300">
                        <Link href={item.url} className="block "
                            onClick={searchHandler}
                        >
                            <h4 className="font-medium">{item.label}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </Link>
                    </li>
                ))
            }
            {
                result.length === 0 && (
                    <li className="py-2 px-3">
                        <p className="text-sm text-muted-foreground">No results found</p>
                    </li>
                )
            }
          </ul>

        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SearchModel;
