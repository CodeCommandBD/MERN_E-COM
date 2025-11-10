import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/Models/Media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            return res(false, 403, 'Unauthorized.')
        }
        await connectDB()

        const payload =  await request.json()
        

        const schema = zSchema.pick({
            _id: true,
            alt: true,
            title: true
          })
       
        const validate = schema.safeParse(payload)
        if(!validate.success){
            return res(false, 400, 'Invalid or missing field.', valid.error)
        }
        const {_id, alt , title} = validate.data
        if(!isValidObjectId(_id)){
            return res(false, 400, 'Invalid object id.')
        }
        const getMedia = await MediaModel.findById(_id)
        if(!getMedia){
            return res(false, 404, 'Media not found.')
        }
        getMedia.alt = alt,
        getMedia.title = title,

        await getMedia.save()

        return res(true, 200, 'Media Updated Successfully.')
    } catch (error) {
        return catchError(error)
    }
}