import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { Assistant } from "next/font/google";
import GlobalProvider from "@/components/Application/GlobalProvider";

const assistant = Assistant({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
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
        {/* Preconnect to Cloudinary for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${assistant.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <GlobalProvider>
          <div suppressHydrationWarning={true}>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              suppressHydrationWarning={true}
            />
            <div suppressHydrationWarning={true}>{children}</div>
          </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
