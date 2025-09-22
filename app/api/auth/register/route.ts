import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const generatePassword = (length = 8) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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

export async function POST(req: NextRequest) {
  try {
    const { fullName, college, email, phone } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const password = generatePassword(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      fullName,
      college,
      email,
      phone,
      password: hashedPassword,
      role: "student",
      createdAt: new Date(),
    });

    await transporter.sendMail({
      from: `"ISMS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your ISMS Account Credentials",
      html: `<p>Hello ${fullName},</p>
             <p>Your account has been created successfully!</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Password:</b> ${password}</p>
             <p>Please change your password after logging in.</p>`,
    });

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
