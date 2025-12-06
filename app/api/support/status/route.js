import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnection";
import SupportChatModel from "@/Models/SupportChat.model";

// Update support ticket status
export async function PUT(request) {
  try {
    await connectDB();

    const { ticketId, status } = await request.json();

    if (!ticketId || !status) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["open", "in-progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const ticket = await SupportChatModel.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
        data: ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update ticket status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}
