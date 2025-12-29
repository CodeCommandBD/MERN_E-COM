import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import UserModel from "@/Models/user.models.js";
import { isAuthenticated } from "@/lib/authentication";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    // SECURITY: Require authentication
    const auth = await isAuthenticated();
    if (!auth.isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // SECURITY: Users can only access their own data, admins can access any
    if (auth.role !== "admin" && auth._id.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden. You can only access your own profile.",
        },
        { status: 403 }
      );
    }

    const user = await UserModel.findById(userId).select(
      "name email avatar avatarUpdatedAt role phone address isEmailVerified"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}
