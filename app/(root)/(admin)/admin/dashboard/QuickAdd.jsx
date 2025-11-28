import { ADMIN_CATEGORY_ADD, ADMIN_COUPON_ADD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD } from '@/Routes/AdminPanelRoute'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from 'react-icons/ri';

const QuickAdd = () => {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2  sm:gap-10 gap-5 mt-10">
      <Link href={ADMIN_CATEGORY_ADD}>
            <div className='flex items-center justify-between p-3 border border-l-4 border-l-green-400 rounded-lg bg-gradient-to-br from-green-400 via-green-500 to-green-600 dark:bg-card dark:border-gray-800 dark:border-l-green-400 dark:text-white'>
                <h4 className='font-medium text-white dark:text-black'>Add Category</h4>
                <span className='w-12 h-12 dark:border-green-800 border-green-400 border rounded-full flex items-center justify-center text-white dark:text-black'><BiCategory size={20} /></span>
            </div>
      </Link>
      <Link href={ADMIN_PRODUCT_ADD}>
            <div className='flex items-center justify-between p-3 border border-l-4 border-l-blue-400 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:bg-card dark:border-gray-800 dark:border-l-blue-400 dark:text-white'>
                <h4 className='font-medium text-white dark:text-black'>Add Product</h4>
                <span className='w-12 h-12 dark:border-blue-800 border-blue-400 border rounded-full flex items-center justify-center text-white dark:text-black'><IoShirtOutline size={20} /></span>
            </div>
      </Link>
      <Link href={ADMIN_COUPON_ADD}>
            <div className='flex items-center justify-between p-3 border border-l-4 border-l-yellow-400 rounded-lg bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 dark:bg-card dark:border-gray-800 dark:border-l-yellow-400 dark:text-white'>
                <h4 className='font-medium text-white dark:text-black'>Add Coupon</h4>
                <span className='w-12 h-12 dark:border-yellow-800 border-yellow-400 border rounded-full flex items-center justify-center text-white dark:text-black'><RiCoupon2Line size={20} /></span>
            </div>
      </Link>
      <Link href={ADMIN_MEDIA_SHOW}>
            <div className='flex items-center justify-between p-3 border border-l-4 border-l-cyan-400 rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 dark:bg-card dark:border-gray-800 dark:border-l-cyan-400 dark:text-white'>
                <h4 className='font-medium text-white dark:text-black'> Upload Media</h4>
                <span className='w-12 h-12 dark:border-cyan-800 border-cyan-400 border rounded-full flex items-center justify-center text-white dark:text-black'><MdOutlinePermMedia size={20} /></span>
            </div>
      </Link>
    </div>
  )
}

export default QuickAdd