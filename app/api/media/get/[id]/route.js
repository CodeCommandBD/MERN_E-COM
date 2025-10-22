import { connectDB } from "@/lib/dbConnection";
import { catchError, isAuthenticated, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import { isValidObjectId } from "mongoose";

export async function GET(params) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            return res(false, 403, 'Unauthorized.')
        }
        await connectDB()

        const getParams  = await params 
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if(!isValidObjectId(id)){
            return res(false, 400, 'Invalid object id.')
        }
        filter._id = id
        const getMedia = await MediaModel.findOne(filter).lean()
        if(!getMedia){
            return res(false, 404, 'Media not found.')
        }
        return res(true, 200, 'Media found.' , getMedia)
    } catch (error) {
        return catchError(error)
    }
}