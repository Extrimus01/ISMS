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

const generateManagerEmail = (
  fullName: string,
  email: string,
  password: string
) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2a3f54;">ISMS Portal – Project Manager Account Created</h2>

        <p>Dear <b>${fullName}</b>,</p>

        <p>
          We are pleased to inform you that your <b>Project Manager account</b> has been successfully created on the 
          <b>ISMS Internship Management System</b>, developed for the Maharashtra Remote Sensing Application Center (MRSAC).
        </p>

        <p>
          This account has been set up and assigned to you by the company to facilitate project oversight, intern 
          management, and collaborative coordination with HR. You now have access to monitor intern progress, assign 
          project tasks, and support the success of our internship program.
        </p>

        <p>
          <b>Login Credentials:</b><br/>
          Email: <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${email}</span><br/>
          Password: <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">${password}</span>
        </p>

        <p>
          For your security, please change your password after your first login. Should you have any questions or 
          require assistance, the company’s support resources are available to help.
        </p>

        <p>
          Welcome to the ISMS portal, and thank you for your leadership in our projects.
        </p>

        <p>Best regards,<br/>MRSAC (on behalf of Company Management)</p>
      </body>
    </html>
  `;
};

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone } = await req.json();
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
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "project_manager",
      verified: false,
      createdAt: new Date(),
    });

    try {
      await transporter.sendMail({
        from: `"ISMS" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: "ISMS Portal – Project Manager Account Created",
        html: generateManagerEmail(fullName, normalizedEmail, password),
      });
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
      return NextResponse.json({
        message: "Manager created, but email failed to send",
        userId: result.insertedId,
      });
    }

    return NextResponse.json({
      message: "Project Manager created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Manager creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
