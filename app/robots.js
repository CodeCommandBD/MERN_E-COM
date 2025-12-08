const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/", // Assuming auth is a route group or api path
          "/checkout/", // Likely these pages should be blocked. Adding trailing slash if they have sub-routes or just /checkout
          "/checkout",
          "/cart/",
          "/cart",
          "/order/",
          "/payment-success",
          "/payment-cancel",
          "/my-account/",
          "/my-account",
          "/my-orders/",
          "/my-orders",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
