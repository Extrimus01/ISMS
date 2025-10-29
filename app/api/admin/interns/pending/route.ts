import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { convertToPdf } from "@/lib/offerLetter";

export async function GET() {
  await dbConnect();
  const interns = await Intern.find({ isActive: false }).select(
    "fullName email phone college course department semester refNo recommendation collegeId"
  );
  return NextResponse.json({ interns });
}

const generateTempPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

    const intern = await Intern.findById(id);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    intern.isActive = true;
    intern.password = hashedPassword;

    let pdfBuffer: Buffer;
    try {
      const { pdf, reference } = await convertToPdf({
        collegeName: intern.college,
        deanName: intern.recommendation?.deanName || "Dean",
        addressLine: intern.collegeAddress || "",
        department: intern.department,
        semester: intern.semester,
        refNo: intern.refNo || "",
        internshipStart: intern.internshipStart || "",
        internshipEnd: intern.internshipEnd || "",
        studentName: intern.fullName,
      });

      pdfBuffer = pdf;

      intern.documents = [
        ...(intern.documents || []),
        {
          type: "Offer Letter",
          data: `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString(
            "base64"
          )}`,
          uploadedAt: new Date().toISOString(),
        },
      ];
    } catch (err) {
      console.error("Error generating offer letter PDF:", err);
      return NextResponse.json(
        { error: "Failed to generate offer letter" },
        { status: 500 }
      );
    }

    await intern.save();

    const offerLetter = intern.documents.find(
      (doc: any) => doc.type === "Offer Letter"
    );

    if (!offerLetter) {
      return NextResponse.json(
        { error: "Offer letter not found after generation" },
        { status: 500 }
      );
    }

    const base64Data = offerLetter.data.split(",")[1];

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"ISMS Support Team" <${process.env.SMTP_FROM}>`,
        to: intern.email,
        subject: "Welcome to ISMS Internship Portal – Your Account Details",
        html: `
          <p>Dear <strong>${intern.fullName}</strong>,</p>
          <p>Warm greetings from the <strong>Maharashtra Remote Sensing Application Center (MRSAC)</strong>.</p>

          <p>
            Your account has been successfully created on the
            <strong>ISMS Internship Management System</strong>, the official portal developed for MRSAC internship programs.
            You can now log in, explore available roles, apply for internships, and stay updated with important notifications.
          </p>

          <h3>Login Credentials:</h3>
          <p>
            <strong>Email:</strong> ${intern.email}<br/>
            <strong>Password:</strong> ${tempPassword}
          </p>

          <p>Please find your <strong>Offer Letter</strong> attached.</p>

          <p>
            Please use these details to access your profile. For your security, kindly update your password after your first login.
          </p>

          <p>Best regards,<br/><strong>ISMS Support Team</strong></p>
        `,
        attachments: [
          {
            filename: "OfferLetter.pdf",
            content: base64Data,
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Error sending activation email:", err);
      return NextResponse.json(
        { error: "Failed to send activation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Intern activated and offer letter sent successfully.",
      intern,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
