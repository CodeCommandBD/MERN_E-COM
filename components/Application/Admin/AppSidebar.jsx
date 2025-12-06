"use client";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import { logo_black, logo_white } from "@/public/image";
import Image from "next/image";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminSidebarMenu } from "@/lib/adminSidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/reducer/authReducer";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";

const AppSidebar = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);
  const auth = useSelector((store) => store.authStore.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Check if admin user still exists in database
  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("/api/auth/logout");
      } catch (err) {
        console.error("Logout API failed", err);
      }
      dispatch(logout());
      router.push(WEBSITE_LOGIN);
    };

    const checkAdminExists = async () => {
      // If no auth ID is found after hydration (handled by PersistGate),
      // it means the session is invalid or desynchronized (cookie exists but store is empty).
      // We must redirect to login.
      if (!auth?._id) {
        await performLogout();
        return;
      }

      try {
        const response = await axios.get(`/api/user/${auth._id}`);
        const userData = response.data?.data;

        // Check if user exists and has admin role
        if (!response.data.success || !userData || userData.role !== "admin") {
          await performLogout();
          return;
        }
      } catch (error) {
        // If 404 (Not Found) or 401/403 (Unauthorized), logout immediately
        // Also handling generic errors if user can't be verified
        await performLogout();
      }
    };

    // Check immediately and then every 30 seconds
    checkAdminExists();
    const interval = setInterval(checkAdminExists, 30000);
    return () => clearInterval(interval);
  }, [auth?._id, dispatch, router]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for unread messages every 10 seconds
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("/api/support/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <div>
      <Sidebar className={"z-50 "}>
        <SidebarHeader className={"border-b h-14 p-0"}>
          <div className="flex justify-between items-center px-3">
            <Image
              src={logo_black}
              width={logo_black.width}
              height={50}
              className="block dark:hidden h-[50px] w-auto"
              alt="logo dark"
            ></Image>
            <Image
              src={logo_white}
              width={logo_white.width}
              height={50}
              className="hidden dark:block h-[50px] w-auto"
              alt="logo white"
            ></Image>
            <Button
              onClick={toggleSidebar}
              type="button"
              size={"icon"}
              className={"md:hidden cursor-pointer"}
            >
              <IoMdClose></IoMdClose>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminSidebarMenu.map((menu, index) => (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  {menu.submenu && menu.submenu.length > 0 ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className={"font-semibold px-2 py-5 "}>
                        <menu.icon></menu.icon>
                        {menu.title}
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"></LuChevronRight>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={"font-semibold px-2 py-5 "}
                    >
                      <Link
                        href={menu?.url}
                        onClick={handleLinkClick}
                        className="flex items-center gap-2 w-full"
                      >
                        <menu.icon></menu.icon>
                        <span className="flex-1">{menu.title}</span>
                        {menu.title === "Support" && unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {menu.submenu && menu.submenu.length > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.submenu.map((submenuItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton
                              asChild
                              className={"px-2 py-5"}
                            >
                              <Link
                                href={submenuItem?.url}
                                onClick={handleLinkClick}
                              >
                                {submenuItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
