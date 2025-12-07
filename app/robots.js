const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/checkout",
          "/cart",
          "/order/",
          "/payment-success",
          "/payment-cancel",
          "/my-account",
          "/my-orders",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
