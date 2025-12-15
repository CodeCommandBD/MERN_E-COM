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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://wearpoint-nu.vercel.app"
  ),
  title: {
    default:
      "WearPoint - Premium Quality Men's Fashion & Lifestyle",
    template: "%s | WearPoint",
  },
  description:
    "Discover premium quality men's fashion at WearPoint. Shop stylish shirts, athletic shorts, casual wear, and formal wear. Designed for men aged 25-45 who value quality and style. Free shipping on orders over $50. Best prices guaranteed!",
  keywords: [
    "WearPoint",
    "premium men's fashion",
    "men's shirts online",
    "athletic shorts",
    "casual wear",
    "formal wear",
    "quality clothing",
    "men's fashion store",
    "online clothing store",
    "fashion boutique",
    "men's premium shirts",
    "business casual",
    "men's sportswear",
    "men 25-45 fashion",
    "quality men's clothing",
  ],
  authors: [{ name: "WearPoint" }],
  creator: "WearPoint",
  publisher: "WearPoint",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WearPoint",
    title: "WearPoint - Premium Quality Men's Fashion & Lifestyle",
    description:
      "Discover premium men's fashion at WearPoint. Shop shirts, shorts, casual wear & formal wear with free shipping and 24/7 support.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.nu.vercel.app",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.nu.vercel.app"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "WearPoint - Premium Men's Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WearPoint - Premium Quality Men's Fashion",
    description:
      "Discover premium men's fashion at WearPoint. Shop shirts, shorts & casual wear with free shipping.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint.nu.vercel.app"}/twitter-image.jpg`,
    ],
    creator: "@wearpoint",
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
    google: "q72GTx9vQx8amQEiUaIHVUoQ5xAKAN_0MIVghqEzA4E", // Keep existing verification code
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="overflow-x-hidden">
      <body
        className={`${assistant.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <style
          data-critical="above-the-fold"
          dangerouslySetInnerHTML={{ __html: criticalCss }}
        />
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
