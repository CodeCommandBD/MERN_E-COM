import { connectDB } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: "connection success" }, { status: 200 });
  } catch (err) {
    console.error("DB connection error:", err);
    return NextResponse.json({ success: false, message: "connection failed" }, { status: 500 });
  }
}


 

