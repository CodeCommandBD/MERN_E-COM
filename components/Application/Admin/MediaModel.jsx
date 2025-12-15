import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import {loader} from "@/public/image";
import { useState, useEffect } from "react";
import axios from "axios";
import ModalMediaBlock from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MediaModel = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
  children,
}) => {


  const [previouslySelected, setPreviouslySelected] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMedia = async (pageParam = 0) => {
    const params = new URLSearchParams({
      page: pageParam,
      limit: 100,
      deleteType: "SD"
    });
    
    // Search in filename, public_id, title, alt, and any related product names
    if (debouncedSearchTerm.trim()) {
      params.append("search", debouncedSearchTerm);
    }

    try {
      const { data: response } = await axios.get(
        `/api/media?${params.toString()}`
      );
      console.log("Media fetch response:", {
        searchTerm: debouncedSearchTerm,
        mediaCount: response.mediaData?.length || 0,
        response
      });
      return response;
    } catch (error) {
      console.error("Media fetch error:", error);
      throw error;
    }
  };

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["MediaModel", debouncedSearchTerm],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  const handleClear = () => {
    setSelectedMedia([]);
    setPreviouslySelected([])
    showToast('success', 'Media cleared successfully')
  };
  const handleClose = () => {
    setSelectedMedia(previouslySelected)
    setOpen(false); 
  };
  const handleSelect = () => {
    if(selectedMedia.length <= 0){
      return showToast('error', 'Please select at least one media')
    }
    setPreviouslySelected(selectedMedia)
    setOpen(false);
  };
  return (
    <>
      {children}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent className="p-0">
          <div className="h-[90vh] bg-white dark:bg-gray-800 p-3 flex flex-col">
            <div className="mb-3 pb-3 border-b">
              <DialogTitle className="p-0 text-lg font-semibold mb-3 dark:text-white">
                Media Selection
              </DialogTitle>
              <div className="relative">
                <Input
                  placeholder="Search by product name, filename, or image ID... (e.g., Premium Casual Shirt)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg pl-9"
                />
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              {isPending ? (
                <div className="size-full flex justify-center items-center">
                  <Image
                    src={loader.src}
                    height={80}
                    width={80}
                    alt="loader"
                  ></Image>
                </div>
              ) : isError ? (
                <div className="size-full flex justify-center items-center">
                  <span>{error.message}</span>
                </div>
              ) : data?.pages?.[0]?.mediaData?.length === 0 ? (
                <div className="size-full flex justify-center items-center">
                  <span className="text-gray-500">No images found</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {data.pages?.map((page, index) => (
                      <React.Fragment key={index}>
                        {page?.mediaData?.map((mediaItem) => (
                          <ModalMediaBlock 
                          media={mediaItem} 
                          selectMedia={selectedMedia} 
                          setSelectMedia={setSelectedMedia} 
                          isMultiple={isMultiple}
                          key={mediaItem._id}

                        />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  {hasNextPage && (
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetching}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isFetching ? "Loading..." : "Load More Images"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="h-10 pt-3 border-t flex items-center justify-between">
              <div>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleClear}
                >
                  Clear All
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={handleClose}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSelect}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaModel;
