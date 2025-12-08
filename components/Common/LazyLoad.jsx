"use client";
import { useEffect, useRef, useState } from "react";

const LazyLoad = ({ children, placeholder, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "100px", // Trigger slightly before element comes into view
        threshold,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={containerRef}>
      {isVisible ? children : placeholder || <div className="h-20 w-full" />}
    </div>
  );
};

export default LazyLoad;
