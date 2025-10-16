import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";

// 👉 POST method to fetch admin details by ID (sent in JSON body)
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });
    }

    await dbConnect();

    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("POST /api/admin/detail error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 👉 PATCH method to update admin details
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing admin ID" }, { status: 400 });
    }

    await dbConnect();

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error("PATCH /api/admin/detail error:", error);
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}
