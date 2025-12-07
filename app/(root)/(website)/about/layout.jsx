// SEO Metadata for About Page
export const metadata = {
  title: "About Us | E-Store - Premium Fashion & Clothing",
  description:
    "Learn about E-Store's mission to bring quality fashion at affordable prices. 10K+ happy customers, 500+ products, 24/7 support. Shop with confidence!",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About E-Store | Your Fashion Destination",
    description:
      "Discover our story, values, and commitment to quality fashion. 10K+ happy customers, 500+ products, 24/7 support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About E-Store | Your Fashion Destination",
    description:
      "Discover our story, values, and commitment to quality fashion.",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
