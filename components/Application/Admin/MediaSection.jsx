import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ADMIN_MEDIA_EDIT } from '@/Routes/AdminPanelRoute';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import axios from 'axios'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { FaLink } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { showToast } from '@/lib/showToast';
import ConfirmationDialog from '@/components/Application/ConfirmationDialog';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';



const MediaSection = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia, onChanged }) => {
  const queryClient = useQueryClient();
  const isSelected = selectedMedia.includes(media._id)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(true)
  const [imageError, setImageError] = React.useState(false)
  const handleCheck = () => {
    let newSelectedMedia = []
    if(selectedMedia.includes(media._id)){
      newSelectedMedia = selectedMedia.filter(m => m !== media._id)
    }else{
      newSelectedMedia = [...selectedMedia, media._id]
    }
    setSelectedMedia(newSelectedMedia)
  }
  const handleCopyLink = async(url) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link copied.')
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showToast('success', 'Link copied.')
      }
    }
  }

  const handleDeleteClick = () => {
    if(deleteType === 'PD'){
      setShowConfirmDialog(true)
    } else {
      handleDirectDelete()
    }
  }

  const handleDirectDelete = async () => {
    try {
      setIsDeleting(true)
      const action = deleteType === 'SD' ? 'SD' : 'PD'
      const { data } = await axios.patch('/api/media', { ids: [media._id], action })
      if(!data.success){
        throw new Error(data.message)
      }
      // Only show success toast for soft delete, permanent delete toast is handled by ConfirmationDialog
      if(deleteType === 'SD'){
        showToast('success', data.message)
      }
      
      // Invalidate the media query cache to refresh the media list
      await queryClient.invalidateQueries({ queryKey: ['delete-data'] })
      
      if(typeof onChanged === 'function'){
        await onChanged()
      }
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConfirmDelete = async () => {
    await handleDirectDelete()
    setShowConfirmDialog(false)
  }
  return (
    <div className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden ' suppressHydrationWarning={true}>
      <div className='absolute top-2 left-2 z-20' suppressHydrationWarning={true}>
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
          className={'border-primary cursor-pointer'}
          suppressHydrationWarning={true}
        ></Checkbox>
      </div>
      <div className='absolute top-2 right-2 z-20' suppressHydrationWarning={true}>
        <DropdownMenu suppressHydrationWarning={true}>
          <DropdownMenuTrigger suppressHydrationWarning={true}>
            <span className='w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer' suppressHydrationWarning={true}>
              <BsThreeDotsVertical color='#FFF'></BsThreeDotsVertical>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' suppressHydrationWarning={true}>
            {deleteType === 'SD' &&
              <>
                {isSelected ? (
                  <DropdownMenuItem asChild className='cursor-pointer' suppressHydrationWarning={true}>
                    <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                      <FiEdit3 />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled suppressHydrationWarning={true}>
                    <FiEdit3 />
                    Select image to edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={()=>handleCopyLink(media.secure_url)} className='cursor-pointer' suppressHydrationWarning={true}>
                    <FaLink />
                    Copy Link
                </DropdownMenuItem>
              </>
            }
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={handleDeleteClick}
              disabled={isDeleting}
              suppressHydrationWarning={true}
            >
              <FaTrashAlt color='red' />
              {deleteType === 'SD' ? 'Move Into Trash' : 'Delete Permanently'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className='w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/50 cursor-pointer'
        onClick={handleCheck}
        suppressHydrationWarning={true}
      >

      </div>
      <div suppressHydrationWarning={true} className="relative">
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full sm:h-[200px] h-[150px] z-10" />
        )}
        <Image
          src={media?.secure_url}
          alt={media?.alt || 'Image'}
          height={300}
          width={300}
          className={`object-cover w-full sm:h-[200px] h-[150px] transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          suppressHydrationWarning={true}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false)
            setImageError(true)
          }}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <span className="text-gray-500 text-sm">Failed to load image</span>
          </div>
        )}
      </div>
      
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Permanently"
        description={`Are you sure you want to delete "${media.alt || 'this image'}" permanently? This action cannot be undone.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        confirmToastMessage="Image deleted permanently"
        cancelToastMessage="Deletion cancelled"
      />
    </div>
  )
}

export default MediaSection
