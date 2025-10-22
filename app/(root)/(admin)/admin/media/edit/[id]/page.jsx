'use client'
import Breadcrumb from '@/components/Application/Breadcrumb'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/Routes/AdminPanelRoute'
import React, { use } from 'react'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media"
  },
  {
    href: '',
    label: "Edit Media"
  },
]

const EditPage = ({ params }) => {
  const { id } = use(params)
  const { data: mediaData } = useFetch(`/api/media/get/${id}`)


   // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(3, 'Password is required & must be at least 3 characters!')
  })

  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })


  const handleLoginSubmit = async (value) => {
    try {
      setLoading(true)
      const { data: registerResponse } = await axios.post('/api/auth/login', value)
      if (!registerResponse.success) {
        throw new Error(registerResponse.message)
      }
      
      // If login successful and OTP is required
      if (registerResponse.message === 'Please verify your device') {
        setOtpEmail(value.email)
        setShowOTP(true)
        showToast('success', 'OTP sent to your email')
      } else {
        // Login successful without OTP - dispatch user data
        if (registerResponse.data) {
          dispatch(login(registerResponse.data))
        }
        form.reset()
        showToast('success', registerResponse.message)
      }
    } catch (error) {
      showToast('error', error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Breadcrumb data={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <h4 className='text-xl font-semibold'>Edit Media</h4>
        </CardHeader>
        <CardContent className={'py-5'} suppressHydrationWarning={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-8">
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
                <ButtonLoading loading={loading} type={"submit"} text={'Login'} className={'w-full cursor-pointer duration-300'}></ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditPage
