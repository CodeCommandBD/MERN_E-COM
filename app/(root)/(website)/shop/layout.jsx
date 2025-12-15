// SEO Metadata for Shop Page
export const metadata = {
  title: "Shop All Products | Men's Fashion | WearPoint",
  description:
    "Browse WearPoint's complete collection of premium men's fashion. Shop shirts, shorts, casual wear, and formal attire. Free shipping on orders over $50.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Products | WearPoint",
    description:
      "Browse WearPoint's complete collection of premium men's fashion. Quality clothing at great prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Products | WearPoint",
    description:
      "Browse WearPoint's complete collection of premium men's fashion.",
  },
};

export default function ShopLayout({ children }) {
  return children;
}
