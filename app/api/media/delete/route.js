import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/dbConnection";
import { catchError, isAuthenticated, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import mongoose from "mongoose";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()

        const ids =  payload.ids || []
        const deleteType = payload.deleteType

        if(!Array.isArray(ids) || ids.length === 0){
            return res(false, 400, 'Invalid or empty id list.')
        }

        const media = await MediaModel.find({_id: {$in: ids}}).lean()
        if(!media.length){
            return res(false, 404, 'Data not found.')
        }
        if(!['SD', 'RSD'].includes(deleteType)){
            return res(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route')
        }
        if(deleteType === 'SD'){
            await MediaModel.updateMany({_id: {$in: ids}}, {$set: {deletedAt: new Date().toISOString()}})
        }else{
            await MediaModel.updateMany({_id: {$in: ids}}, {$set: {deletedAt: null}}) 
        }

        return res(true, 200, deleteType === 'SD'? 'Data Moved into trash.' : 'Data restored.')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()

        const ids =  payload.ids || []
        const deleteType = payload.deleteType

        if(!Array.isArray(ids) || ids.length === 0){
            return res(false, 400, 'Invalid or empty id list.')
        }

        const media = await MediaModel.find({_id: {$in: ids}}).session(session).lean()
        if(!media.length){
            return res(false, 404, 'Data not found.')
        }
        if(deleteType !== 'PD'){
            return res(false, 400, 'Invalid delete operation. Delete type should be PD for this route')
        }
        
        await MediaModel.deleteMany({_id: {$in: ids}}).session(session)

        // delete all media from cloudinary

        const publicIds = media.map(m => m.public_id)

        try {
            await cloudinary.api.delete_resources(publicIds)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            return catchError(error)
        }

        await session.commitTransaction()
        session.endSession()

        return res(true, 200, 'Data deleted permanently')

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return catchError(error)
    }
}