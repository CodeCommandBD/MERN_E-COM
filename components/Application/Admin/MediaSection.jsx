import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";

const MediaSection = ({media, handleDelete, deleteType, selectedMedia, setSelectedMedia}) => {
  const handleCheck = () =>{

  }
  return (
    <div className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden '>
      <div className='absolute top-2 left-2 z-20'>
        <Checkbox 
            checked={selectedMedia.includes(media._id)}
            onCheckedChange={handleCheck}
            className={'border-primary'}
        ></Checkbox>
      </div>
      <div className='absolute top-2 right-2 z-20'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className='w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer'>
                <BsThreeDotsVertical color='#FFF'></BsThreeDotsVertical>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {deleteType === 'SD' && 
                <>
                  <DropdownMenuItem asChild>
                      <Link href={}></Link>
                  </DropdownMenuItem>
                </>
              }
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      <div className='w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/50'>

      </div>
      <div>
        <Image 
        src={media?.secure_url}
        alt={media?.alt || 'Image'}
        height={300}
        width={300}
        className='object-cover w-full sm:h-[200px] h-[150px]'
        ></Image>
      </div>
    </div>
  )
}

export default MediaSection
