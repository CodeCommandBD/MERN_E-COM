/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Remove console logs in production (except errors/warnings)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Optimize package imports for tree-shaking
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-icons",
      "recharts",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
    // Image optimization settings
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Powered by header removal for security
  poweredByHeader: false,
  headers: async () => {
    return [
      // Force correct Content-Type for sitemap (Google Search Console fix)
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
      // Main HTML documents (bfcache friendly)
      {
        source: "/product/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Apply same doc policy to all other pages as a safe default
      {
        source: "/((?!_next/static).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Security + DNS prefetch
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com https://maps.googleapis.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
              "script-src-elem 'self' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com https://maps.googleapis.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://res.cloudinary.com https://*.stripe.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://res.cloudinary.com https://api.stripe.com https://checkout.stripe.com https://maps.googleapis.com https://upload-widget.cloudinary.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://upload-widget.cloudinary.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      // Hint Cloudinary at the HTTP layer too
      {
        source: "/(.*)",
        headers: [
          {
            key: "Link",
            value: "<https://res.cloudinary.com>; rel=preconnect",
          },
        ],
      },
      // CSS MIME Type Fix and Cache Control
      {
        source: "/_next/static/css/:path*.css",
        headers: [
          { key: "Content-Type", value: "text/css; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/chunks/:path*.css",
        headers: [
          { key: "Content-Type", value: "text/css; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache control for static assets (1 year, immutable)
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache control for JS bundles
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API responses: private short cache with SWR
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=300, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
