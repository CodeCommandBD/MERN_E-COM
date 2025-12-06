import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Create a new support chat ticket
export async function POST(request) {
  try {
    await connectDB();

    const { name, phone, message, email } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { success: false, message: "Name and message are required" },
        { status: 400 }
      );
    }

    // Generate ticket number
    const count = await SupportChatModel.countDocuments();
    const ticketNumber = `TKT-${String(count + 1).padStart(6, "0")}`;

    // Create new support chat
    const supportChat = await SupportChatModel.create({
      ticketNumber,
      customerInfo: {
        name,
        phone: phone || "",
        email: email || "",
      },
      messages: [
        {
          sender: "customer",
          message,
        },
      ],
      lastMessageAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Support ticket created successfully",
        data: {
          ticketId: supportChat._id,
          ticketNumber: supportChat.ticketNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create support ticket error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
