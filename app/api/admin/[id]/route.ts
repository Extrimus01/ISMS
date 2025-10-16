import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

// ✅ DO NOT define a custom interface
// ✅ Let Next.js handle the context typing automatically
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json(admin);
  } catch (error) {
    console.error("GET /api/admin/[id] error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    await dbConnect();

    const updatedAdmin = await Admin.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error("PATCH /api/admin/[id] error:", error);
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}
