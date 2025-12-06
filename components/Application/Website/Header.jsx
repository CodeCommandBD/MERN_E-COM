"use client";
import { logo_black, userIcon } from "@/public/image";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
  WEBSITE_SHOP,
} from "@/Routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Cart from "./Cart";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Search from "./Search";
import { Package } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch active order count - deferred to not block initial render
  useEffect(() => {
    const fetchOrderCount = async () => {
      // If user is authenticated
      if (auth?._id) {
        try {
          // Get user email
          let userEmail = auth.email;
          if (!userEmail) {
            const userResponse = await axios.get(`/api/user/${auth._id}`);
            if (userResponse.data.success) {
              userEmail = userResponse.data.data.email;
            }
          }

          // Fetch order count
          let params = "";
          if (auth._id) params += `userId=${auth._id}`;
          if (userEmail) params += `${params ? "&" : ""}email=${userEmail}`;

          const response = await axios.get(`/api/order/count?${params}`);
          if (response.data.success) {
            setOrderCount(response.data.count);
          }
        } catch (error) {
          console.error("Failed to fetch order count:", error);
        }
      } else {
        // If guest user, check local storage and validate with API
        try {
          const guestOrders = JSON.parse(
            localStorage.getItem("guest_orders") || "[]"
          );

          // Filter out potential null/undefined/empty strings
          const validGuestOrders = guestOrders.filter((id) => id);

          if (validGuestOrders.length > 0) {
            // Validate against DB to ensure orders still exist and aren't cancelled/delivered
            const response = await axios.get(
              `/api/order/count?orderIds=${validGuestOrders.join(",")}`
            );
            if (response.data.success) {
              setOrderCount(response.data.count);
            }
          } else {
            setOrderCount(0);
          }
        } catch (error) {
          console.error("Failed to parse guest orders or fetch count:", error);
          setOrderCount(0);
        }
      }
    };

    // Defer API call to after initial render to not block LCP
    const timeoutId = setTimeout(fetchOrderCount, 100);
    // Refresh count every 30 seconds
    const interval = setInterval(fetchOrderCount, 30000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [auth]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo */}
          <Link href={WEBSITE_HOME} className="flex-shrink-0">
            <Image
              className="w-24 sm:w-28 lg:w-32 h-auto"
              src={logo_black}
              alt="logo"
              width={300}
              height={150}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center mx-8">
            <ul className="flex items-center gap-6 xl:gap-10">
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_HOME} className="py-2 px-3">
                  Home
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href="/about" className="py-2 px-3">
                  About
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_SHOP} className="py-2 px-3">
                  Shop
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link
                  href={`${WEBSITE_SHOP}?category=t-shirts`}
                  className="py-2 px-3"
                >
                  T-shirt
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link
                  href={`${WEBSITE_SHOP}?category=hoodies`}
                  className="py-2 px-3"
                >
                  Hoodies
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link
                  href={`${WEBSITE_SHOP}?category=oversized`}
                  className="py-2 px-3"
                >
                  Oversized
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
            {/* Search Icon - Always visible */}
            <button type="button">
              <IoIosSearch
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                size={24}
                className="hover:text-primary cursor-pointer transition-colors"
              />
            </button>

            {/* Cart - Always visible */}
            <Cart />

            {/* My Orders - Always visible */}
            <Link
              href="/my-orders"
              className="relative hover:text-primary transition-colors"
              title="My Orders"
            >
              <Package size={24} className="cursor-pointer" />
              {orderCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </Link>

            {/* User Account/Avatar - Always visible */}
            {!auth ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="p-2 cursor-pointer">
                  <VscAccount
                    size={24}
                    className="hover:text-primary transition-colors"
                  />
                </div>
                {/* Hover Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full pt-1 z-50">
                    <div className="w-40 bg-white rounded-lg shadow-xl border py-2">
                      <Link
                        href={WEBSITE_LOGIN}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar className="cursor-pointer w-8 h-8">
                  <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                </Avatar>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden block cursor-pointer hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <FaBarsStaggered size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-full sm:w-80 h-screen bg-white  transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <Image
            className="lg:w-32 w-24"
            src={logo_black}
            alt="logo"
            width={300}
            height={150}
            priority
          />
          <button
            onClick={closeMobileMenu}
            className="p-2 hover:text-primary transition-colors"
            aria-label="Close menu"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col py-4">
              <li className="border-b">
                <Link
                  href={WEBSITE_HOME}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href="/about"
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={WEBSITE_SHOP}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Shop
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={`${WEBSITE_SHOP}?category=t-shirts`}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  T-shirt
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={`${WEBSITE_SHOP}?category=hoodies`}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Hoodies
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={`${WEBSITE_SHOP}?category=oversized`}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Oversized
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
          aria-label="Close menu overlay"
        />
      )}
      {isSearchOpen && (
        <Search isShow={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      )}
    </div>
  );
};

export default Header;
