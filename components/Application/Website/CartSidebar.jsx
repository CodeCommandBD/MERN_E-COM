"use client";
import React from "react";
import { BsCart2 } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import Image from "next/image";
import { imagePlaceholder } from "@/public/image";
import { useDispatch } from "react-redux";
import { removeProduct } from "@/store/reducer/cartReducer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/Routes/WebsiteRoute";
import { useState, useEffect } from "react";
import { showToast } from "@/lib/showToast";

const CartSidebar = () => {
  const [open, setOpen] = useState(false);
  const cart = useSelector((state) => state.cartStore);
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

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
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="cursor-pointer hover:text-primary transition-colors relative">
            <BsCart2 size={24} className=" " />
            <span className="text-[10px] absolute -top-1 -right-1 bg-primary text-white w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cart.count}
            </span>
          </div>
        </SheetTrigger>
        <SheetContent className="border-l border-border sm:max-w-md w-full p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle className="text-xl font-bold text-primary">
              Shopping Cart
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              You have {cart.products.length} items in your cart
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.count === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                <BsCart2 size={48} className="opacity-20" />
                <p>Your cart is currently empty.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.products.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 border border-border rounded-md overflow-hidden w-24 h-24">
                      <Image
                        src={item?.image || imagePlaceholder.src}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-base line-clamp-2 leading-tight">
                          {item?.name}
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {item?.size} / {item?.color}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="font-semibold text-primary">
                          {item?.sellingPrice.toLocaleString("BD", {
                            currency: "BDT",
                            style: "currency",
                            currencyDisplay: "narrowSymbol",
                          })}
                          <span className="text-muted-foreground text-xs font-normal ml-1">
                            x {item?.quantity}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            dispatch(
                              removeProduct({
                                productId: item.productId,
                                variantId: item.variantId,
                              })
                            )
                          }
                          className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.count > 0 && (
            <div className="p-6 bg-secondary/20 border-t border-border space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">MRP</span>
                  <span className="font-semibold">
                    {subTotal.toLocaleString("BD", {
                      currency: "BDT",
                      style: "currency",
                      currencyDisplay: "narrowSymbol",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-semibold text-green-600">
                    -
                    {discount.toLocaleString("BD", {
                      currency: "BDT",
                      style: "currency",
                      currencyDisplay: "narrowSymbol",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-border/50">
                  <span>Total Amount</span>
                  <span>
                    {total.toLocaleString("BD", {
                      currency: "BDT",
                      style: "currency",
                      currencyDisplay: "narrowSymbol",
                    })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  asChild
                  variant={"outline"}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-none"
                >
                  <Link href={WEBSITE_CART}>View Cart</Link>
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  asChild
                  className="w-full bg-primary text-white hover:bg-primary/90 transition-colors rounded-none shadow-none"
                >
                  {cart.count ? (
                    <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => showToast("Please add some items to cart")}
                    >
                      Checkout
                    </button>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartSidebar;
