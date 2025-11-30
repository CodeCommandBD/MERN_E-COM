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
  return (
    <div>
      <footer className="bg-gray-50 border-t border-gray-200 mt-5">
        <div className="text-gray-600 py-4 px-4 lg:py-12 lg:px-32 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-1 md:col-span-2 col-span-1">
              <Image src={logo_black} alt="Logo" width={100} height={100} />
              <p className="w-full my-2">
                E-store is your trusted destination for quality and convenience.
                From fashion to essentials, we bring everything you need right
                to your doorstep. Shop smart, live better — only at E-store
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-5 uppercase">Category</h2>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <Link href="/">T-shirt</Link>
                </li>
                <li>
                  <Link href="/">Hoodies</Link>
                </li>
                <li>
                  <Link href="/">Oversized</Link>
                </li>
                <li>
                  <Link href="/">Full Sleeve</Link>
                </li>
                <li>
                  <Link href="/">Polo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-5 uppercase">
                Userfull Links
              </h2>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <Link href={WEBSITE_HOME}>Home</Link>
                </li>
                <li>
                  <Link href={""}>Shop</Link>
                </li>
                <li>
                  <Link href={""}>About</Link>
                </li>
                <li>
                  <Link href={WEBSITE_REGISTER}>Register</Link>
                </li>
                <li>
                  <Link href={WEBSITE_LOGIN}>Login</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-5 uppercase">Help Center</h2>
              <ul className="text-gray-600 space-y-2">
                <li>
                  <Link href={""}>Register</Link>
                </li>
                <li>
                  <Link href={""}>Login</Link>
                </li>
                <li>
                  <Link href={""}>My Account</Link>
                </li>
                <li>
                  <Link href={""}>Privacy Policy</Link>
                </li>
                <li>
                  <Link href={""}>Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-5 uppercase">Contact Us</h2>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <IoLocationOutline className="inline-block mr-2 text-xl" />
                  <span className="text-sm">
                    E-Store market uttara dhaka 1207
                  </span>
                </li>
                <li className="flex items-center">
                  <MdOutlinePhone className="inline-block mr-2 text-xl" />
                  <Link href={"tel:+8801777777777"}>
                    <span className="text-sm">+8801777777777</span>
                  </Link>
                </li>
                <li className="flex items-center">
                  <MdOutlineEmail className="inline-block mr-2 text-xl" />
                  <Link href={"mailto:support@estore.com"}>
                    <span className="text-sm">support@estore.com</span>
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-2 mt-5">
                <Link href={""}>
                  <AiOutlineYoutube
                    size={25}
                    className="text-xl text-gray-600 hover:text-primary transition-all duration-300"
                  />
                </Link>
                <Link href={""}>
                  <FaInstagram
                    size={25}
                    className="text-xl text-gray-600 hover:text-primary transition-all duration-300"
                  />
                </Link>
                <Link href={""}>
                  <FaWhatsapp
                    size={25}
                    className="text-xl text-gray-600 hover:text-primary transition-all duration-300"
                  />
                </Link>
                <Link href={""}>
                  <TiSocialFacebook
                    size={25}
                    className="text-xl text-gray-600 hover:text-primary transition-all duration-300"
                  />
                </Link>
                <Link href={""}>
                  <FiTwitter
                    size={25}
                    className="text-xl text-gray-600 hover:text-primary transition-all duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-5 bg-gray-100 ">
          <p className="text-gray-600  text-md font-semibold ">
            © 2025 E-Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
