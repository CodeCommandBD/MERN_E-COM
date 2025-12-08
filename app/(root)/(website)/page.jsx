import Script from "next/script";
import HomeContent from "./HomeContent";

// SEO Metadata for Home Page
export const metadata = {
  title:
    "E-Store - Premium Fashion & Clothing | Shop T-shirts, Hoodies, Oversized",
  description:
    "Welcome to E-Store - Your destination for trendy T-shirts, Hoodies, and Oversized clothing. Free shipping, 7-day returns, 24/7 support. Shop now for exclusive member discounts!",
  alternates: {
    canonical: "/",
  },
};

// Website JSON-LD Structured Data
function WebsiteJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "E-Store",
    url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        }/shop?search={search_term_string}`,
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

// Organization JSON-LD
function OrganizationJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "E-Store",
    url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    logo: `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    }/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Bengali"],
    },
  };

  return (
    <Script
      id="organization-jsonld"
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
      <HomeContent testimonials={testimonials} />
    </>
  );
};

export default page;
