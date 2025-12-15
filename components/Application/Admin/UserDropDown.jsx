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
import LogOutButton from "./LogOutButton";

const UserDropDown = () => {
    const auth = useSelector((store) => store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                sideOffset={10}
                collisionPadding={16}
                className={'w-44 max-w-[min(11rem,calc(100vw-2rem))]'}
            >
                <DropdownMenuLabel className="pb-2">
                    <p className="font-semibold text-sm truncate">{auth?.name}</p>
                    <span className="font-normal text-xs block truncate text-muted-foreground">{auth?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
               <LogOutButton></LogOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropDown
