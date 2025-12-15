import React, { Suspense } from "react";
import { preload } from "react-dom";

import Script from "next/script";
import xss from "xss";
import { markdownToHtml } from "@/lib/markdownToHtml";
import { getProductDetails } from "@/lib/actions/product.action";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import ProductDetailsWrapper from "./ProductDetailsWrapper";
import Loading from "@/components/Application/Loading";

// Lazy load Reviews to reduce initial bundle
const ProductReview = React.lazy(() =>
  import("@/components/Application/Website/ProductReview")
);

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { color, size } = await searchParams;

  try {
    const data = await getProductDetails(slug, color, size);

    if (!data || !data.products) {
      throw new Error("Product not found");
    }

    const product = data.products;
    const variant = data.variant;

    const title = product.name;
    const stripHtml = (html) => {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, "");
    };

    let description = stripHtml(product.description).slice(0, 120);

    if (description.length < 10) {
      description = `Buy ${product.name} at WearPoint. Premium quality, free shipping over $50.`;
    } else {
      description = `Buy ${product.name} at WearPoint. ${description}... Premium quality, free shipping over $50.`;
    }
    const imageUrl =
      variant?.media?.[0]?.secure_url || product?.media?.[0]?.secure_url;

    const absoluteImage = imageUrl
      ? imageUrl.startsWith("http")
        ? imageUrl
        : `${process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        ""
        }${imageUrl}`
      : undefined;

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || ""
      }/product/${product.slug}`;

    return {
      title,
      description,
      keywords: [
        product.name,
        product.category?.name || "fashion",
        variant?.color?.name || "clothing",
        "WearPoint",
        "buy online",
        "premium quality",
        "men's fashion",
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${product.name} | WearPoint`,
        description,
        url: canonicalUrl,
        images: absoluteImage
          ? [{ url: absoluteImage, width: 800, height: 800, alt: product.name }]
          : [],
        type: "product.item",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | WearPoint`,
        description,
        images: absoluteImage ? [absoluteImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

function ProductJsonLd({ product, variant }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://wearpoint-nu.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description?.replace(/<[^>]*>/g, "").slice(0, 500) || "",
    image:
      variant?.media?.map((m) => m.secure_url) ||
      product?.media?.map((m) => m.secure_url) ||
      [],
    sku: variant?._id || product._id,
    mpn: `WP-${product._id?.toString().slice(-8).toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "WearPoint",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "USD",
      price: variant?.sellingPrice || product.sellingPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "WearPoint",
      },
    },
  };

  if (product.averageRating && product.reviewCount) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <Script
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { color, size } = await searchParams;

  try {
    const data = await getProductDetails(slug, color, size);

    // Handle 404s
    if (!data || !data.products) {
      return (
        <div className="flex items-center justify-center h-screen text-4xl font-bold text-red-500">
          Product not found
        </div>
      );
    }

    if (!data.variant) {
      return (
        <div className="flex items-center justify-center h-screen text-4xl font-bold text-red-500">
          Variant not found
        </div>
      );
    }

    const { products: product, variant, getColor, getSize, reviewCount } = data;
    const sanitizedDescription = markdownToHtml(product.description || "");

    const imageUrl =
      variant?.media?.[0]?.secure_url || product?.media?.[0]?.secure_url;

    if (imageUrl) {
      preload(imageUrl, { as: "image", fetchPriority: "high" });
    }

    return (
      <>
        <ProductJsonLd product={product} variant={variant} />

        <main id="main-content" className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Breadcrumb */}
            <div className="my-6 lg:my-10">
              <div className="bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 border border-gray-200 inline-block">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/"
                        className="hover:text-gray-700 transition-colors text-sm lg:text-base"
                      >
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={WEBSITE_SHOP}
                        className="hover:text-gray-700 transition-colors text-sm lg:text-base"
                      >
                        Shop
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold text-gray-900 text-sm lg:text-base line-clamp-1 max-w-[150px] lg:max-w-none">
                        {product.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Main Product Section - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 mb-20 items-start">
              {/* Product Details Wrapper (Gallery + Info + Actions) */}
              <ProductDetailsWrapper
                product={product}
                variant={variant}
                Color={getColor}
                Size={getSize}
                reviewCount={reviewCount}
                sanitizedDescription={sanitizedDescription}
              />
            </div>

            {/* Product Description Section */}
            <div className="mb-20 w-full">
              <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden w-full">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Product Description
                  </h2>
                </div>
                <div className="p-6 lg:p-8">
                  <div
                    className="text-gray-700 leading-relaxed overflow-hidden space-y-3 w-full"
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
        </main>
      </>
    );
  } catch (error) {
    console.error("Product Page Error:", error);
    return <div>Something went wrong: {error.message}</div>;
  }
};

export default ProductPage;
