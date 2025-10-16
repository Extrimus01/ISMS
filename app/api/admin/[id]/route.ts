import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  // Access the params from context
  const id = context.params?.id;

  if (!id) return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });

  try {
    await dbConnect();
    const admin = await Admin.findById(id).select("-password"); // exclude password
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Optional PATCH route
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });

  try {
    const body = await req.json();
    await dbConnect();
    const updatedAdmin = await Admin.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    return NextResponse.json(updatedAdmin);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}
