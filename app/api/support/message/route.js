import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Send a message to support chat
export async function POST(request) {
  try {
    await connectDB();

    const { ticketId, message, sender = "customer" } = await request.json();

    if (!ticketId || !message) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and message are required" },
        { status: 400 }
      );
    }

    const supportChat = await SupportChatModel.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          messages: {
            sender,
            message,
          },
        },
        lastMessageAt: new Date(),
      },
      { new: true }
    );

    if (!supportChat) {
      return NextResponse.json(
        { success: false, message: "Support ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: supportChat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Mark messages as read
export async function PUT(request) {
  try {
    await connectDB();

    const { ticketId, role = "customer" } = await request.json();

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const ticket = await SupportChatModel.findById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    // If customer is reading, mark admin messages as read
    // If admin is reading, mark customer messages as read
    const senderToMarkRead = role === "customer" ? "admin" : "customer";

    let updated = false;
    ticket.messages.forEach((msg) => {
      if (msg.sender === senderToMarkRead && !msg.isRead) {
        msg.isRead = true;
        updated = true;
      }
    });

    if (updated) {
      await ticket.save();
    }

    return NextResponse.json(
      { success: true, message: "Messages marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}

// Get messages for a support chat
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const supportChat = await SupportChatModel.findById(ticketId);

    if (!supportChat) {
      return NextResponse.json(
        { success: false, message: "Support ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: supportChat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get messages" },
      { status: 500 }
    );
  }
}
