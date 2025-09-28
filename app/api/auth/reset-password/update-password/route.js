import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/Models/user.models";

export async function PUT(req){
    try {
        await connectDB()
        const payload = await req.json()
        const validationSchema = zSchema.pick({
            email: true, password:true
        })

        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return res(false, 401, 'Invalid or missing input field', validatedData.error)
        }
        const {email, password} = validatedData.data
        const getUser = await UserModel.findOne({deletedAt: null, email}).select('+password')
        if(!getUser){
            return res(false, 404, 'User not found')
        }
        getUser.password = password
        await getUser.save()
        return res(true, 200, 'Password update success')

    } catch (error) {
        catchError(error)
    }
}