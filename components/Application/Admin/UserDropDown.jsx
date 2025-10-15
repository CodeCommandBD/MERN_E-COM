"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const UserDropDown = () => {
    const auth = useSelector((store) => store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'me-5 w-44'}>
                <DropdownMenuLabel>
                    <p className="font-semibold">{auth?.name}</p>
                    <span className="font-normal text-sm">{auth?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={''} className="cursor-pointer">
                        <IoShirtOutline></IoShirtOutline>
                        New Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={''} className="cursor-pointer">
                        <MdOutlineShoppingBag></MdOutlineShoppingBag>
                        Orders
                    </Link>
                </DropdownMenuItem>
               <LogOutButton></LogOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropDown
