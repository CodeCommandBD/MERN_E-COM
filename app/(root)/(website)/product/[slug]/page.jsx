import React from "react";
import ProductDetails from "./ProductDetails";
import axios from "axios";
import Script from "next/script";

// ISR: Revalidate product pages every 60 seconds
export const revalidate = 60;

// Dynamic metadata generation for SEO
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { color, size } = await searchParams;

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;
  if (color && size) {
    url += `?color=${color}&size=${size}`;
  }

  try {
    const { data: getProduct } = await axios.get(url);
    const product = getProduct.data.products;
    const variant = getProduct.data.variant;

    const title = product.name;
    const description = product.description
      ? product.description.replace(/<[^>]*>/g, "").slice(0, 160) + "..."
      : `Shop ${product.name} at E-Store. Premium quality fashion with free shipping.`;
    const imageUrl =
      variant?.media?.[0]?.secure_url || product?.media?.[0]?.secure_url;

    return {
      title,
      description,
      openGraph: {
        title: `${product.name} | E-Store`,
        description,
        images: imageUrl
          ? [{ url: imageUrl, width: 800, height: 800, alt: product.name }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | E-Store`,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

// JSON-LD Structured Data Component
function ProductJsonLd({ product, variant }) {
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
    brand: {
      "@type": "Brand",
      name: "E-Store",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/product/${
        product.slug
      }`,
      priceCurrency: "BDT",
      price: variant?.sellingPrice || product.sellingPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  // Add aggregate rating if reviews exist
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

// Direct data fetching from DB (Server Action pattern)
import { getProductDetails } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { color, size } = await searchParams;

  try {
    const data = await getProductDetails({ slug, color, size });

    // Handle 404s appropriately
    if (!data || !data.products) {
      // You can use Next.js notFound() or manual UI
      return (
        <div className="flex items-center justify-center h-screen text-4xl font-bold text-red-500">
          Product not found
        </div>
      );
    }

    // Original logic seemed to treat missing variant as a critical error (404),
    // but maybe we should just show the product?
    // STRICT MODE COMPLIANCE: If original API returned 404 for missing variant, we do too.
    if (!data.variant) {
      return (
        <div className="flex items-center justify-center h-screen text-4xl font-bold text-red-500">
          Variant not found
        </div>
      );
    }

    return (
      <>
        <ProductJsonLd product={data.products} variant={data.variant} />
        <ProductDetails
          product={data.products}
          variant={data.variant}
          Color={data.getColor}
          Size={data.getSize}
          reviewCount={data.reviewCount}
        />
      </>
    );
  } catch (error) {
    console.error("Product Page Error:", error);
    return <div>Something went wrong: {error.message}</div>;
  }
};

export default ProductPage;
