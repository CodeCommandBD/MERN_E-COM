import "./globals.css";
import { Assistant } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GlobalProvider from "@/components/Application/GlobalProvider";
import ToasterWrapper from "@/components/Application/ToasterWrapper";
import criticalCss from "@/lib/critical-css";
import StylePreloadClient from "@/components/Application/StylePreloadClient";

const assistant = Assistant({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:3000"
  ),
  title: {
    default:
      "E-Store - Premium Fashion & Clothing | T-shirts, Hoodies, Oversized",
    template: "%s | E-Store",
  },
  description:
    "Discover trendy fashion at E-Store. Shop premium T-shirts, Hoodies, Oversized clothing with free shipping, 7-day returns, and 24/7 customer support. Best prices guaranteed!",
  keywords: [
    "fashion",
    "clothing",
    "t-shirts",
    "hoodies",
    "oversized",
    "online shopping",
    "Bangladesh",
    "premium fashion",
    "streetwear",
    "casual wear",
  ],
  authors: [{ name: "E-Store" }],
  creator: "E-Store",
  publisher: "E-Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "E-Store",
    title: "E-Store - Premium Fashion & Clothing",
    description:
      "Discover trendy fashion at E-Store. Shop T-shirts, Hoodies, Oversized clothing with free shipping and 24/7 support.",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Store - Premium Fashion & Clothing",
    description:
      "Discover trendy fashion at E-Store. Shop T-shirts, Hoodies, Oversized clothing with free shipping.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code when available
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Resource hints to pull key assets sooner */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preload critical CSS chunks observed in production Lighthouse */}
        <link rel="preload" href="/chunks/1a08af5b241d62e0.css" as="style" />
        <link rel="preload" href="/chunks/8bee4e60cdd3d416.css" as="style" />
        <style
          data-critical="above-the-fold"
          // Inline only the minimal atoms needed for first paint.
          dangerouslySetInnerHTML={{ __html: criticalCss }}
        />
      </head>
      <body
        className={`${assistant.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <GlobalProvider>
          <div suppressHydrationWarning={true}>
            <StylePreloadClient />
            <ToasterWrapper />
            <div suppressHydrationWarning={true}>{children}</div>
          </div>
          <SpeedInsights />
          <Analytics />
        </GlobalProvider>
      </body>
    </html>
  );
}
