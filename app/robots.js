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
    sitemap: "https://wearpoint-nu.vercel.app/sitemap.xml",
  };
}
