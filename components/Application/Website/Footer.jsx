import { logo_black } from "@/public/image";
import {
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
} from "@/Routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { TiSocialFacebook } from "react-icons/ti";

const Footer = () => {
  const categories = [
    { name: "T-shirt", href: "/shop?category=t-shirts" },
    { name: "Hoodies", href: "/shop?category=hoodies" },
    { name: "Oversized", href: "/shop?category=oversized" },
    { name: "Full Sleeve", href: "/shop?category=full-sleeve" },
    { name: "Polo", href: "/shop?category=polo" },
  ];

  const usefulLinks = [
    { name: "Home", href: WEBSITE_HOME },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Register", href: WEBSITE_REGISTER },
    { name: "Login", href: WEBSITE_LOGIN },
  ];

  const helpLinks = [
    { name: "My Account", href: "/my-account" },
    { name: "My Orders", href: "/my-orders" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "Return Policy", href: "/return-policy" },
  ];

  const socialLinks = [
    { icon: AiOutlineYoutube, href: "", label: "YouTube" },
    { icon: FaInstagram, href: "", label: "Instagram" },
    { icon: FaWhatsapp, href: "", label: "WhatsApp" },
    { icon: TiSocialFacebook, href: "", label: "Facebook" },
    { icon: FiTwitter, href: "", label: "Twitter" },
  ];

  return (
    <footer className="bg-white border-t-2 border-primary/20 mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2 md:col-span-2">
            <Image
              src={logo_black}
              alt="E-Store Logo"
              width={120}
              height={60}
              className="mb-4"
              style={{ height: "auto" }}
            />
            <p className="text-foreground/70 text-sm leading-relaxed mb-6">
              E-store is your trusted destination for quality and convenience.
              From fashion to essentials, we bring everything you need right to
              your doorstep. Shop smart, live better — only at E-store.
            </p>

            {/* Social Media Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 flex items-center justify-center border-2 border-primary/30 rounded-lg text-primary"
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Links */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-4 uppercase">
              Category
            </h3>
            <div className="w-12 h-0.5 bg-primary mb-4"></div>
            <ul className="space-y-2.5">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.href}
                    className="text-sm text-foreground/70 hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-4 uppercase">
              Useful Links
            </h3>
            <div className="w-12 h-0.5 bg-primary mb-4"></div>
            <ul className="space-y-2.5">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Help */}
          <div>
            <h3 className="text-base font-bold text-foreground mb-4 uppercase">
              Contact Us
            </h3>
            <div className="w-12 h-0.5 bg-primary mb-4"></div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <IoLocationOutline
                  className="text-primary mt-0.5 flex-shrink-0"
                  size={18}
                />
                <span className="text-sm text-foreground/70">
                  E-Store market uttara dhaka 1207
                </span>
              </li>
              <li className="flex items-center gap-2">
                <MdOutlinePhone
                  className="text-primary flex-shrink-0"
                  size={18}
                />
                <Link
                  href="tel:+8801777777777"
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  +8801777777777
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <MdOutlineEmail
                  className="text-primary flex-shrink-0"
                  size={18}
                />
                <Link
                  href="mailto:support@estore.com"
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  support@estore.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t-2 border-primary/20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-foreground/70">
            © 2025{" "}
            <span className="font-semibold text-purple-700">E-Store</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
