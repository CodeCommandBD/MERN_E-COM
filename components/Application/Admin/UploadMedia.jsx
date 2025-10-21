'use client'
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/showToast';
import { CldUploadWidget } from 'next-cloudinary';
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';


const UploadMedia = ({ isMultiple }) => {
    const queryClient = useQueryClient();
    
    const handleOnError = (error) => {
        console.error('Cloudinary upload error:', error);
        showToast('error', error.message || error.statusText || 'Upload failed')
    }
    const handleOnQueueEnd = async (results) => {
        const files = results.info.files 
        const uploadedFiles = files.filter(file => file.uploadInfo).map(file => ({
            asset_id: file.uploadInfo.asset_id,
            public_id: file.uploadInfo.public_id,
            secure_url: file.uploadInfo.secure_url,
            path: file.uploadInfo.path,
            thumbnail_url: file.uploadInfo.thumbnail_url,
        }))
        if(uploadedFiles.length > 0 ){
            try {
                const{data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)
                if(!mediaUploadResponse.success){
                    throw new Error(mediaUploadResponse.message)
                }
                showToast('success', mediaUploadResponse.message)
                
                // Invalidate the media query cache to refresh the media list
                await queryClient.invalidateQueries({ queryKey: ['delete-data'] })
            } catch (error) {
                showToast('error', error.message)
            }
        }
    }
    return (
        <CldUploadWidget
            signatureEndpoint='/api/cloudinary-signature'
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueueEnd}
            config={{
                cloud: {
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }
            }}
            options={{
                multiple: isMultiple,
                sources: ['local', 'url', 'unsplash', 'google_drive']
            }}
        >
            {({ open }) => {
                return (
                    <Button className="button" onClick={() => open()}>
                         <FaPlus />
                         Upload Media
                    </Button>
                );
            }}
        </CldUploadWidget>
    )
}

export default UploadMedia
