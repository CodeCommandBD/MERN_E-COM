import Script from "next/script";
import HomeContent from "./HomeContent";

// SEO Metadata for Home Page
export const metadata = {
  title:
    "WearPoint - Premium Quality Men's Fashion | Shop Shirts, Shorts & More",
  description:
    "Discover premium quality men's fashion at WearPoint. Shop stylish shirts, athletic shorts, and casual wear. Up to 30% off. Free shipping on orders over $50. Visit wearpoint.com",
  keywords: [
    "WearPoint",
    "premium men's fashion",
    "men's shirts online",
    "athletic shorts",
    "casual wear",
    "formal shirts",
    "quality clothing",
    "men's fashion store",
    "online clothing store",
    "fashion boutique",
    "men's premium shirts",
    "athletic wear",
    "business casual",
    "men's sportswear",
  ],
  authors: [{ name: "WearPoint" }],
  creator: "WearPoint",
  publisher: "WearPoint",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.com",
    siteName: "WearPoint",
    title: "WearPoint - Premium Quality Men's Fashion",
    description:
      "Shop premium men's shirts, shorts & casual wear. Up to 30% off. Free shipping over $50.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "WearPoint Premium Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WearPoint - Premium Quality Men's Fashion",
    description:
      "Shop premium men's shirts, shorts & casual wear. Up to 30% off.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.com"}/twitter-image.jpg`,
    ],
    creator: "@wearpoint",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual Google Search Console verification code
    // yandex: 'your-yandex-verification-code', // Uncomment if using Yandex
  },
  alternates: {
    canonical: "/",
  },
  category: "fashion",
};

// Website JSON-LD Structured Data
function WebsiteJsonLd() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://wearpoint.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WearPoint",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Organization JSON-LD (ClothingStore)
function OrganizationJsonLd() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://wearpoint.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "WearPoint",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/store-image.jpg`,
    description:
      "Premium quality men's fashion and lifestyle clothing store offering shirts, shorts, and casual wear.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Fashion Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10011",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-WEARPOINT",
      contactType: "Customer Service",
      email: "support@wearpoint.com",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://facebook.com/wearpoint",
      "https://instagram.com/wearpoint",
      "https://twitter.com/wearpoint",
    ],
    priceRange: "$$",
    paymentAccepted:
      "Cash, Credit Card, Debit Card, PayPal, Apple Pay, Google Pay",
    openingHours: "Mo-Su 00:00-24:00",
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Aggregate Rating JSON-LD (for testimonials)
function AggregateRatingJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WearPoint",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2547",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <Script
      id="rating-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

import { getTestimonials } from "@/lib/actions/testimonial.action";

export const dynamic = "force-dynamic";

const page = async () => {
  const testimonials = await getTestimonials();

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <AggregateRatingJsonLd />
      <HomeContent testimonials={testimonials} />
    </>
  );
};

export default page;
