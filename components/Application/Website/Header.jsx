"use client";
import { logo_black, userIcon } from "@/public/image";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
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

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                <Link href={WEBSITE_HOME} className="py-2 px-3">
                  About
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_SHOP} className="py-2 px-3">
                  Shop
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_HOME} className="py-2 px-3">
                  T-shirt
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_HOME} className="py-2 px-3">
                  Hoddies
                </Link>
              </li>
              <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
                <Link href={WEBSITE_HOME} className="py-2 px-3">
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

            {/* User Account/Avatar - Always visible */}
            {!auth ? (
              <Link href={WEBSITE_LOGIN}>
                <VscAccount
                  size={24}
                  className="hover:text-primary cursor-pointer transition-colors"
                />
              </Link>
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
                  href={WEBSITE_HOME}
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
                  href={WEBSITE_HOME}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  T-shirt
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={WEBSITE_HOME}
                  className="block py-4 px-6 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Hoddies
                </Link>
              </li>
              <li className="border-b">
                <Link
                  href={WEBSITE_HOME}
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
