export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint-nu.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/", // Admin dashboard
          "/api/", // API routes
          "/auth/", // Authentication routes
          "/checkout/", // Checkout process
          "/checkout",
          "/cart/", // Shopping cart
          "/cart",
          "/order/", // Order pages
          "/payment-success", // Payment confirmation pages
          "/payment-cancel",
          "/my-account/", // User account pages
          "/my-account",
          "/my-orders/", // User order history
          "/my-orders",
        ],
      },
    ],
    sitemap: "https://wearpoint-nu.vercel.app/sitemap.xml",
  };
}
