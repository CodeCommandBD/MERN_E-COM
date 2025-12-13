"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/Routes/AdminPanelRoute";
import React, { useEffect, useState } from "react";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModel from "@/components/Application/Admin/MediaModel";
import Image from "next/image";
import PageLoader from "@/components/Application/Admin/PageLoader";
import { useQueryClient } from "@tanstack/react-query";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_SHOW,
    label: "Product",
  },
  {
    href: "",
    label: "Add Product",
  },
];

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryOption, setCategoryOption] = useState([]);
  const [editorKey, setEditorKey] = useState(0);

  const { data: getCategories } = useFetch(
    "/api/category?deleteType=SD&&size=10000"
  );

  // mediamodel state
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategories && getCategories.success) {
      const data = getCategories.data;
      const options = data.map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });
      setCategoryOption(options);
    }
  }, [getCategories]);

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    media: true,
    description: true,
  });
  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      mrp: "",
      category: "",
      sellingPrice: "",
      discountPercentage: "",
      media: [],
    },
  });

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);

  // discount percentage calculate
  useEffect(() => {
    const mrp = form.getValues("mrp");
    const sellingPrice = form.getValues("sellingPrice");

    if (mrp && sellingPrice) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discountPercentage));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  // Sync selectedMedia with form media field
  useEffect(() => {
    const mediaIds = selectedMedia.map((media) => media._id);
    form.setValue("media", mediaIds);
  }, [selectedMedia, form]);

  const queryClient = useQueryClient();

  const onSubmit = async (value) => {
    try {

      setLoading(true);
      const mediaIds = selectedMedia.map((media) => media._id);
      value.media = mediaIds;
      

      console.log("Submitting product:", value);

      const { data: response } = await axios.post("/api/product/create", value);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
      
      // Invalidate the products query to refresh the list with new product
      await queryClient.invalidateQueries({ queryKey: ["product-data"] });
      
      form.reset();
      setEditorKey((prev) => prev + 1);
      setSelectedMedia([]);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (mediaId) => {
    setSelectedMedia(selectedMedia.filter((media) => media._id !== mediaId));
  };

  useEffect(() => {
    // Show loader initially and hide it after component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader message="Loading Add Product..." />;
  }

  return (
    <div>
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
          <h4 className="text-xl font-semibold">Add Product</h4>
        </CardHeader>
        <CardContent className={"py-5"} suppressHydrationWarning={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5 ">
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Product Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Slug"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="00.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Selling Price <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="00.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentage{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            type="number"
                            placeholder="00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mb-5 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Editor
                            key={editorKey}
                            initialData={field.value}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              field.onChange(data);
                              if (data) {
                                form.trigger("description");
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModel
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                >
                  {selectedMedia.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                      {selectedMedia.map((media) => (
                        <div
                          key={media._id}
                          className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          {/* Image Container */}
                          <div className="relative w-full h-full">
                            <Image
                              src={media.url}
                              fill
                              alt="media image"
                              className="object-cover"
                            />
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(media._id)}
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-10"
                            aria-label="Remove image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {/* Image Count Badge (optional) */}
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {media.name || "Image"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    onClick={() => setOpen(true)}
                    className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
                  >
                    <span className="text-center">Upload Image</span>
                  </div>
                </MediaModel>
                {form.formState.errors.media && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.media.message}
                  </p>
                )}
              </div>

              <div className="mt-5 ">
                <ButtonLoading
                  loading={loading}
                  type={"submit"}
                  text={"Add Product"}
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

export default AddProduct;
