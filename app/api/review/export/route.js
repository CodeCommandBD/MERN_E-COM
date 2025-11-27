import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import UserModel from "@/Models/user.models";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized.");
    }
    await connectDB();

    const filter = {
      deletedAt: null,
    };

    const getUsers = await UserModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    if (!getUsers) {
      return res(false, 404, "Collection empty.");
    }

    return res(true, 200, "Users found.", getUsers);
  } catch (error) {
    return catchError(error);
  }
}
