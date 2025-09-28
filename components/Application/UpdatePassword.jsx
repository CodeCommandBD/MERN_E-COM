'use client'
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { zSchema } from '@/lib/zodSchema'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { z } from 'zod'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/Routes/WebsiteRoute'

const UpdatePassword = ({email}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)

    // TODO:##### Form valid
    // TODO:##### Form valid
    const formSchema = zSchema.pick({
        email: true, password: true,
    }).extend({
        confirmPassword: z.string({ required_error: "Confirm Password is required" }),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"], // error will show under confirmPassword
        message: "Passwords do not match",
    });

    // TODO: ########## Form Define
    // TODO: ########## Form Define
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: '',
            confirmPassword:''
        },
    })
    // TODO: ###### formHandle Submit
    // TODO: ###### formHandle Submit

    const handlePasswordUpdate = async (value) => {
        try {
            setLoading(true)
            const {data: passwordUpdate} = await axios.put('/api/auth/reset-password/update-password', value)
            
            if(!passwordUpdate.success){
                throw new Error(passwordUpdate.message)
            }
            
            form.reset()
            showToast('success', passwordUpdate.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error.message || 'Password update failed. Please try again.')
        }finally{
            setLoading(false)
        }

    }


    return (
        
            <div>
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold'>Update Password</h1>
                    <p>Create new password by filling below form</p>
                </div>
                <div className='mt-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-8">
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className={'relative'}>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="**************" {...field} />
                                            </FormControl>
                                          
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className={'relative'}>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type={isTypePassword ? 'password' : 'text'} placeholder="**************" {...field} />
                                            </FormControl>
                                            <button type='button' className='absolute right-2 top-1/2 cursor-pointer' onClick={() => setIsTypePassword(!isTypePassword)}>
                                                {
                                                    isTypePassword ? <FaRegEyeSlash></FaRegEyeSlash> : <FaRegEye></FaRegEye>
                                                }
                                            </button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <ButtonLoading loading={loading} type={"submit"} text={'Update password'} className={'w-full cursor-pointer duration-300'}></ButtonLoading>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
    )
}

export default UpdatePassword

