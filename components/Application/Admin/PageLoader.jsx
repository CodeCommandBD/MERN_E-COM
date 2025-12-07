"use client";
import React from "react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;

