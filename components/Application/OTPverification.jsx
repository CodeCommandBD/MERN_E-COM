import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { ButtonLoading } from './ButtonLoading'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const OTPVerification = ({ email, onSubmit, loading, onResend }) => {
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendKey, setResendKey] = useState(0) // Key to force re-render
    const [submitting, setSubmitting] = useState(false)

    const formSchema = zSchema.pick({
        otp: true, email: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: '',
            email: email
        }
    })

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleResendOTP = async () => {
        try {
            setResendLoading(true)
            const { data: response } = await axios.post('/api/auth/resend-otp', { email })
            
            if (response.success) {
                setTimeLeft(300) // Reset to 5 minutes
                setCanResend(false)
                setResendKey(prev => prev + 1) // Force re-render
                showToast('success', 'New OTP sent to your email')
                // Reset form with proper values
                form.reset({ 
                    otp: '', 
                    email: email 
                })
            } else {
                showToast('error', response.message || 'Failed to resend OTP')
            }
        } catch (error) {
            console.error('resend otp error:', error)
            showToast('error', 'Failed to resend OTP. Please try again.')
        } finally {
            setResendLoading(false)
        }
    }

    const handleOtpVerification = async (value) => {
        const otpValue = (value?.otp ?? form.getValues('otp') ?? '').toString().trim()
        const payload = {
            otp: otpValue,
            email: value?.email ?? email ?? form.getValues('email')
        }

        // Basic validation
        if (!otpValue || !/^\d{6}$/.test(otpValue)) {
            showToast('error', 'Please enter a valid 6-digit OTP.')
            return
        }

        try {
            setSubmitting(true)

            // If parent provided onSubmit, delegate and respect its result
            if (typeof onSubmit === 'function') {
                await onSubmit(payload)
                showToast('success', 'OTP verified successfully')
                form.reset({ otp: '', email })
                return
            }

            // Fallback: call internal API
            const { data: response } = await axios.post('/api/auth/verify-otp', payload)

            if (response && response.success) {
                showToast('success', response.message || 'OTP verified successfully')
                form.reset({ otp: '', email })
            } else {
                showToast('error', response?.message || 'Invalid or expired OTP')
            }
        } catch (error) {
            console.error('OTP verification error:', error)
            showToast('error', 'Failed to verify OTP. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <div className='text-center space-y-2 mb-5'>
                <h1 className='text-3xl font-bold'>Verify Your Device</h1>
                <p>Enter the 6-digit code sent to {email}</p>
                
                {/* Timer and Expiry Warning */}
                <div className='mt-3'>
                    {timeLeft > 0 ? (
                        <div className={`text-sm ${timeLeft <= 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {timeLeft <= 60 ? '⚠️ OTP expires in ' : 'Code expires in '}
                            <span className='font-mono font-bold'>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        <div className='text-red-600 text-sm font-semibold'>
                            ⚠️ OTP has expired
                        </div>
                    )}
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8">
                    <div className='mb-5'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter OTP Code</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <InputOTP key={resendKey} maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='space-y-3'>
                        <ButtonLoading 
                            loading={loading || submitting} 
                            type={"submit"} 
                            text={'Verify OTP'} 
                            className={'w-full cursor-pointer duration-300'}
                            disabled={timeLeft === 0}
                        />
                        
                        {/* Resend OTP Button */}
                        <div className='text-center'>
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendLoading}
                                    className="text-primary hover:underline text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Resend OTP in {formatTime(timeLeft)}
                                </p>
                            )}
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default OTPVerification
