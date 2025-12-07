'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/Routes/AdminPanelRoute'
import React, { useEffect, useState } from 'react'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import slugify from 'slugify'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import PageLoader from '@/components/Application/Admin/PageLoader'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: "Category"
  },
  {
    href: '',
    label: "Add Category"
  },

]

const AddCategory = () => {
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader initially and hide it after component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

   // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
    name: true, slug: true
  })
  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  useEffect(()=>{
    const name = form.getValues('name')
    if(name){
      form.setValue('slug', slugify(name).toLowerCase())
    }
  },[form.watch('name')])

  const onSubmit = async (value) => {
    // TODO: Implement category submission
    setLoading(true)
    try {
      const {data: response} = await axios.post('/api/category/create', value)
      if(!response.success){
        throw new Error(response.message)
      }
      form.reset()
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading Add Category..." />;
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <h4 className='text-xl font-semibold'>Add Category</h4>
        </CardHeader>
        <CardContent className={'py-5'} suppressHydrationWarning={true}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder="Enter Category Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder="Enter Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            
              <div className="mt-5">
                <ButtonLoading loading={loading} type={"submit"} text={'Add Category'} className={'cursor-pointer duration-300'}></ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory
