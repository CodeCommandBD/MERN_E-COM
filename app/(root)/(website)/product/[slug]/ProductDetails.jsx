"use client";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
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
import { Star } from "lucide-react";
import Link from "next/link";
import { HiPlus, HiMinus } from "react-icons/hi";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { useDispatch } from "react-redux";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import Loading from "@/components/Application/Loading";
const ProductReview = React.lazy(() =>
  import("@/components/Application/Website/ProductReview")
);

const ProductDetails = ({
  product,
  variant,
  Color,
  Size,
  reviewCount,
  sanitizedDescription,
}) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(
    variant?.media?.[0]?.secure_url
  );
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

  const handleThumbClick = useCallback((thumb) => {
    setActiveThumb(thumb);
  }, []);

  const handleQuantityChange = useCallback(
    (actionType) => {
      if (actionType === "inc") {
        setQuantity((prev) => prev + 1);
      } else {
        if (quantity !== 1) {
          setQuantity((prev) => prev - 1);
        }
      }
    },
    [quantity]
  );

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
    <div className="lg:px-32 px-4 relative">
      {isProductLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 dark:bg-black/50">
          <Loading></Loading>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="my-10">
        <div className="bg-white/80 backdrop-blur-md rounded-xl px-5 py-3 border border-gray-200 inline-block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="hover:text-gray-700 transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={WEBSITE_SHOP}
                  className="hover:text-gray-700 transition-colors"
                >
                  Product
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-gray-900">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        {/* Image Gallery Section */}
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-20">
          {/* Thumbnail Images */}
          <div className="flex xl:flex-col items-center xl:gap-4 gap-3 xl:w-28 overflow-auto xl:pb-0 p-3 max-h-[600px] xl:order-first order-last xl:mt-0 mt-5">
            {variant?.media?.map((item, index) => (
              <div
                key={index}
                onClick={() => handleThumbClick(item.secure_url)}
                className={`relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                  item.secure_url.trim() === activeThumb
                    ? "ring-4 ring-gray-400 scale-105"
                    : "ring-2 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                <Image
                  src={item.secure_url || imagePlaceholder.src}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="md:max-w-full max-w-16 object-cover aspect-square"
                  sizes="100px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="xl:flex-1 relative group">
            <div
              className="relative overflow-hidden rounded-3xl bg-gray-50 p-8 border border-gray-200"
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={activeThumb || imagePlaceholder.src}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 80vw, 50vw"
                priority
                fetchPriority="high"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg=="
              />
              {/* Discount Badge */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-red-500 text-white px-5 py-3 rounded-2xl font-bold text-lg">
                    -{product.discountPercentage}% OFF
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 md:mt-0 mt-8">
          {/* Product Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-6 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200 w-fit">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="text-yellow-500 w-5 h-5 fill-yellow-500"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              ({reviewCount} Reviews)
            </span>
          </div>

          {/* Single Unified Card */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-6">
            {/* Price Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-green-600">
                  {product.sellingPrice.toLocaleString("BD", {
                    currency: "BDT",
                    style: "currency",
                    currencyDisplay: "narrowSymbol",
                  })}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {product.mrp.toLocaleString("BD", {
                    currency: "BDT",
                    style: "currency",
                    currencyDisplay: "narrowSymbol",
                  })}
                </span>
                <div className="">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-xl font-bold text-sm">
                    Save{" "}
                    {(product.mrp - product.sellingPrice).toLocaleString("BD", {
                      currency: "BDT",
                      style: "currency",
                      currencyDisplay: "narrowSymbol",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Description Preview */}
            <div className="p-6 bg-gray-50">
              <div
                className="text-gray-700 leading-relaxed text-sm line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: sanitizedDescription,
                }}
              ></div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Color Selection */}
            <div className="p-6">
              <h3 className="text-base font-bold mb-3">
                <span className="text-gray-900">Color: </span>
                <span className="text-gray-600">{variant?.color}</span>
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {Color.map((item, index) => (
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(
                      product.slug
                    )}?color=${item}&size=${variant?.size}`}
                    key={index}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      item === variant?.color
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Size Selection */}
            <div className="p-6">
              <h3 className="text-base font-bold mb-3">
                <span className="text-gray-900">Size: </span>
                <span className="text-gray-600">{variant?.size}</span>
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {Size.map((item, index) => (
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${
                      variant?.color
                    }&size=${item}`}
                    key={index}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      item === variant?.size
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Quantity Selector */}
            <div className="p-6">
              <p className="text-base font-bold mb-3 text-gray-900">
                Quantity:
              </p>
              <div className="flex items-center h-12 bg-white border-2 border-gray-200 w-fit rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="w-12 h-full flex items-center justify-center border-r-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <HiMinus className="text-gray-700 text-lg" />
                </button>
                <input
                  readOnly
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  className="w-16 h-full flex items-center justify-center text-center text-lg font-bold text-gray-900 outline-none"
                />
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="w-12 h-full flex items-center justify-center border-l-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <HiPlus className="text-gray-700 text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart / Go to Cart Button */}
          {!isAddedIntocart ? (
            <div>
              <ButtonLoading
                onClick={handleAddToCart}
                type="button"
                text="Add to Cart"
                className="w-full cursor-pointer py-6 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/80"
              ></ButtonLoading>
            </div>
          ) : (
            <div>
              <Button
                asChild
                type="button"
                className="w-full cursor-pointer py-6 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-700"
              >
                <Link href={WEBSITE_CART}>Go to Cart</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Description Section */}
      <div className="mb-20">
        <div className="rounded-3xl bg-white border border-gray-200">
          {/* Header */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">
              Product Description
            </h2>
          </div>

          {/* Content */}
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizedDescription,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Product Review Section */}
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        }
      >
        <ProductReview product={product} />
      </Suspense>
    </div>
  );
};

export default ProductDetails;
