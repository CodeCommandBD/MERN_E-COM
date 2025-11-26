import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError,  res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";


export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            return res(false, 403, 'Unauthorized.') 
        }
        await connectDB()

        const filter = {    
            deletedAt: null
        }

        const getCategories = await CategoryModel.find(filter).sort({createdAt: -1}).lean()
        if(!getCategories){
            return res(false, 404, 'Collection empty.')
        }

        return res(true, 200, 'Categories found.' , getCategories)
    } catch (error) {
        return catchError(error)
    }
}