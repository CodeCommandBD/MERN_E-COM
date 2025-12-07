import Script from "next/script";

/**
 * FAQ JSON-LD Structured Data Component
 * Helps search engines understand FAQ content for rich snippets
 */
export function FAQJsonLd() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the return policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer a 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days for a full refund.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer free shipping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer free shipping on all orders within Bangladesh. No minimum order required.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods do you accept?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We accept Cash on Delivery (COD) and Credit/Debit Cards (Visa, Mastercard, AMEX) via Stripe secure payment.",
        },
      },
      {
        "@type": "Question",
        name: "How long does delivery take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard delivery takes 2-3 business days within Dhaka, and 3-5 business days for other areas in Bangladesh.",
        },
      },
      {
        "@type": "Question",
        name: "How can I track my order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can track your order by visiting the 'My Orders' section after logging in, or use the order number provided in your confirmation email.",
        },
      },
    ],
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

/**
 * Category Collection JSON-LD Structured Data Component
 * @param {Object} props - Component props
 * @param {Object} props.category - Category object with name and slug
 * @param {Array} props.products - Array of products in the category
 */
export function CategoryJsonLd({ category, products }) {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Collection - E-Store`,
    description: `Shop our ${
      category.name
    } collection. Premium quality ${category.name.toLowerCase()} with free shipping.`,
    url: `${BASE_URL}/shop?category=${category.slug}`,
    hasPart: products.slice(0, 10).map((product) => ({
      "@type": "Product",
      name: product.name,
      url: `${BASE_URL}/product/${product.slug}`,
      image: product.media?.[0]?.secure_url,
      offers: {
        "@type": "Offer",
        price: product.sellingPrice,
        priceCurrency: "BDT",
        availability: "https://schema.org/InStock",
      },
    })),
  };

  return (
    <Script
      id="category-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Breadcrumb JSON-LD Structured Data Component
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with name and url
 */
export function BreadcrumbJsonLd({ items }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Local Business JSON-LD Structured Data Component
 */
export function LocalBusinessJsonLd() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "E-Store",
    image: `${BASE_URL}/logo.png`,
    url: BASE_URL,
    telephone: "+8801777777777",
    email: "support@estore.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "E-Store market uttara",
      addressLocality: "Dhaka",
      postalCode: "1207",
      addressCountry: "BD",
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "৳৳",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    currenciesAccepted: "BDT",
  };

  return (
    <Script
      id="localbusiness-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
