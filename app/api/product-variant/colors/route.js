import { connectDB } from "@/lib/dbConnection";
import { catchError,  res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";

export async function GET() {
    try {
       
        await connectDB()
        const getColors = await ProductVariantModel.distinct('color').lean()
        if(!getColors){
            return res(false, 404, 'Colors not found.')
        }
        return res(true, 200, 'Colors found.' , getColors)
    } catch (error) {
        return catchError(error)
    }
}