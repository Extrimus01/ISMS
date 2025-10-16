import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateTempPasswordEmail = (fullName: string, tempPassword: string) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2a3f54;">ISMS Portal – Password Update Notification</h2>

        <p>Dear <b>${fullName}</b>,</p>

        <p>
          Your administrator password for the ISMS Internship Management System (MRSAC) has been successfully updated.
        </p>

        <p>
          <b>New Password:</b> <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${tempPassword}</span>
        </p>

        <p>
          Please use this password to log in. If you experience any issues, our support team is available to assist you.
        </p>

        <p>Best regards,<br/>
        <b>MRSAC (on behalf of Company Management)</b></p>
      </body>
    </html>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await req.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    const admin = await db.collection("users").findOne({ email, role: "admin" });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
    if (!isOldPasswordCorrect) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    
    const isSameAsOld = await bcrypt.compare(newPassword, admin.password);
    if (isSameAsOld) {
      return NextResponse.json({ error: "New password cannot be the same as old password" }, { status: 400 });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await db.collection("users").updateOne(
      { _id: admin._id },
      { $set: { password: hashedPassword } }
    );

    
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MRSAC ISMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "ISMS Portal – New Password for Admin Account",
      html: generateTempPasswordEmail(admin.fullName, newPassword),
    });

    return NextResponse.json({
      success: true,
      message: "Password updated and sent to admin email",
    });
  } catch (error) {
    console.error("Error updating admin password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
