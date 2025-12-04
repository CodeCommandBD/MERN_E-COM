"use client";
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import React from 'react'
import { useSelector } from 'react-redux';
import { HiShoppingCart } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { WEBSITE_SHOP } from '@/Routes/WebsiteRoute';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import useFetch from '@/hooks/useFetch';

const Checkout = () => {
  const bredCrumb ={
    title:"Checkout",
    links:[
      {label:"Checkout" },
      
    ]
  }
   const cart = useSelector((state) => state.cartStore);
   const {data: verfiyCartData} = useFetch('/api/cart-verification', 'POST', {data: cart.products})

   console.log(verfiyCartData);
   
  return (
    <div>
        <WebsiteBreadCrumb props={bredCrumb}/>
        {cart.count === 0 ? (
         <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-md mx-auto text-center bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <HiShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              type="button"
              asChild
              className="w-full md:w-auto px-8 py-6 text-base"
            >
              <Link href={WEBSITE_SHOP}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
        ) : (
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
               <div className="w-full lg:w-[68%]">
                
               </div>
               <div className="w-full lg:w-[32%]">
                
               </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Checkout