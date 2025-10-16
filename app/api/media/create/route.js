import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/dbConnection";
import { catchError, isAuthenticated, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";

export async function POST(request) {
    let payload
    try {
        payload = await request.json()
        if(!Array.isArray(payload) || payload.length === 0){
            return res(false, 400, 'Invalid payload')
        }
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return(res(false, 403, 'Unauthorized'))
        }
        await connectDB()
        const newMedia =  await MediaModel.insertMany(payload)
        return res(true, 200, 'Media upload successfully', newMedia)
    } catch (error) {
        // Attempt cleanup on Cloudinary if DB insert failed
        if(payload && Array.isArray(payload) && payload.length > 0){
            const publicIds = payload.map(data => data.public_id )
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return catchError(error)
    }
}