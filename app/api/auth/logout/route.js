import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return res(true, 200, 'Logout successful.')
    } catch (error) {
        return catchError(error)
    }
}