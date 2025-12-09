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
        const uploadedFiles = files.filter(file => file.uploadInfo).map(file => {
            // Try multiple ways to get the original filename
            const uploadInfo = file.uploadInfo;
            const filename = uploadInfo.original_filename || 
                           uploadInfo.display_name || 
                           uploadInfo.public_id ||
                           file.name ||
                           'unknown';
            
            console.log('File upload info:', {
                original_filename: uploadInfo.original_filename,
                display_name: uploadInfo.display_name,
                public_id: uploadInfo.public_id,
                file_name: uploadInfo.file_name,
                extracted_filename: filename,
                full_uploadInfo: uploadInfo
            });
            
            return {
                asset_id: uploadInfo.asset_id,
                public_id: uploadInfo.public_id,
                secure_url: uploadInfo.secure_url,
                path: uploadInfo.path,
                thumbnail_url: uploadInfo.thumbnail_url,
                filename: filename,
            };
        })
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
