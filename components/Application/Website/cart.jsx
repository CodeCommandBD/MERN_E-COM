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

const Cart = () => {
  const [open, setOpen] = useState(false);
  const cart = useSelector((state) => state.cartStore);
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);


  useEffect(() => {
    const cartProduct = cart.products;
    const totalAmount = cartProduct.reduce((total, item) => {
      return total + item.quantity * item.sellingPrice;
    }, 0);

    const discountAmount = cartProduct.reduce((total, item) => {
      return total + ((item.mrp - item.sellingPrice) * item.quantity);
    }, 0);
    
    setSubTotal(totalAmount);
    setDiscount(discountAmount);
  }, [cart.products]);
  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="cursor-pointer hover:text-primary transition-colors relative">
            <BsCart2 size={24} className=" " />
            <span className="text-xs absolute top-0 -right-1 bg-primary text-white w-4 h-4 flex items-center justify-center rounded-full">{cart.count}</span>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">Cart</SheetTitle>
            <SheetDescription>
              {cart.products.length} items in cart
            </SheetDescription>
          </SheetHeader>
          <div className="h-[calc(100vh-3rem)] pb-10 pt-2 p-4">
            <div className="h-[calc(100%-6rem)] overflow-y-auto">
              {cart.count === 0 ? (
                <p className="text-center">Your cart is empty.</p>
              ) : (
                cart.products.map((item, i) => (
                  <div
                    key={i}
                    className="flex border-b pb-4 justify-between mb-4 items-center gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item?.media || imagePlaceholder.src}
                        alt={item?.name}
                        className="w-24 h-24 rounded-lg object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">{item?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item?.size}/{item?.color}
                      </p>
                    </div>

                    <div className="flex flex-col items-center ">
                      <button
                        onClick={() =>
                          dispatch(
                            removeProduct({
                              productId: item.productId,
                              variantId: item.variantId,
                            })
                          )
                        }
                        className="text-red-500 underline-offset-1 mb-1 flex items-center cursor-pointer"
                      >
                        Remove
                      </button>
                      <p className="font-semibold">
                        {item?.quantity} X{" "}
                        {item?.sellingPrice.toLocaleString("BD", {
                          currency: "BDT",
                          style: "currency",
                          currencyDisplay: "narrowSymbol",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className=" border-t pt-4">
              <h2 className="flex justify-between font-semibold text-lg">
                <span>Subtotal:</span> <span>{subTotal.toLocaleString("BD", { currency: "BDT", style: "currency", currencyDisplay: "narrowSymbol" })}</span>
              </h2>

              <h2 className="flex justify-between font-semibold text-lg">
                <span>Discount:</span> <span>{discount.toLocaleString("BD", { currency: "BDT", style: "currency", currencyDisplay: "narrowSymbol" })}</span>
              </h2>
              <div className="flex justify-between gap-10">
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  asChild
                  variant={"secondary"}
                  className=""
                >
                  <Link href={WEBSITE_CART}>View Cart</Link>
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  asChild
                  className=""
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
