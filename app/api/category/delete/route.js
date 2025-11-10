import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";
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

        const category = await CategoryModel.find({_id: {$in: ids}}).lean()
        if(!category.length){
            return res(false, 404, 'Data not found.')
        }
        if(!['SD', 'RSD'].includes(deleteType)){
            return res(false, 400, 'Invalid delete operation. Delete type should be SD or RSD for this route')
        }
        if(deleteType === 'SD'){
            await CategoryModel.updateMany({_id: {$in: ids}}, {$set: {deletedAt: new Date().toISOString()}})
        }else{
            await CategoryModel.updateMany({_id: {$in: ids}}, {$set: {deletedAt: null}}) 
        }

        return res(true, 200, deleteType === 'SD'? 'Data Moved into trash.' : 'Data restored.')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {
    
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

        const Category = await CategoryModel.find({_id: {$in: ids}}).lean()
        if(!Category.length){
            return res(false, 404, 'Data not found.')
        }
        if(deleteType !== 'PD'){
            return res(false, 400, 'Invalid delete operation. Delete type should be PD for this route')
        }
        
        await CategoryModel.deleteMany({_id: {$in: ids}})

        // delete all media from cloudinary

        const publicIds = category.map(m => m.public_id)

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
        return catchError(error)
    }
}