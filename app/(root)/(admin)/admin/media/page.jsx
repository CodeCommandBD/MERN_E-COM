'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_DASHBOARD } from '@/Routes/AdminPanelRoute'
import axios from 'axios'
import React, { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import MediaSection from '@/components/Application/Admin/MediaSection'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Media' },
]

const Media = () => {

  const [deleteType, setDeleteType] = useState('SD')
  const [selectedMedia, setSelectedMedia] = useState([])

  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`)
    console.log(response);
    
    return response

  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['delete-data', deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length
      return lastPage.hasMore ? nextPage : undefined
    },
  })

  const handleDelete = () => {

  }
  
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData}></BreadCrumb>
      <Card className='py-0 rounded shadow-sm border'>
        <CardHeader className='pt-3 px-3 pb-1' style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className='flex justify-between items-center'>
            <h4 className='font-semibold text-xl uppercase'>Media</h4>
            <div className='flex items-center gap-5'>
              <UploadMedia></UploadMedia>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {status === 'pending'
            ?
            <div>Loading....</div>
            :
            status === 'error'
              ?
              <div className='text-red-500 text-sm'>
                {error.message}
              </div>
              :
              <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                {
                  data.pages?.map((page, index)=>(
                    <React.Fragment key={index}>
                      {page.mediaData?.map((mediaItem) => (                        
                        <MediaSection 
                        key={mediaItem._id} 
                        className="border rounded p-2"
                        media={mediaItem}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                        >
                                          
                        </MediaSection>
                      ))}
                    </React.Fragment>
                  ))
                }
              </div>
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default Media
