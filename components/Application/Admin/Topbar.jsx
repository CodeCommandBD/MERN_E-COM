'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
import AdminSearch from './AdminSearch'

const TopBar = () => {
    const {toggleSidebar} = useSidebar()
    return (
    <div className='fixed border h-14 w-full top-0 left-0 z-30 md:pl-72 md:pr-10 px-5 flex justify-between items-center bg-white dark:bg-card'>
        <div>
            <AdminSearch/>
        </div>
        <div className='flex items-center gap-2'>
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
