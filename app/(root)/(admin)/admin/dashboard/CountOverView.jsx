"use client";
import useFetch from "@/hooks/useFetch";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_CUSTOMER_SHOW,
  ADMIN_PRODUCT_SHOW,
} from "@/Routes/AdminPanelRoute";
import Link from "next/link";
import React from "react";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineShoppingCart } from "react-icons/md";

const CountOverView = () => {
  const { data: count } = useFetch("/api/dashboard/admin/count");

  React.useEffect(() => {
    // Trigger auto-confirm for orders > 12h
    const triggerAutoConfirm = async () => {
      try {
        await fetch("/api/cron/auto-confirm");
      } catch (err) {}
    };
    triggerAutoConfirm();
  }, []);

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2  sm:gap-10 gap-5">
      <Link href={ADMIN_CATEGORY_SHOW}>
        <div className="flex items-center justify-between p-3 border border-l-4 border-l-green-400 rounded-lg bg-white dark:bg-card dark:border-gray-800 dark:border-l-green-400 dark:text-white">
          <div>
            <h4 className="text-md font-medium text-gray-500 dark:text-gray-300">
              Total categories
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {count?.data?.category || 0}
            </p>
          </div>
          <div>
            <span className="w-12 h-12 border rounded-full flex items-center justify-center bg-green-500 text-white">
              <BiCategory />
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_PRODUCT_SHOW}>
        <div className="flex items-center justify-between p-3 border border-l-4 border-l-blue-400 rounded-lg bg-white dark:bg-card dark:border-gray-800 dark:border-l-blue-400 dark:text-white">
          <div>
            <h4 className="text-md font-medium text-gray-500 dark:text-gray-300">
              Total products
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {count?.data?.product || 0}
            </p>
          </div>
          <div>
            <span className="w-12 h-12 border rounded-full flex items-center justify-center bg-blue-500 text-white">
              <IoShirtOutline />
            </span>
          </div>
        </div>
      </Link>
      <Link href={ADMIN_CUSTOMER_SHOW}>
        <div className="flex items-center justify-between p-3 border border-l-4 border-l-yellow-400 rounded-lg bg-white dark:bg-card dark:border-gray-800 dark:border-l-yellow-400 dark:text-white">
          <div>
            <h4 className="text-md font-medium text-gray-500 dark:text-gray-300">
              Total customers
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {count?.data?.customer || 0}
            </p>
          </div>
          <div>
            <span className="w-12 h-12 border rounded-full flex items-center justify-center bg-yellow-500 text-white">
              <LuUserRound />
            </span>
          </div>
        </div>
      </Link>
      <Link href={"/admin/orders"}>
        <div className="flex items-center justify-between p-3 border border-l-4 border-l-cyan-400 rounded-lg bg-white dark:bg-card dark:border-gray-800 dark:border-l-cyan-400 dark:text-white">
          <div>
            <h4 className="text-md font-medium text-gray-500 dark:text-gray-300">
              Total orders
            </h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {count?.data?.order || 0}
            </p>
          </div>
          <div>
            <span className="w-12 h-12 border rounded-full flex items-center justify-center bg-cyan-500 text-white">
              <MdOutlineShoppingCart />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CountOverView;
