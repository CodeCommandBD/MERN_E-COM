"use client";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("./Toaster"), {
  ssr: false,
});

const ToasterWrapper = () => {
  return <Toaster />;
};

export default ToasterWrapper;
