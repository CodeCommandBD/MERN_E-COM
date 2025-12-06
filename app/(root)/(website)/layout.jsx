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
      <Header></Header>
      <main>{children}</main>
      <Footer></Footer>
      <ChatWidget />
    </div>
  );
};

export default layout;
