import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generatePassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateWelcomeEmail = (
  fullName: string,
  email: string,
  password: string
) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2a3f54;">Welcome to ISMS Internship Portal – Your Account Details</h2>

        <p>Dear <b>${fullName}</b>,</p>

        <p>
          Warm greetings from the <b>Maharashtra Remote Sensing Application Center (MRSAC)</b>.
        </p>

        <p>
          Your account has been successfully created on the <b>ISMS Internship Management System</b>, 
          the official portal developed for MRSAC internship programs. You can now log in, explore 
          available roles within the company, apply for internships, and stay updated with important 
          alerts and notifications related to your application journey.
        </p>

        <p>
          <b>Login Credentials:</b><br/>
          Email: <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${email}</span><br/>
          Password: <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${password}</span>
        </p>

        <p>
          Please use these details to access your profile. For your security, kindly update your 
          password after your first login.
        </p>

        <p>
          We look forward to supporting your internship journey and wish you success as you begin 
          your experience with MRSAC through the ISMS portal.
        </p>

        <p>Best regards,<br/>
        <b>ISMS Support Team</b></p>
      </body>
    </html>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { fullName, college, email, phone } = await req.json();
    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      fullName,
      college,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "student",
      verified: false,
      createdAt: new Date(),
    });

    try {
      await transporter.sendMail({
        from: `"ISMS" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: "Welcome to ISMS Internship Portal – Your Account Details",
        html: generateWelcomeEmail(fullName, normalizedEmail, password),
      });
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
      return NextResponse.json({
        message: "User created, but email failed to send",
        userId: result.insertedId,
      });
    }

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
