import Footer from "@/components/Application/Website/Footer";
import Header from "@/components/Application/Website/Header";
import ChatWidget from "@/components/Application/Website/ChatWidget";
import React from "react";
import { Kumbh_Sans } from "next/font/google";

const kumbh_sans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kumbh-sans",
  display: "swap",
});

const layout = ({ children }) => {
  return (
    <div className={kumbh_sans.className}>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <Header></Header>
      <main id="main-content">{children}</main>
      <Footer></Footer>
      <ChatWidget />
    </div>
  );
};

export default layout;
