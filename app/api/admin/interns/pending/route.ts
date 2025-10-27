import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";

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

import fetch from "node-fetch";

export async function convertToPdf(docxUrl: string): Promise<Buffer> {
  try {
    // Step 1: Start conversion
    const response = await fetch("https://api.converthub.com/v2/convert", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVERTHUB_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [
          {
            type: "upload",
            source: docxUrl, // Publicly accessible .docx URL
          },
        ],
        output_format: "pdf",
      }),
    });

    const convertJson = await response.json();

    if (!convertJson.success) {
      throw new Error(`Convert request failed: ${JSON.stringify(convertJson)}`);
    }

    // ✅ Fix: use top-level job_id (no .data)
    const jobId = convertJson.job_id;
    const statusUrl = `https://api.converthub.com/v2/jobs/${jobId}`;

    // Step 2: Poll job status
    let jobStatus = "processing";
    let resultUrl = "";

    while (jobStatus === "processing" || jobStatus === "queued") {
      const statusResp = await fetch(statusUrl, {
        headers: {
          "Authorization": `Bearer ${process.env.CONVERTHUB_API_KEY}`,
        },
      });

      const statusJson = await statusResp.json();
      jobStatus = statusJson.status;

      if (jobStatus === "completed") {
        resultUrl = statusJson.result?.download_url;
        break;
      } else if (jobStatus === "failed") {
        throw new Error(`ConvertHub job failed: ${JSON.stringify(statusJson)}`);
      }

      // Wait 2s before next poll
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Step 3: Download final PDF
    if (!resultUrl) {
      throw new Error("No download URL found in completed job result");
    }

    const pdfResponse = await fetch(resultUrl);
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    return pdfBuffer;
  } catch (error) {
    console.error("Error converting DOCX to PDF:", error);
    throw new Error("Error converting DOCX to PDF");
  }
}


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

    try {
      const pdfBuffer = await convertToPdf();
      intern.offerLetter = `data:application/pdf;base64,${pdfBuffer.toString(
        "base64"
      )}`;
    } catch (err) {
      console.error("Error generating offer letter PDF:", err);
      return NextResponse.json(
        { error: "Failed to generate offer letter" },
        { status: 500 }
      );
    }

    await intern.save();

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
        from: process.env.EMAIL_USER,
        to: intern.email,
        subject: "Welcome to ISMS Internship Portal – Your Account Details",
        html: `
          <p>Dear <strong>${intern.fullName}</strong>,</p>
          <p>Warm greetings from the Maharashtra Remote Sensing Application Center (MRSAC).</p>
          <p>Your account has been successfully created on the <strong>ISMS Internship Management System</strong>.</p>
          <p><strong>Login Credentials:</strong><br/>
          Email: ${intern.email}<br/>
          Password: ${tempPassword}</p>
          <p>Please find your <strong>Offer Letter</strong> attached.</p>
          <p>Best regards,<br/>ISMS Support Team</p>
        `,
        attachments: [
          {
            filename: "OfferLetter.pdf",
            content: intern.offerLetter.split(",")[1],
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
