"use client";
import Breadcrumb from "@/components/Application/Breadcrumb";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import { imagePlaceholder } from "@/public/image";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/Routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media",
  },
  {
    href: "",
    label: "Edit Media",
  },
];

const EditPage = ({ params }) => {
  const { id } = use(params);
  const {
    data: mediaData,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch(`/api/media/get/${id}`);
  const [loading, setLoading] = useState(false);

  // Debug logging

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  });
  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (mediaData?.data) {
      form.reset({
        _id: mediaData.data._id || "",
        alt: mediaData.data.alt || "",
        title: mediaData.data.title || "",
      });
    }
  }, [mediaData, form]);

  const onSubmit = async (value) => {
    try {
      setLoading(true);
      const { data: response } = await axios.put("/api/media/update", value);
      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message || "Media updated successfully");
    } catch (error) {
      showToast(
        "error",
        error.message || "Failed to update media. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Breadcrumb data={breadcrumbData} />
      <Card
        className="py-0 rounded shadow-sm border"
        suppressHydrationWarning={true}
      >
        <CardHeader
          className="pt-3 px-3 pb-1"
          style={{ borderBottom: "1px solid #e5e7eb" }}
          suppressHydrationWarning={true}
        >
          <h4 className="text-xl font-semibold">Edit Media</h4>
        </CardHeader>
        <CardContent className={"py-5"} suppressHydrationWarning={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="mb-5">
                {/* Loading state */}
                {fetchLoading && (
                  <div className="w-[200px] h-[200px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Loading...</span>
                  </div>
                )}

                {/* Error state */}
                {fetchError && (
                  <div className="w-[200px] h-[200px] bg-red-100 border-2 border-dashed border-red-300 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-red-500 text-sm">
                        Error loading media
                      </span>
                      <p className="text-xs text-red-400 mt-1">{fetchError}</p>
                    </div>
                  </div>
                )}

                {/* Success state with image */}
                {!fetchLoading && !fetchError && mediaData?.data && (
                  <div className="mb-2">
                    {mediaData.data.secure_url && (
                      <Image
                        src={mediaData.data.secure_url}
                        width={150}
                        height={150}
                        alt={mediaData.data.alt || "image"}
                        priority
                        onError={() => {}}
                        onLoad={() => {}}
                      />
                    )}
                  </div>
                )}

                {/* No data state */}
                {!fetchLoading && !fetchError && !mediaData?.data && (
                  <div className="w-[200px] h-[200px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No media data found</span>
                  </div>
                )}
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter alt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <ButtonLoading
                  loading={loading}
                  type={"submit"}
                  text={"Update Media"}
                  className={"cursor-pointer duration-300"}
                ></ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPage;
