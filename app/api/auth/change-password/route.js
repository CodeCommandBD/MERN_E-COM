import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import UserModel from "@/Models/user.models";
import bcrypt from "bcrypt";

export async function PUT(request) {
  try {
    // Check authentication
    const auth = await isAuthenticated();
    if (!auth.isAuth) {
      return res(false, 401, "Unauthorized");
    }

    await connectDB();

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res(false, 400, "All fields are required");
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res(false, 400, "New passwords do not match");
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res(false, 400, "Password must be at least 6 characters");
    }

    // Get user with password
    const user = await UserModel.findById(auth._id).select("+password");
    if (!user) {
      return res(false, 404, "User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res(false, 400, "Current password is incorrect");
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return res(true, 200, "Password changed successfully");
  } catch (error) {
    return catchError(error);
  }
}
