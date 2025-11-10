import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/Models/category.model";

export async function POST(request){
    try {
        const auth =  await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized.')
        }
        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
            name: true, slug: true
        })
        const validate = schema.safeParse(payload)
        if(!validate.success){
            return res(false, 400, 'Invalid or missing fields.', validate.error)
        }
        const {name, slug} = validate.data
        const newCategory = new CategoryModel({
            name, slug
        })
        await newCategory.save()

        return res(true, 200, 'Category added successfully.')
    } catch (error) {
        return catchError(error)
    }
}