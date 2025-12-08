"use client";
import { Input } from "@/components/ui/input";
import { WEBSITE_SHOP } from "@/Routes/WebsiteRoute";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const Search = ({ isShow, setIsSearchOpen }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`${WEBSITE_SHOP}?q=${query}`);
      setIsSearchOpen(false);
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Fetch suggestions with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length > 1) {
      setLoading(true);
      debounceTimer.current = setTimeout(async () => {
        try {
          const response = await axios.get(`/api/shop?q=${query}&limit=5`);
          if (response.data.success) {
            setSuggestions(response.data.data.products || []);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setLoading(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSuggestions([]);
      }
    };

    if (isShow) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShow, setIsSearchOpen]);

  const handleSuggestionClick = () => {
    setIsSearchOpen(false);
    setSuggestions([]);
    setQuery("");
  };

  return (
    <div
      ref={searchRef}
      className={`fixed md:absolute border-t transition-[transform,opacity,visibility] duration-300 ease-in-out left-0 top-0 w-full z-50 bg-white/98 backdrop-blur-md shadow-2xl ${
        isShow
          ? "translate-y-[72px] md:translate-y-[70px] opacity-100 visible"
          : "-translate-y-full opacity-0 invisible"
      }`}
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-between items-center relative">
          <Input
            className="w-full rounded-full md:h-14 h-11 ps-5 md:ps-6 pe-12 md:pe-14 border-2 border-primary/20 focus:border-primary shadow-lg text-sm md:text-lg transition-all duration-200 focus:shadow-xl"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 md:right-3 cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <IoSearchOutline size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {query.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[28rem] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            {loading && (
              <div className="p-6 text-center text-gray-500 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <IoSearchOutline size={48} className="mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}

            {!loading && suggestions.length > 0 && (
              <>
                <div className="max-h-80 overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {suggestions.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={handleSuggestionClick}
                          className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group"
                        >
                          {product.media && product.media[0] && (
                            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-gray-100 ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all duration-200">
                              <Image
                                src={product.media[0].secure_url}
                                alt={product.media[0].alt || product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm md:text-base text-gray-800 truncate group-hover:text-primary transition-colors duration-200">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-1.5 md:gap-2 mt-1 flex-wrap">
                              <p className="text-primary font-bold text-base md:text-lg">
                                ৳{product.sellingPrice.toLocaleString()}
                              </p>
                              {product.mrp > product.sellingPrice && (
                                <>
                                  <span className="text-gray-400 line-through text-sm">
                                    ৳{product.mrp.toLocaleString()}
                                  </span>
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {Math.round(
                                      ((product.mrp - product.sellingPrice) /
                                        product.mrp) *
                                        100
                                    )}
                                    % OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {!loading && suggestions.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="text-primary hover:text-primary/80 text-sm font-semibold w-full text-center py-2 hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  View all results for "{query}" →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
