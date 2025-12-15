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
import { incrementOrderCount, decrementOrderCount, addOrder } from "@/store/reducer/orderReducer";
import Image from "next/image";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { z } from "zod";
import { Tag } from "lucide-react";
import { getOrCreateGuestId } from "@/lib/guestOrderTracking";
import { emitOrderCountChange } from "@/lib/orderEvents";
import { useRouter } from "next/navigation";
const Checkout = () => {
  const bredCrumb = {
    title: "Checkout",
    links: [{ label: "Checkout" }],
  };
  const cart = useSelector((state) => state.cartStore);
  const auth = useSelector((state) => state.authStore.auth);
  const router = useRouter();
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
  const [placingOrder, setPlacingOrder] = useState(false);

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

      const payload = {
        ...values,
        miniShoppingAmount: sellingPriceTotal,
      };

      const { data: response } = await axios.post("/api/coupon/apply", payload);

      if (!response.success) {
        showToast("error", response.message);
        setCouponLoading(false);
        return;
      }

      const discountPercentage = response.data.discountPercent;

      // Calculate coupon discount on selling price total
      const couponDiscount = (sellingPriceTotal * discountPercentage) / 100;

      setCouponDiscountAmount(couponDiscount);
      setIsCouponApplied(true);

      showToast("success", response.message);
    } catch (error) {
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

  // order
  const orderFormSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      paymentMethod: true,
    })
    .extend({
      userId: z.string().optional(),
      orderNote: z.string().optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      landmark: "",
      pincode: "",
      country: "",
      state: "",
      orderNote: "",
      paymentMethod: "",
      userId: auth?._id || "",
    },
  });

  // Update userId when auth becomes available (auth loads asynchronously)
  useEffect(() => {
    if (auth?._id) {
      orderForm.setValue("userId", auth._id);
    }
  }, [auth?._id, orderForm]);

  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    
    // OPTIMISTIC UPDATE: Increment order count immediately for instant UI feedback
    dispatch(incrementOrderCount());
    
    try {
      // PRE-CHECK: Validate stock from verified cart data before proceeding
      if (!verfiyCartData || verfiyCartData.length === 0) {
        showToast("error", "Validating cart... Please try again in a moment.");
        dispatch(decrementOrderCount());
        setPlacingOrder(false);
        return;
      }
      const outOfStock = verfiyCartData.find((v) => (v.stock ?? 0) < v.quantity);
      if (outOfStock) {
        showToast(
          "error",
          `Insufficient stock for ${outOfStock.name} - ${outOfStock.color} - ${outOfStock.size}. Available: ${outOfStock.stock}`
        );
        dispatch(decrementOrderCount());
        setPlacingOrder(false);
        return;
      }
      // Prepare order data - use auth._id directly for reliable userId
      const orderData = {
        userId: auth?._id || formData.userId || null,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        },
        items: cart.products,
        pricing: {
          subtotal: subTotal,
          discount: discount,
          couponDiscount: couponDiscountAmount,
          shippingFee: 0,
          total: total,
        },
        paymentMethod: formData.paymentMethod,
        orderNote: formData.orderNote,
        couponCode: isCouponApplied ? couponForm.getValues("code") : null,
        guestId: typeof window !== 'undefined' ? getOrCreateGuestId() : null,
      };

      // If payment method is card, redirect to Stripe
      if (formData.paymentMethod === "card") {
        const response = await axios.post(
          "/api/stripe/create-checkout-session",
          orderData,
          { withCredentials: true }
        );

        if (response.data.success) {
          // Save guest order to local storage (for both guests and logged-in users to persist on device)
          const guestOrders = JSON.parse(
            localStorage.getItem("guest_orders") || "[]"
          );
          // Check if orderId exists to avoid duplicates
          if (!guestOrders.includes(response.data.data.orderId)) {
            guestOrders.push(response.data.data.orderId);
            localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
          }
          // Redirect to Stripe Checkout
          window.location.href = response.data.data.url;
        } else {
          showToast("error", response.data.message);
          // REVERT optimistic update on failure
          dispatch(decrementOrderCount());
          setPlacingOrder(false);
        }
      } else {
        // For cash and bKash, use regular order creation
        const response = await axios.post("/api/order/create", orderData);
        if (response.data.success) {
          showToast("success", response.data.message);
          
          // Store order in Redux for instant display in My Orders
          dispatch(addOrder(response.data.data.order));

          // Save guest order to local storage (for both guests and logged-in users to persist on device)
          const guestOrders = JSON.parse(
            localStorage.getItem("guest_orders") || "[]"
          );
          // Check if orderId exists to avoid duplicates (though new order ID is unique)
          if (!guestOrders.includes(response.data.data.orderId)) {
            guestOrders.push(response.data.data.orderId);
            localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
          }

          // Clear cart after successful order
          dispatch(clearCart());
          // Emit event to update order count in header instantly
          emitOrderCountChange();
          // Redirect to order tracking page (use router.push to preserve React state)
          router.push(`/my-orders`);
        } else {
          showToast("error", response.data.message);
          // REVERT optimistic update on failure
          dispatch(decrementOrderCount());
          setPlacingOrder(false);
        }
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to place order"
      );
      // REVERT optimistic update on error
      dispatch(decrementOrderCount());
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <WebsiteBreadCrumb props={bredCrumb} />
      {cart.count === 0 ? (
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-md mx-auto text-center bg-white border border-gray-300 rounded-lg p-8 md:p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
              <HiShoppingCart className="w-10 h-10 text-gray-500" />
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
              className="w-full md:w-auto px-8 py-3 text-base bg-primary hover:bg-primary/90 text-white border-0"
            >
              <Link href={WEBSITE_SHOP}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col-reverse lg:flex-row gap-6">
              {/* Left Side - Checkout Form */}
              <div className="w-full lg:w-[58%]">
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-white border-b border-gray-300 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Checkout Information
                    </h2>
                  </div>

                  <Form {...orderForm}>
                    <form onSubmit={orderForm.handleSubmit(placeOrder)}>
                      <div className="p-6">
                        {/* Contact Info Section */}
                        <div className="mb-8">
                          <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            Contact Information
                          </h3>
                          <div className="space-y-4">
                            <FormField
                              control={orderForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name
                                  </label>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder="Enter your full name"
                                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={orderForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      Email Address
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={orderForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      Phone Number
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Info Section */}
                        <div className="mb-8">
                          <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            Shipping Information
                          </h3>
                          <div className="space-y-4">
                            <FormField
                              control={orderForm.control}
                              name="landmark"
                              render={({ field }) => (
                                <FormItem>
                                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Detailed Address
                                  </label>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder="House, Street, Area"
                                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={orderForm.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      Country
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Bangladesh"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={orderForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      State/Division
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Dhaka"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={orderForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      City
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Select City"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={orderForm.control}
                                name="pincode"
                                render={({ field }) => (
                                  <FormItem>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                      Postal Code
                                    </label>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="1200"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={orderForm.control}
                              name="orderNote"
                              render={({ field }) => (
                                <FormItem>
                                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Delivery Note (Optional)
                                  </label>
                                  <FormControl>
                                    <textarea
                                      {...field}
                                      placeholder="Any special instructions for delivery"
                                      rows="2"
                                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Payment Options */}
                        <FormField
                          control={orderForm.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="mb-8">
                              <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Payment Method
                              </h3>
                              <FormControl>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Cash on Delivery */}
                                  <label className="relative cursor-pointer">
                                    <input
                                      type="radio"
                                      {...field}
                                      value="cash"
                                      checked={field.value === "cash"}
                                      onChange={() => field.onChange("cash")}
                                      className="peer sr-only"
                                    />
                                    <div className="border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary/5 rounded-md p-5 text-center transition-all">
                                      <div className="flex justify-center mb-3">
                                        <div className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold">
                                          CASH
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-900 font-semibold mb-1">
                                        Cash on Delivery
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Pay when your order is delivered to your
                                        doorstep
                                      </p>
                                    </div>
                                  </label>

                                  {/* Card Payment */}
                                  <label className="relative cursor-pointer">
                                    <input
                                      type="radio"
                                      {...field}
                                      value="card"
                                      checked={field.value === "card"}
                                      onChange={() => field.onChange("card")}
                                      className="peer sr-only"
                                    />
                                    <div className="border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary/5 rounded-md p-5 text-center transition-all">
                                      <div className="flex justify-center gap-2 mb-3">
                                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                                          <span className="text-white text-[10px] font-bold">
                                            VISA
                                          </span>
                                        </div>
                                        <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center">
                                          <span className="text-white text-[10px] font-bold">
                                            MC
                                          </span>
                                        </div>
                                        <div className="w-8 h-6 bg-blue-400 rounded flex items-center justify-center">
                                          <span className="text-white text-[10px] font-bold">
                                            AMEX
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-900 font-semibold mb-1">
                                        Credit/Debit Card
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Pay securely with credit or debit card
                                        via Stripe
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Order Summary Box */}
                        <div className="mb-6 bg-gray-50 border border-gray-300 rounded-md p-5">
                          <div className="text-center mb-4">
                            <p className="text-sm text-gray-600 mb-1">
                              Total Payable Amount
                            </p>
                            <p className="text-3xl font-bold text-primary">
                              ৳{total.toFixed(0)}
                            </p>
                          </div>
                          <div className="border-t border-gray-300 pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Product Total
                              </span>
                              <span className="text-gray-900 font-medium">
                                ৳{total.toFixed(0)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Shipping Fee
                              </span>
                              <span className="text-green-600 font-medium">
                                Free
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 text-center mt-4 pt-3 border-t border-gray-300">
                            Estimated delivery:{" "}
                            <span className="font-semibold text-gray-700">
                              2-3 business days
                            </span>
                          </p>
                        </div>

                        {/* Proceed Button */}
                        <ButtonLoading
                          type="submit"
                          loading={placingOrder}
                          text="Proceed to Payment"
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-md text-base"
                        />
                      </div>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className="w-full lg:w-[42%]">
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden lg:sticky lg:top-24">
                  {/* Header */}
                  <div className="bg-white border-b border-gray-300 px-6 py-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order Summary
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {cart.count} {cart.count === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {verfiyCartData &&
                      verfiyCartData?.map((item, index) => (
                        <div
                          key={item.variantId}
                          className={`p-4 flex gap-4 ${
                            index !== verfiyCartData.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <Link href={WEBSITE_PRODUCT_DETAILS(item.url)}>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 hover:text-primary line-clamp-2">
                                {item.name}
                              </h4>
                            </Link>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <p>Color: {item.color}</p>
                              <p>Size: {item.size}</p>
                              <p className="font-medium text-gray-900">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ৳{(item.sellingPrice * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-300 p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Subtotal ({cart.count} items)
                        </span>
                        <div className="text-right">
                          <span className="text-gray-400 line-through text-xs mr-2">
                            ৳{subTotal.toFixed(0)}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            ৳
                            {(
                              subTotal -
                              discount -
                              couponDiscountAmount
                            ).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700 font-medium">
                            Product Discount
                          </span>
                          <span className="text-green-700 font-semibold">
                            -৳{discount.toFixed(0)}
                          </span>
                        </div>
                      )}

                      {couponDiscountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700 font-medium">
                            Coupon Discount
                          </span>
                          <span className="text-green-700 font-semibold">
                            -৳{couponDiscountAmount.toFixed(0)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600 font-semibold">
                          Free
                        </span>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-300 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ৳{total.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    {!isCouponApplied ? (
                      <Form {...couponForm}>
                        <form
                          className="flex gap-2"
                          onSubmit={couponForm.handleSubmit(applyCoupon)}
                        >
                          <div className="flex-1">
                            <FormField
                              control={couponForm.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter coupon code"
                                      className="h-10 border-gray-300 focus:border-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <ButtonLoading
                            type="submit"
                            text="Apply"
                            className="h-10 px-6 bg-primary hover:bg-primary/90"
                            loading={couponLoading}
                          />
                        </form>
                      </Form>
                    ) : (
                      <div className="flex justify-between items-center p-3 bg-green-50 border border-green-300 rounded-md">
                        <span className="text-green-700 font-medium text-sm">
                          Coupon Applied
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
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
