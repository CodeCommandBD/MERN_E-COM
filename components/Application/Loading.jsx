import { loader } from '@/public/image'
import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-start mt-12'>
      <Image src={loader.src} height={80} width={80} alt='loader'></Image>
    </div>
  )
}

export default Loading
