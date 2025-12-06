import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Get support ticket by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const ticket = await SupportChatModel.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Mark customer messages as read
    const hasUnreadMessages = ticket.messages.some(
      (m) => m.sender === "customer" && !m.isRead
    );

    if (hasUnreadMessages) {
      ticket.messages.forEach((m) => {
        if (m.sender === "customer" && !m.isRead) {
          m.isRead = true;
        }
      });
      await ticket.save();
    }

    return NextResponse.json(
      {
        success: true,
        data: ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get ticket error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}
