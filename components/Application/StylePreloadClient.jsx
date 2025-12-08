"use client";

import { useEffect } from "react";

export default function StylePreloadClient() {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
    );

    links.forEach((link) => {
      if (!link.href) return;

      // If a preload already exists, skip.
      const alreadyPreloaded = document.querySelector(
        `link[rel="preload"][as="style"][href="${link.href}"]`
      );
      if (alreadyPreloaded) return;

      // Preload to pull CSS earlier without blocking render.
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "style";
      preload.href = link.href;
      preload.crossOrigin = link.crossOrigin || "anonymous";
      document.head.appendChild(preload);
    });
  }, []);

  return null;
}
