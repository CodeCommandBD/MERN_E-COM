import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import {loader} from "@/public/image";
import { useState } from "react";
import axios from "axios";
import ModalMediaBlock from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import React from "react";

const MediaModel = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
  children,
}) => {


  const [previouslySelected, setPreviouslySelected] = useState([])

  const fetchMedia = async (pageParam = 0) => {
    const { data: response } = await axios.get(
      `/api/media?page=${pageParam}&limit=18&deleteType=SD`
    );
    return response;
  };

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["MediaModel"],
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
          <div className="h-[90vh] bg-white p-3">
            <div className="mb-3 pb-3 border-b">
              <DialogTitle className="p-0 text-lg font-semibold">
                Media Selection
              </DialogTitle>
            </div>
            <div className="h-[calc(100%-150px)] overflow-auto py-2">
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
              ) : (
                <>
                  <div className="grid lg:grid-cols-6 grid-cols-3 gap-2">
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
