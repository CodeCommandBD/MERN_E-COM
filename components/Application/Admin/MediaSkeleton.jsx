import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const MediaSkeleton = () => {
  return (
    <div className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden'>
      {/* Checkbox skeleton */}
      <div className='absolute top-2 left-2 z-20'>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      
      {/* Menu button skeleton */}
      <div className='absolute top-2 right-2 z-20'>
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
      
      {/* Image skeleton */}
      <div className='w-full'>
        <Skeleton className="w-full sm:h-[200px] h-[150px]" />
      </div>
    </div>
  )
}

const MediaSkeletonGrid = ({ count = 10 }) => {
  return (
    <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
      {Array.from({ length: count }).map((_, index) => (
        <MediaSkeleton key={index} />
      ))}
    </div>
  )
}

export default MediaSkeleton
export { MediaSkeletonGrid }
