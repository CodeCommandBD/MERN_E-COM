import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Get all support tickets (for admin)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const tickets = await SupportChatModel.find(query)
      .sort({ lastMessageAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: tickets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("List support tickets error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch support tickets" },
      { status: 500 }
    );
  }
}
