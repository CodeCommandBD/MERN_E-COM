"use client";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/public/image";
import {
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/Routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiMinus, HiPlus, HiShoppingCart } from "react-icons/hi";
import { Trash2, ShoppingBag, Tag, Receipt } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  increseQuantity,
  decreseQuantity,
  removeProduct,
} from "@/store/reducer/cartReducer";

const breadcrumb = {
  title: "Shopping Cart",
  links: [{ label: "Cart" }],
};

const Cart = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const cart = useSelector((state) => state.cartStore);
  const dispatch = useDispatch();

  useEffect(() => {
    const cartProduct = cart.products;

    // Subtotal = MRP total (original price)
    const mrpTotal = cartProduct.reduce((total, item) => {
      return total + item.quantity * item.mrp;
    }, 0);

    // Total = Selling Price total (what customer actually pays)
    const sellingPriceTotal = cartProduct.reduce((total, item) => {
      return total + item.quantity * item.sellingPrice;
    }, 0);

    // Discount = difference between MRP and Selling Price
    const discountAmount = mrpTotal - sellingPriceTotal;

    setSubTotal(mrpTotal);
    setTotal(sellingPriceTotal);
    setDiscount(discountAmount);
  }, [cart.products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <WebsiteBreadCrumb props={breadcrumb} />

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
            {/* Cart Items Section */}
            <div className="w-full lg:w-[68%]">
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Shopping Cart ({cart.count}{" "}
                    {cart.count === 1 ? "item" : "items"})
                  </h2>
                </div>

                {/* Cart Items */}
                <div className="divide-y-2 divide-gray-200">
                  {cart.products.map((product) => (
                    <div key={product.variantId} className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <Link
                          href={WEBSITE_PRODUCT_DETAILS(product.url)}
                          className="flex-shrink-0"
                        >
                          <div className="w-32 h-32  bg-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden">
                            <Image
                              src={product.image || imagePlaceholder.src}
                              alt={product.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div className="flex-grow">
                              <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 hover:text-primary line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>

                              <div className="flex flex-wrap gap-3 mb-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                                  <span className="text-xs font-medium text-gray-600">
                                    Color:
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {product.color}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg">
                                  <span className="text-xs font-medium text-gray-600">
                                    Size:
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {product.size}
                                  </span>
                                </div>
                              </div>

                              {/* Price Section */}
                              <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-primary">
                                  {product.sellingPrice.toLocaleString("BD", {
                                    currency: "BDT",
                                    style: "currency",
                                    currencyDisplay: "narrowSymbol",
                                  })}
                                </span>
                                {product.mrp > product.sellingPrice && (
                                  <>
                                    <span className="text-lg text-gray-500 line-through">
                                      {product.mrp.toLocaleString("BD", {
                                        currency: "BDT",
                                        style: "currency",
                                        currencyDisplay: "narrowSymbol",
                                      })}
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md border border-green-300">
                                      {Math.round(
                                        ((product.mrp - product.sellingPrice) /
                                          product.mrp) *
                                          100
                                      )}
                                      % OFF
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Quantity and Actions */}
                              <div className="flex flex-wrap items-center gap-4">
                                {/* Quantity Control */}
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() =>
                                      dispatch(
                                        decreseQuantity({
                                          productId: product.productId,
                                          variantId: product.variantId,
                                        })
                                      )
                                    }
                                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 border-r-2 border-gray-300"
                                  >
                                    <HiMinus className="text-gray-700 text-lg" />
                                  </button>
                                  <input
                                    readOnly
                                    value={product.quantity}
                                    type="number"
                                    className="w-14 h-10 text-center text-base font-bold text-gray-900 outline-none bg-white"
                                  />
                                  <button
                                    onClick={() =>
                                      dispatch(
                                        increseQuantity({
                                          productId: product.productId,
                                          variantId: product.variantId,
                                        })
                                      )
                                    }
                                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 border-l-2 border-gray-300"
                                  >
                                    <HiPlus className="text-gray-700 text-lg" />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-2 border-red-200 rounded-lg font-medium"
                                  onClick={() =>
                                    dispatch(
                                      removeProduct({
                                        productId: product.productId,
                                        variantId: product.variantId,
                                      })
                                    )
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm">Remove</span>
                                </button>
                              </div>

                              {/* Price Breakdown */}
                              <div className="mt-4 flex justify-end">
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 w-full sm:w-auto sm:min-w-[250px]">
                                  <div className="space-y-2">
                                    {/* Total MRP */}
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-600">
                                        MRP:
                                      </span>
                                      <span className="font-semibold text-gray-900">
                                        {(
                                          product.mrp * product.quantity
                                        ).toLocaleString("BD", {
                                          currency: "BDT",
                                          style: "currency",
                                          currencyDisplay: "narrowSymbol",
                                        })}
                                      </span>
                                    </div>

                                    {/* Discount */}
                                    {product.mrp > product.sellingPrice && (
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-600">
                                          Discount:
                                        </span>
                                        <span className="font-semibold text-green-600">
                                          -
                                          {(
                                            (product.mrp -
                                              product.sellingPrice) *
                                            product.quantity
                                          ).toLocaleString("BD", {
                                            currency: "BDT",
                                            style: "currency",
                                            currencyDisplay: "narrowSymbol",
                                          })}
                                        </span>
                                      </div>
                                    )}

                                    {/* Divider */}
                                    <div className="border-t-2 border-gray-300 pt-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">
                                          Sub Total:
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                          {(
                                            product.sellingPrice *
                                            product.quantity
                                          ).toLocaleString("BD", {
                                            currency: "BDT",
                                            style: "currency",
                                            currencyDisplay: "narrowSymbol",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="w-full lg:w-[32%]">
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden sticky top-6">
                {/* Header */}
                <div className="bg-gray-100 px-6 py-4 border-b-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h3>
                </div>

                {/* Summary Details */}
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
                          Total MRP
                        </span>
                      </div>
                      <span className="text-gray-900 font-semibold">
                        {subTotal.toLocaleString("BD", {
                          currency: "BDT",
                          style: "currency",
                          currencyDisplay: "narrowSymbol",
                        })}
                      </span>
                    </div>

                    {/* Discount */}
                    {discount > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Discount
                          </span>
                        </div>
                        <span className="text-green-700 font-semibold">
                          -
                          {discount.toLocaleString("BD", {
                            currency: "BDT",
                            style: "currency",
                            currencyDisplay: "narrowSymbol",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {total.toLocaleString("BD", {
                            currency: "BDT",
                            style: "currency",
                            currencyDisplay: "narrowSymbol",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    {discount > 0 && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-semibold text-center">
                          You're saving{" "}
                          {discount.toLocaleString("BD", {
                            currency: "BDT",
                            style: "currency",
                            currencyDisplay: "narrowSymbol",
                          })}{" "}
                          on this order!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <Button
                    asChild
                    type="button"
                    className="w-full h-12 text-base font-semibold mb-4"
                  >
                    <Link href={WEBSITE_CHECKOUT}>Proceed to Checkout</Link>
                  </Button>

                  {/* Continue Shopping Link */}
                  <Link
                    href={WEBSITE_SHOP}
                    className="block text-center text-primary hover:text-primary/80 font-medium underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
