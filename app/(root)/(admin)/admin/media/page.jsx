"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/Routes/AdminPanelRoute";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import MediaSection from "@/components/Application/Admin/MediaSection";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ConfirmationDialog from "@/components/Application/ConfirmationDialog";
import { MediaSkeletonGrid } from "@/components/Application/Admin/MediaSkeleton";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Media" },
];

const Media = () => {
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [SelectAll, setSelectAll] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDeleteData, setPendingDeleteData] = useState(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && searchParams) {
      const trashOf = searchParams.get("trashof");
      setSelectedMedia([]);
      if (trashOf) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);

  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );
    console.log(response);

    return response;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["delete-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  const deleteMutation = useDeleteMutation("delete-data", "/api/media/delete");

  const handleDelete = (selectedMedia, deleteType) => {
    if (deleteType === "PD") {
      // Show confirmation dialog for permanent deletion
      setPendingDeleteData({ ids: selectedMedia, deleteType });
      setShowConfirmDialog(true);
    } else {
      // Direct deletion for soft delete
      deleteMutation.mutate({ ids: selectedMedia, deleteType });
      setSelectAll(false);
      setSelectedMedia([]);
    }
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteData) {
      await deleteMutation.mutateAsync(pendingDeleteData);
      setSelectAll(false);
      setSelectedMedia([]);
    }
    setPendingDeleteData(null);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteData(null);
    setShowConfirmDialog(false);
  };
  const handleSelectAll = () => {
    setSelectAll(!SelectAll);
  };
  useEffect(() => {
    if (SelectAll) {
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((media) => media._id)
      );
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [SelectAll]);
  return (
    <div suppressHydrationWarning={true}>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card
        className="py-0 rounded shadow-sm border"
        suppressHydrationWarning={true}
      >
        <CardHeader
          className="pt-3 px-3 pb-1"
          style={{ borderBottom: "1px solid #e5e7eb" }}
          suppressHydrationWarning={true}
        >
          <div
            className="flex justify-between items-center"
            suppressHydrationWarning={true}
          >
            <h4
              className="font-semibold text-xl uppercase"
              suppressHydrationWarning={true}
            >
              {deleteType === "SD" ? "Media" : "Media Trash"}
            </h4>
            <div
              className="flex items-center gap-5"
              suppressHydrationWarning={true}
            >
              {deleteType === "SD" && <UploadMedia></UploadMedia>}

              <div className="flex gap-3" suppressHydrationWarning={true}>
                {deleteType === "SD" ? (
                  <Button
                    asChild
                    variant={"destructive"}
                    suppressHydrationWarning={true}
                  >
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                ) : (
                  <Button asChild suppressHydrationWarning={true}>
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className={"py-5"} suppressHydrationWarning={true}>
          {selectedMedia.length > 0 && (
            <div
              className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center"
              suppressHydrationWarning={true}
            >
              <Label suppressHydrationWarning={true}>
                <Checkbox
                  checked={SelectAll}
                  onCheckedChange={handleSelectAll}
                  className={"border-primary"}
                  suppressHydrationWarning={true}
                ></Checkbox>
                Select All
              </Label>
              <div className="flex gap-2" suppressHydrationWarning={true}>
                {deleteType === "SD" ? (
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                    suppressHydrationWarning={true}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className={"bg-green-500 hover:bg-green-600"}
                      onClick={() => handleDelete(selectedMedia, "RSD")}
                      suppressHydrationWarning={true}
                    >
                      Restore
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                      suppressHydrationWarning={true}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          {status === "pending" ? (
            <MediaSkeletonGrid count={10} />
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : data.pages?.every((page) => page.mediaData?.length === 0) ? (
            <div className="text-center text-gray-500 py-10">
              Data not found
            </div>
          ) : (
            <div
              className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5"
              suppressHydrationWarning={true}
            >
              {data.pages?.map((page, index) => (
                <React.Fragment key={index}>
                  {page.mediaData?.map((mediaItem) => (
                    <MediaSection
                      key={mediaItem._id}
                      className="border rounded p-2"
                      media={mediaItem}
                      handleDelete={handleDelete}
                      deleteType={deleteType}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      onChanged={refetch}
                    ></MediaSection>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Load more button and loading indicator */}
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <ButtonLoading
                type="button"
                loading={isFetching}
                onClick={() => fetchNextPage()}
                className="px-8 cursor-pointer"
                text="Load More Images"
              ></ButtonLoading>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Permanently"
        description="Are you sure you want to delete the selected images permanently? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        confirmToastMessage="Images deleted permanently"
        cancelToastMessage="Deletion cancelled"
      />
    </div>
  );
};

export default Media;
