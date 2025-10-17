import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import Manager from "@/models/Manager";
import Intern from "@/models/Intern";

export async function POST(req: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Email, current password, and new password are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const collections = [
      { model: Admin, role: "Admin" },
      { model: Manager, role: "Manager" },
      { model: Intern, role: "Intern" },
    ];

    let user: any = null;
    let role = "";

    for (const { model, role: r } of collections) {
      const found = await model.findOne({ email });
      if (found) {
        user = found;
        role = r;
        break;
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (role === "Intern" && !user.isActive) {
      return NextResponse.json(
        {
          error:
            "Your internship account is not yet active. Please contact your manager or admin.",
        },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
