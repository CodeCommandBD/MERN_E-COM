"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import PageLoader from "./PageLoader";

const PageTransitionLoader = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // When pathname changes, show loader
    if (pathname !== prevPathnameRef.current) {
      setIsLoading(true);
      prevPathnameRef.current = pathname;
      
      // Hide loader after page has had time to start rendering
      // This gives time for the page's own loading states to take over
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/90 dark:bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <PageLoader message="Loading page..." />
    </div>
  );
};

export default PageTransitionLoader;

