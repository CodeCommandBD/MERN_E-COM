// SEO Metadata for About Page
export const metadata = {
  title: "About Us | WearPoint - Premium Men's Fashion",
  description:
    "Learn about WearPoint's mission to deliver premium quality men's fashion. Designed for men aged 25-45 who value quality and style. 10K+ happy customers, 24/7 support. Shop with confidence!",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About WearPoint | Premium Men's Fashion Destination",
    description:
      "Discover our story, values, and commitment to premium quality men's fashion. 10K+ happy customers, 24/7 support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About WearPoint | Premium Men's Fashion Destination",
    description:
      "Discover our story, values, and commitment to premium quality men's fashion.",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
