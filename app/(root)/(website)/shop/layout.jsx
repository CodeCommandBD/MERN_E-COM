// SEO Metadata for Shop Page
export const metadata = {
  title: "Shop All Products | T-shirts, Hoodies, Oversized | E-Store",
  description:
    "Browse our complete collection of premium T-shirts, Hoodies, and Oversized clothing. Filter by size, color, and price. Free shipping on all orders!",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Products | E-Store",
    description:
      "Browse our complete collection of premium fashion. Filter by category, size, color, and price.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Products | E-Store",
    description:
      "Browse our collection of premium T-shirts, Hoodies, and Oversized clothing.",
  },
};

export default function ShopLayout({ children }) {
  return children;
}
