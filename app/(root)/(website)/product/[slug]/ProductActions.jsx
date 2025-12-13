"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { HiPlus, HiMinus } from "react-icons/hi";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import Link from "next/link";
import { WEBSITE_CART } from "@/Routes/WebsiteRoute";
import { ButtonLoading } from "@/components/Application/ButtonLoading";

const ProductActions = ({ product, variant }) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const [quantity, setQuantity] = useState(1);
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
  const isOutOfStock = !variant || (variant.stock ?? 0) <= 0;
  const maxQty = Math.max(0, variant?.stock ?? 0);

  useEffect(() => {
    if (cartStore.count > 0 && variant) {
      const cartProduct = cartStore.products.find(
        (p) => p.productId === product._id && p.variantId === variant._id
      );
      setIsAddedIntoCart(!!cartProduct);
    } else {
      setIsAddedIntoCart(false);
    }
  }, [cartStore, product._id, variant]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [variant?._id]);

  const handleQuantityChange = useCallback(
    (actionType) => {
      if (actionType === "inc") {
        setQuantity((prev) => (prev < maxQty ? prev + 1 : prev));
      } else {
        if (quantity > 1) {
          setQuantity((prev) => prev - 1);
        }
      }
    },
    [quantity, maxQty]
  );

  const handleAddToCart = () => {
    if (!variant) return;
    if (isOutOfStock) {
      showToast("error", "This variant is out of stock");
      return;
    }
    if (quantity > maxQty) {
      showToast("error", `Only ${maxQty} left in stock`);
      return;
    }

    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      color: variant.color,
      size: variant.size,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      image: variant.media[0].secure_url,
      discountPercentage: variant.discountPercentage,
      quantity: quantity,
    };

    dispatch(addIntoCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast("success", "Product added to cart");
  };

  if (!variant) return null;

  return (
    <div className="w-full">
      {/* Quantity Selector */}
      <div className="p-4 lg:p-6">
        <p className="text-base font-bold mb-3 text-gray-900">Quantity:</p>
        <div className="flex items-center h-12 bg-white border-2 border-gray-200 w-fit rounded-xl overflow-hidden">
          <button
            onClick={() => handleQuantityChange("dec")}
            className="w-12 h-full flex items-center justify-center border-r-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <HiMinus className="text-gray-700 text-lg" />
          </button>
          <div className="w-16 h-full flex items-center justify-center text-center text-lg font-bold text-gray-900">
            {quantity}
          </div>
          <button
            onClick={() => handleQuantityChange("inc")}
            className="w-12 h-full flex items-center justify-center border-l-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= maxQty || isOutOfStock}
            aria-label="Increase quantity"
          >
            <HiPlus className="text-gray-700 text-lg" />
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 pt-0">
        {!isAddedIntoCart ? (
          isOutOfStock ? (
            <Button
              type="button"
              disabled
              className="w-full cursor-not-allowed py-6 text-lg font-bold rounded-2xl bg-gray-300 text-gray-700"
            >
              Out of Stock
            </Button>
          ) : (
            <ButtonLoading
              onClick={handleAddToCart}
              type="button"
              text="Add to Cart"
              className="w-full cursor-pointer py-6 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            />
          )
        ) : (
          <Button
            asChild
            className="w-full cursor-pointer py-6 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
          >
            <Link href={WEBSITE_CART} className="text-white" style={{ color: '#ffffff' }}>Go to Cart</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
