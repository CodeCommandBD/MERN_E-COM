import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Get unread message count for admin
export async function GET(request) {
  try {
    await connectDB();

    // Find all tickets that have at least one unread message from customer
    const tickets = await SupportChatModel.find({
      messages: {
        $elemMatch: {
          sender: "customer",
          isRead: false,
        },
      },
    });

    // Calculate total unread messages
    let totalUnread = 0;
    tickets.forEach((ticket) => {
      const unreadInTicket = ticket.messages.filter(
        (m) => m.sender === "customer" && !m.isRead
      ).length;
      totalUnread += unreadInTicket;
    });

    return NextResponse.json(
      {
        success: true,
        count: totalUnread,
        hasUnread: totalUnread > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get unread count error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get unread count" },
      { status: 500 }
    );
  }
}
