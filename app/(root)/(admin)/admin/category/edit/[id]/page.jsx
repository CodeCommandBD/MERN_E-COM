'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/Routes/AdminPanelRoute'
import React, { use, useEffect, useState } from 'react'
import { ButtonLoading } from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import slugify from 'slugify'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import useFetch from '@/hooks/useFetch'

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
    label: "Edit Category"
  },

]

const EditCategory = ({params}) => {
  const {id} = use(params)

  const {data: categoryData} = useFetch(`/api/category/get/${id}`)

  const [loading, setLoading] = useState(false)

   // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema.pick({
      _id: true, name: true, slug: true
  })
  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: '',
      slug: '',
    },
  })

  useEffect(()=>{
    if(categoryData && categoryData.success){
      const data = categoryData.data
      form.reset({
          _id: data?._id,
          name: data?.name,
          slug: data?.slug
      })
    
    }
  },[categoryData])

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
      const {data: response} = await axios.put(`/api/category/update`, value)
      if(!response.success){
        throw new Error(response.message)
      }
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border' suppressHydrationWarning={true}>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }} suppressHydrationWarning={true}>
          <h4 className='text-xl font-semibold'>Edit Category</h4>
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
            
              <div>
                <ButtonLoading loading={loading} type={"submit"} text={'Update Category'} className={'cursor-pointer duration-300'}></ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCategory

