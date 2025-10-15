'use client'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { logo_black, logo_white } from "@/public/image"
import Image from "next/image"
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminSidebarMenu } from "@/lib/adminSidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = () => {
  const {toggleSidebar} = useSidebar()
  return (
    <div>
      <Sidebar className={'z-50 '}>
        <SidebarHeader className={'border-b h-14 p-0'}>
          <div className="flex justify-between items-center px-3">
            <Image src={logo_black} width={logo_black.width} height={50} className="block dark:hidden h-[50px] w-auto" alt="logo dark"></Image>
            <Image src={logo_white} width={logo_white.width} height={50} className="hidden dark:block h-[50px] w-auto" alt="logo white"></Image>
            <Button onClick={toggleSidebar} type='button' size={'icon'} className={'md:hidden cursor-pointer'}>
              <IoMdClose></IoMdClose>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminSidebarMenu.map((menu, index) => (
              <Collapsible key={index} className='group/collapsible'>
                <SidebarMenuItem>
                  {menu.submenu && menu.submenu.length > 0 ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={'font-semibold px-2 py-5 '}>
                        <menu.icon></menu.icon>
                        {menu.title}
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"></LuChevronRight>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <SidebarMenuButton asChild className={'font-semibold px-2 py-5 '}>
                      <Link href={menu?.url} className="flex items-center gap-2">
                        <menu.icon></menu.icon>
                        {menu.title}
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {
                    menu.submenu && menu.submenu.length > 0 &&
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {
                          menu.submenu.map((submenuItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton asChild className={'px-2 py-5'}>
                                <Link href={submenuItem?.url}>
                                  {submenuItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        }
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  }
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}

export default AppSidebar
