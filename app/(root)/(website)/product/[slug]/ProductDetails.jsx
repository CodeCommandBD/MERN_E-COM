"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/Routes/WebsiteRoute";
import Image from "next/image";
import { imagePlaceholder } from "@/public/image";
import { IoStar } from "react-icons/io5";
import Link from "next/link";
import { HiPlus, HiMinus } from "react-icons/hi";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import Loading from "@/components/Application/Loading";

const ProductDetails = ({ product, variant, Color, Size, reviewCount }) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState();
  const [isAddedIntocart, setIsAddedIntocart] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  useEffect(() => {
    if (variant) {
      setActiveThumb(variant?.media[0]?.secure_url);
    }
  }, [variant]);

  useEffect(() => {
    if (cartStore.count > 0) {
      const cartProduct = cartStore.products.find(
        (cartProduct) =>
          cartProduct.productId === product._id &&
          cartProduct.variantId === variant._id
      );

      if (cartProduct) {
        setIsAddedIntocart(true);
      } else {
        setIsAddedIntocart(false);
      }
    }
    setIsProductLoading(false);
  }, [variant]);

  const handleThumbClick = (thumb) => {
    setActiveThumb(thumb);
  };

  const handleQuantityChange = (actionType) => {
    if (actionType === "inc") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity !== 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
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
    setIsAddedIntocart(true);
    showToast("success", "Product added to cart");
  };

  return (
    <div className="lg:px-32 px-4">
      {isProductLoading && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-black/20">
          <Loading></Loading>
        </div>
      )}
      <div className="my-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>{" "}
      </div>
      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        <div className="md:w-1/2 xl:flex xl:justify-center xl:-gap-5 md:sticky md:top-0">
          <div className="xl:order-last xl:mb-0 mb-5 xl:[calc(100%-144px)]">
            <Image
              src={activeThumb || imagePlaceholder.src}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-contain border border-gray-200 rounded-md"
            ></Image>
          </div>
          <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
            {variant?.media?.map((item, index) => (
              <Image
                onClick={() => handleThumbClick(item.secure_url)}
                key={index}
                src={item.secure_url || imagePlaceholder.src}
                alt={product.name}
                width={100}
                height={100}
                className={`md:max-w-full max-w-16 rounded cursor-pointer ${
                  item.secure_url.trim() === activeThumb
                    ? "border border-gray-200"
                    : ""
                }`}
              ></Image>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:mt-0 mt-5">
          <h2 className="text-3xl font-semibold mb-5">{product.name}</h2>

          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <IoStar key={index} className="text-yellow-500"></IoStar>
            ))}
            <span className="text-sm ps-2">({reviewCount} Reviews)</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-semibold">
              {product.sellingPrice.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {product.mrp.toLocaleString("BD", {
                currency: "BDT",
                style: "currency",
                currencyDisplay: "narrowSymbol",
              })}
            </span>
            <span className="text-lg bg-red-500 text-white px-2 py-1 rounded">
              -{product.discountPercentage}% off
            </span>
          </div>
          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>

          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-2">
              Color: <span className="font-normal">{variant?.color}</span>
            </h2>
            <div className="flex items-center gap-2">
              {Color.map((item, index) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  href={`${WEBSITE_PRODUCT_DETAILS(
                    product.slug
                  )}?color=${item}&size=${variant?.size}`}
                  key={index}
                  className={`duration-300 border cursor-pointer border-gray-200 px-2 py-1 rounded-lg hover:bg-primary hover:text-white ${
                    item === variant?.color ? "bg-primary text-white" : ""
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-2">
              Size: <span className="font-normal">{variant?.size}</span>
            </h2>
            <div className="flex items-center gap-2">
              {Size.map((item, index) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${
                    variant?.color
                  }&size=${item}`}
                  key={index}
                  className={`duration-300 border cursor-pointer border-gray-200 px-2 py-1 rounded-lg hover:bg-primary hover:text-white ${
                    item === variant?.size ? "bg-primary text-white" : ""
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-bold mb-2">Quantity:</p>
            <div className="flex items-center h-10 border w-fit rounded-full">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="w-10 h-full flex items-center justify-center border-r border-gray-200 cursor-pointer"
              >
                <HiMinus />
              </button>
              <input
                readOnly
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                className="w-20 h-full flex items-center justify-center border-r text-center border-gray-200"
              />

              <button
                onClick={() => handleQuantityChange("inc")}
                className="w-10 h-full flex items-center justify-center border-gray-200 cursor-pointer"
              >
                <HiPlus />
              </button>
            </div>
          </div>

          {!isAddedIntocart ? (
            <div className="mt-5">
              <ButtonLoading
                onClick={handleAddToCart}
                type="button"
                text="Add to Cart"
                className="w-full cursor-pointer py-6 text-md"
              ></ButtonLoading>
            </div>
          ) : (
            <div className="mt-5">
              <Button
                onClick={handleAddToCart}
                asChild
                type="button"
                className="w-full cursor-pointer py-6 text-md"
              >
                <Link href={WEBSITE_CART}>Go to Cart</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-20">
        <div className="shadow rounded border">
          <div className="p-5 bg-gray-50 border-b">
            <h2 className="text-2xl font-semibold ">Product Details</h2>
          </div>
          <div className="p-5">
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="shadow rounded border">
          <div className="p-5 bg-gray-50 border-b">
            <h2 className="text-2xl font-semibold ">Product Details</h2>
          </div>
          <div className="p-5">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
