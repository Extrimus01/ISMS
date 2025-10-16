
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generatePasswordChangeEmail = (fullName: string, newPassword: string) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2a3f54;">ISMS Portal – Password Updated</h2>
        <p>Dear <b>${fullName}</b>,</p>
        <p>
          Your password for the ISMS Internship Portal has been successfully updated.
        </p>
        <p>
          <b>New Password:</b> <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${newPassword}</span>
        </p>
        <p>
          If you did not make this change, please contact the ISMS support team immediately.
        </p>
        <p>Best regards,<br/>
        <b>MRSAC ISMS Support Team</b></p>
      </body>
    </html>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { email, oldPassword, newPassword, phone } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    const student = await db.collection("users").findOne({ email, role: "student" });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { error: "Old password is required to change password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, student.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
      }

      if (oldPassword === newPassword) {
        return NextResponse.json(
          { error: "New password cannot be the same as old password" },
          { status: 400 }
        );
      }
    }

    
    const updateFields: any = {};
    if (phone) updateFields.phone = phone;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

    await db.collection("users").updateOne({ _id: student._id }, { $set: updateFields });

    
    if (newPassword) {
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
        subject: "ISMS Portal – Password Updated",
        html: generatePasswordChangeEmail(student.fullName, newPassword),
      });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
