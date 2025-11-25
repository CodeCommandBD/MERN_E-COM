import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/Models/category.model";

export async function PUT(request){
    try {
        const auth =  await isAuthenticated('admin')
        if(!auth.isAuth){
            return res(false, 403, 'Unauthorized.')
        }
        await connectDB()
        const payload = await request.json()

        const schema = zSchema.pick({
           _id: true, name: true, slug: true
        })
        const validate = schema.safeParse(payload)
        if(!validate.success){
            return res(false, 400, 'Invalid or missing fields.', validate.error)
        }
        const {_id, name, slug} = validate.data
       
        const getCategory =  await CategoryModel.findOne({deletedAt: null, _id})
        if(!getCategory){
            return res(false, 404, 'Category not found.')
        }
       
        getCategory.name = name
        getCategory.slug = slug
        await getCategory.save()
        return res(true, 200, 'Category updated successfully.')
    } catch (error) {
        return catchError(error)
    }
}