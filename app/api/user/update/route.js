import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import UserModel from "@/Models/user.models";

export async function PUT(request) {
  try {
    // Check authentication
    const auth = await isAuthenticated();
    if (!auth.isAuth) {
      return res(false, 401, "Unauthorized");
    }

    const body = await request.json();
    const { name, phone, dateOfBirth, gender, address, avatar } = body;

    // Connect to database
    await connectDB();

    // Find and update user
    const user = await UserModel.findById(auth._id);

    if (!user) {
      return res(false, 404, "User not found");
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (avatar && (avatar.url || avatar.public_id)) {
      user.avatar = {
        ...(user.avatar || {}),
        ...avatar,
      };
      user.avatarUpdatedAt = Date.now();
    }

    await user.save();

    return res(true, 200, "Profile updated successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      avatar: user.avatar,
      avatarUpdatedAt: user.avatarUpdatedAt,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    return catchError(error);
  }
}
