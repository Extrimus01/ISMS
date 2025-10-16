import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function GET() {
  await dbConnect();
  const managers = await Manager.find().select("-password");
  return NextResponse.json(managers);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const existing = await Manager.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "Manager already exists" }, { status: 400 });

    const manager = new Manager({ fullName, email, phone, password });
    await manager.save();

    return NextResponse.json({ message: "Manager created", manager });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
