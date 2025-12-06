import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import UserModel from "@/Models/user.models.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId).select(
      "name email avatar role phone address isEmailVerified"
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
