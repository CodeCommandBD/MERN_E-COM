import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import TopBar from '@/components/Application/Admin/Topbar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div>
      <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSidebar />
          <main className=' md:w-[calc(100vw-16rem)]'>
            <div className='px-8 pt-18 min-h-[calc(100vh-40px)] pb-10'>
              {/* <SidebarTrigger></SidebarTrigger> */}
              <TopBar></TopBar>
              {children}
            </div>
            <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-shadow-md'>
              &copy; 2025 Developer SHANTO<sup style={{ fontSize: '0.3em' }}>TM</sup>.{'  '}All Rights Reserved.
            </div>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  )
}

export default layout
