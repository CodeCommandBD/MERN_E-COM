"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";


const LogOutButton = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogOut = async () =>{
        try {
            const {data: logoutResponse} = await axios.post('/api/auth/logout')
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast('success', logoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <DropdownMenuItem onClick={handleLogOut} className='cursor-pointer '>
           <FiLogOut color="red" />
            LogOut
        </DropdownMenuItem>
    )
}

export default LogOutButton
