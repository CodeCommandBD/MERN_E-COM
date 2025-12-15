'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
import AdminSearch from './AdminSearch'
import Image from 'next/image'
import { logo_black, logo_white } from '@/public/image'
import AdminMobileSearch from './AdminMobileSearch'

const TopBar = () => {
    const {toggleSidebar} = useSidebar()
    return (
    <div className='fixed border dark:border-t-0 dark:border-r-0 border-l-0 h-14 top-0 left-0 right-0 md:left-64 z-30 px-5 flex justify-between items-center bg-white dark:bg-card box-border'>
        <div className='flex items-center md:hidden'>
            <Image src={logo_black} width={logo_black.width} height={50} className="block dark:hidden h-[50px] w-auto" alt="logo dark"></Image>
            <Image src={logo_white} width={logo_white.width} height={50} className="hidden dark:block h-[50px] w-auto" alt="logo white"></Image>
        </div>
        <div className='md:block hidden '>
            <AdminSearch/>
        </div>
        <div className='flex items-center gap-2'>
            <AdminMobileSearch/>
            <ThemeSwitch></ThemeSwitch>
            <UserDropDown></UserDropDown>
            <Button onClick={toggleSidebar} type='button' size={'icon'} className={'ms-2 md:hidden cursor-pointer'}>
                <RiMenu4Fill></RiMenu4Fill>
            </Button>
        </div>
    </div>
  )
}

export default TopBar
