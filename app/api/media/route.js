import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import MediaModel from "@/Models/Media.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth  = await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized')
        }
        await connectDB()
        const searchParams  = request.nextUrl.searchParams;
        const page  = parseInt(searchParams.get('page'),10) || 0
        const limit  = parseInt(searchParams.get('limit'),10) || 10
        const deleteType  = searchParams.get('deleteType')  // 'SD' | 'PD' | undefined
        // SD = show non-deleted, PD = show trashed
        let filter = {}
        if(deleteType === 'SD'){
            filter = { deletedAt: null }
        } else if(deleteType === 'PD'){
            filter = { deletedAt: { $ne: null } }
        }
        const mediaData =  await MediaModel.find(filter)
        .sort({createdAt: -1})
        .skip(page * limit)
        .limit(limit)
        .lean()
        const totalMedia =  await MediaModel.countDocuments(filter)

        return NextResponse.json({
            mediaData: mediaData,
            hasMore: ((page + 1) * limit) < totalMedia 
        })
    } catch (error) {
        return catchError(error)
    }
}

export async function PATCH(request){
    try {
        const auth  = await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized')
        }
        await connectDB()
        const body = await request.json()
        const ids = Array.isArray(body?.ids) ? body.ids : []
        const action = body?.action // 'SD' | 'RSD' | 'PD'
        if(ids.length === 0 || !action){
            return res(false, 400, 'Invalid request payload')
        }
        if(action === 'SD'){
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date() } })
            return res(true, 200, 'Moved to trash successfully')
        }
        if(action === 'RSD'){
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
            return res(true, 200, 'Restored from trash successfully')
        }
        if(action === 'PD'){
            await MediaModel.deleteMany({ _id: { $in: ids } })
            return res(true, 200, 'Deleted permanently')
        }
        return res(false, 400, 'Unknown action')
    } catch (error) {
        return catchError(error)
    }
}