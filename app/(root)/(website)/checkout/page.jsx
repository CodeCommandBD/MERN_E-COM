"use client";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiShoppingCart } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/Routes/WebsiteRoute";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { useDispatch } from "react-redux";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import Image from "next/image";
import { Receipt } from "lucide-react";
import { Tag } from "lucide-react";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormControl } from "@mui/material";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const Checkout = () => {
  const bredCrumb = {
    title: "Checkout",
    links: [{ label: "Checkout" }],
  };
  const cart = useSelector((state) => state.cartStore);
  const [verfiyCartData, setVerfiyCartData] = useState([]);
  const { data: getVerfiyCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    {
      data: cart.products,
    }
  );
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);

  useEffect(() => {
    if (getVerfiyCartData && getVerfiyCartData.success) {
      const cartData = getVerfiyCartData.data;
      setVerfiyCartData(cartData);
      dispatch(clearCart());

      cartData.forEach((item) => {
        dispatch(addIntoCart(item));
      });
    }
  }, [getVerfiyCartData, dispatch]);

  useEffect(() => {
    const cartProduct = cart.products;

    // Subtotal = MRP total (original price)
    const subTotalAmount = cartProduct.reduce((total, item) => {
      return total + item.quantity * item.mrp;
    }, 0);

    // Selling Price Total = what customer pays before coupon
    const sellingPriceTotal = cartProduct.reduce((total, item) => {
      return total + item.quantity * item.sellingPrice;
    }, 0);

    // Discount = difference between MRP and Selling Price
    const discountAmount = subTotalAmount - sellingPriceTotal;

    setSubTotal(subTotalAmount);
    setDiscount(discountAmount);

    // Calculate total with coupon discount
    const validCouponDiscount = Number(couponDiscountAmount) || 0;
    const totalAmount = sellingPriceTotal - validCouponDiscount;

    setTotal(totalAmount);
  }, [cart.products, couponDiscountAmount]);

  const couponFormSchema = zSchema.pick({
    code: true,
  });
  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const applyCoupon = async (values) => {
    setCouponLoading(true);
    try {
      // Calculate selling price total (before coupon)
      const sellingPriceTotal = cart.products.reduce((total, item) => {
        return total + item.quantity * item.sellingPrice;
      }, 0);

      console.log("=== Applying Coupon ===");
      console.log("Selling Price Total:", sellingPriceTotal);

      const payload = {
        ...values,
        miniShoppingAmount: sellingPriceTotal,
      };

      console.log("Payload:", payload);

      const { data: response } = await axios.post("/api/coupon/apply", payload);

      console.log("API Response:", response);

      if (!response.success) {
        throw new Error(response.message);
      }

      const discountPercentage = response.data.discountPercent;
      console.log("Discount Percentage:", discountPercentage);

      // Calculate coupon discount on selling price total
      const couponDiscount = (sellingPriceTotal * discountPercentage) / 100;
      console.log("Calculated Coupon Discount:", couponDiscount);

      setCouponDiscountAmount(couponDiscount);
      setIsCouponApplied(true);

      showToast("success", response.message);
    } catch (error) {
      console.error("Coupon Error:", error);
      showToast("error", error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponDiscountAmount(0);
    setIsCouponApplied(false);
    couponForm.reset();
    showToast("info", "Coupon removed");
  };
  return (
    <div>
      <WebsiteBreadCrumb props={bredCrumb} />
      {cart.count === 0 ? (
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-md mx-auto text-center bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <HiShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              type="button"
              asChild
              className="w-full md:w-auto px-8 py-6 text-base"
            >
              <Link href={WEBSITE_SHOP}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-[60%]"></div>
            <div className="w-full lg:w-[40%]">
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden sticky top-6">
                {/* Header */}
                <div className="bg-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h3>
                </div>
                {verfiyCartData &&
                  verfiyCartData?.map((item) => (
                    <div key={item.variantId}>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.image}
                            alt={item.variantId}
                            width={100}
                            height={100}
                            className="w-20 h-20 object-cover rounded-lg"
                          ></Image>
                          <div>
                            <Link href={WEBSITE_PRODUCT_DETAILS(item.url)}>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600">
                              Color: {item.color}
                            </p>
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-md font-semibold text-gray-900">
                            {item.quantity} X ৳{item.sellingPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <span className="text-gray-700 font-medium ">
                      Subtotal ({cart.count} items)
                    </span>
                    {/* Total MRP */}
                    <div className="flex justify-between items-center mt-5">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">
                          MRP
                        </span>
                      </div>
                      <span className="text-gray-900 font-semibold">
                        ৳{subTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Discount */}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Discount
                        </span>
                      </div>
                      <span className="text-green-700 font-semibold">
                        -৳{discount.toFixed(2)}
                      </span>
                    </div>

                    {/* Coupon Discount */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Coupon Discount
                        </span>
                      </div>
                      <span className="text-green-700 font-semibold">
                        -৳{(Number(couponDiscountAmount) || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ৳{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* coupon code*/}
                    {!isCouponApplied ? (
                      <Form {...couponForm}>
                        <form
                          className="flex justify-between items-center gap-2"
                          onSubmit={couponForm.handleSubmit(applyCoupon)}
                        >
                          <div className="w-[calc(100%-100px)] ">
                            <FormField
                              control={couponForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter coupon code"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormMessage></FormMessage>
                                </FormItem>
                              )}
                            ></FormField>
                          </div>
                          <ButtonLoading
                            type="submit"
                            text="Apply Coupon"
                            className={"w-fit"}
                            loading={couponLoading}
                          />
                        </form>
                      </Form>
                    ) : (
                      <div className="flex justify-between items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Coupon Applied
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
