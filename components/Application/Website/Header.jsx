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
import Cart from "./cart";
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
    <div className="bg-white border-b lg:px-32 px-4 sticky top-0 z-50">
      <div className="flex justify-between items-center lg:py-4 py-3">
        {/* Logo */}
        <Link href={WEBSITE_HOME}>
          <Image
            className="lg:w-32 w-24"
            src={logo_black}
            alt="logo"
            width={300}
            height={150}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-10">
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_HOME} className="py-2 px-4">
                Home
              </Link>
            </li>
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_HOME} className="py-2 px-4">
                About
              </Link>
            </li>
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_SHOP} className="py-2 px-4">
                Shop
              </Link>
            </li>
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_HOME} className="py-2 px-4">
                T-shirt
              </Link>
            </li>
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_HOME} className="py-2 px-4">
                Hoddies
              </Link>
            </li>
            <li className="text-gray-500 hover:text-primary transition-colors hover:font-semibold duration-300">
              <Link href={WEBSITE_HOME} className="py-2 px-4">
                Oversized
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 lg:gap-8">
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
              <Avatar className="cursor-pointer">
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
      {isSearchOpen && <Search isShow={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />}
    </div>
  );
};

export default Header;
