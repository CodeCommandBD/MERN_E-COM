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
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from "@/Routes/AdminPanelRoute";
import React, { use, useEffect, useState } from "react";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: "Coupon",
  },
  {
    href: "",
    label: "Edit Coupon",
  },
];

const EditCoupon = ({ params }) => {
  const { id } = use(params);

  const [coupon, setCoupon] = useState(null);

  const [loading, setLoading] = useState(false);

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    validity: true,
    miniShoppingAmount: true,
  });

  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      code: "",
      discountPercentage: "",
      validity: "",
      miniShoppingAmount: "",
    },
  });

  // Fetch coupon data
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data: response } = await axios.get(`/api/coupon/get/${id}`);
        if (response.success) {
          const couponData = response.data;
          setCoupon(couponData);

          // Format the date to YYYY-MM-DD for the date input
          const formattedDate = couponData.validity
            ? new Date(couponData.validity).toISOString().split("T")[0]
            : "";

          form.reset({
            _id: couponData._id,
            code: couponData.code,
            discountPercentage: couponData.discountPercentage,
            validity: formattedDate,
            miniShoppingAmount: couponData.miniShoppingAmount,
          });
        } else {
          showToast("error", response.message);
        }
      } catch (error) {
        showToast("error", error.message || "Failed to fetch coupon data");
      }
    };

    if (id) {
      fetchCoupon();
    }
  }, [id, form]);

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put("/api/coupon/update", value);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
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
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
        </CardHeader>
        <CardContent className={"py-5"} suppressHydrationWarning={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5 ">
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Coupon Code <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Coupon Code"
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
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount Percentage{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="miniShoppingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Minimum Shopping Amount{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="validity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Validity <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <ButtonLoading
                loading={loading}
                type={"submit"}
                text={"Save Changes"}
                className={"cursor-pointer duration-300"}
              ></ButtonLoading>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;
