import { loader } from '@/public/image'
import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div 
      className='h-screen w-screen flex justify-center items-start mt-12'
      suppressHydrationWarning={true}
    >
      <Image 
        src={loader.src} 
        height={80} 
        width={80} 
        alt='loader'
        suppressHydrationWarning={true}
      />
    </div>
  )
}

export default Loading
