import { connectDB } from "@/lib/dbConnection";
import { catchError,  res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";

export async function GET() {
    try {
       
        await connectDB()
        const getCategory = await CategoryModel.find({deletedAt: null}).lean()
        if(!getCategory){
            return res(false, 404, 'Category not found.')
        }
        return res(true, 200, 'Category found.' , getCategory)
    } catch (error) {
        return catchError(error)
    }
}