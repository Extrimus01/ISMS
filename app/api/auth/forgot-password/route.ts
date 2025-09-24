import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateTempPasswordEmail = (fullName: string, tempPassword: string) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2a3f54;">ISMS Portal – Temporary Password for Account Access</h2>

        <p>Dear <b>${fullName}</b>,</p>

        <p>
          This is a notification from the <b>ISMS Internship Portal</b>, developed for the 
          <b>MRSAC internship program</b>. Your temporary password is provided below; please use it 
          to log into your account. For security reasons, you’ll be prompted to set a new password 
          after your first login.
        </p>

        <p>
          <b>Temporary Password:</b> <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${tempPassword}</span>
        </p>

        <p>
          If you need any assistance or have questions, the ISMS support team is here to help. 
          Wishing you a smooth and successful internship journey with MRSAC.
        </p>

        <p>Best regards,<br/>
        <b>ISMS Support Team</b></p>
      </body>
    </html>
  `;
};

const generateTempPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db
      .collection("users")
      .updateOne({ email }, { $set: { password: hashedPassword } });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "ISMS Portal – Temporary Password for Account Access",
      html: generateTempPasswordEmail(user.fullName, tempPassword),
    });

    return NextResponse.json({
      success: true,
      message: "Temporary password sent to your email",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
