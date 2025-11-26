import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError,  res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            return res(false, 403, 'Unauthorized.') 
        }
        await connectDB()

        const id = params.id

        const filter = {
            deletedAt: null
        }

        if(!isValidObjectId(id)){
            return res(false, 400, 'Invalid object id.')
        }
        filter._id = id
        const getCategory = await CategoryModel.findOne(filter).lean()
        if(!getCategory){
            return res(false, 404, 'Category not found.')
        }
        return res(true, 200, 'Category found.' , getCategory)
    } catch (error) {
        return catchError(error)
    }
}