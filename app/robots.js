export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint-nu.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/", // Admin dashboard
          // Sensitive API routes only (allow public data APIs)
          "/api/auth/", // Authentication APIs
          "/api/order/", // Order APIs
          "/api/user/", // User APIs
          "/api/stripe/", // Payment APIs
          "/api/support/", // Support chat APIs
          "/api/customers/", // Customer data APIs
          "/api/dashboard/", // Admin dashboard APIs
          "/api/coupon/validate", // Coupon validation
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
