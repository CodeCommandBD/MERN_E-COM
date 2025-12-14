'use client'
import { Card, CardContent } from '@/components/ui/card'
import { logo_black } from '@/public/image'
import Image from 'next/image'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { zSchema } from '@/lib/zodSchema'


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
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/Routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPverification'
import UpdatePassword from '@/components/Application/UpdatePassword'


const ResetPassword = () => {
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const [showOTP, setShowOTP] = useState(false)
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [isOtpVerify, setIsOtpVerify] = useState(false)
    const formSchema = zSchema.pick({
        email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })
    const handleEmailVerification = async (value) => {
        try {
            setEmailVerificationLoading(true)
            setOtpEmail(value.email)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', {
                email: value.email
            })

            if (sendOtpResponse.success) {
                showToast('success', 'OTP sent to your email!')
                setShowOTP(true)
                form.reset()
            } else {
                showToast('error', sendOtpResponse.message)
            }
        } catch (error) {
            showToast('error', 'Failed to send OTP')
        } finally {
            setEmailVerificationLoading(false)
        }
    }
    const handleOtpVerification = async (otpData) => {
        try {

            setOtpLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', {
                email: otpEmail,
                otp: otpData.otp
            })

            if (otpResponse.success) {
                showToast('success', 'OTP verified successfully!')
                setIsOtpVerify(true)
                form.reset()

            } else {
                showToast('error', otpResponse.message)
            }
        } catch (error) {
            showToast('error', 'OTP verification failed')
        } finally {
            setOtpLoading(false)
        }
    }
    return (
        <div>
            <Card className='w-[400px]'>
                <CardContent>
                    <div className='flex justify-center mb-3'>
                        <Image src={logo_black} width={logo_black.width} height={logo_black.height} alt='logo' className='max-w-[150px]'></Image>
                    </div>
                    {
                        !showOTP ?
                            <>
                                <div className='text-center space-y-2'>
                                    <h1 className='text-3xl font-bold'>Reset Password</h1>
                                    <p>Enter your email for password reset</p>
                                </div>
                                <div className='mt-5'>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-8">
                                            <div className='mb-5'>
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input type='email' placeholder="Example@gmail.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div>
                                                <ButtonLoading loading={emailVerificationLoading} type={"submit"} text={'Send OTP'} className={'w-full cursor-pointer duration-300'}></ButtonLoading>
                                            </div>
                                            <div className='text-center'>
                                                <div className='flex items-center gap-1.5'>

                                                    <Link href={WEBSITE_LOGIN} className='text-primary hover:underline'>Back To Login</Link>
                                                </div>

                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </>
                            :
                            <>
                            {
                                !isOtpVerify ? 
                                <OTPVerification email={otpEmail} loading={otpLoading} onSubmit={handleOtpVerification}></OTPVerification>
                                :
                                <UpdatePassword email={otpEmail}></UpdatePassword>
                            }
                            </>
                    }

                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword

// EOF