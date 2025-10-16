import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
import fs from "fs";

async function generateOfferLetterPdf(
  studentName: string,
  projectTitle: string,
  startDate: string,
  endDate: string,
  imageBytes: Uint8Array 
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); 
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let image;
  try {
    image = await pdfDoc.embedPng(imageBytes);
  } catch {
    image = await pdfDoc.embedJpg(imageBytes);
  }

  const imgWidth = 120;
  const imgHeight = (image.height / image.width) * imgWidth;
  const imgX = (page.getWidth() - imgWidth) / 2;
  const imgY = height - 120; 

  page.drawImage(image, {
    x: imgX,
    y: imgY,
    width: imgWidth,
    height: imgHeight,
  });

  page.drawText("To Whom So Ever It May Concern", {
    x: 50,
    y: imgY - 40,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  const text = `Subject: Offer of Internship for Mr./Ms. ${studentName}.

This is to certify that ${studentName} offered an internship at Maharashtra 
Remote Sensing Application Centre (MRSAC), Nagpur, under my guidance.

The internship will be conducted from ${startDate} to ${endDate}.

The internship is a part of an ongoing project titled.

"${projectTitle}" with an extended scope to integrate Supply chain Assistance and 
develop a full-fledged project.

We look forward to the continued valuable contribution of the interns towards 
this project.

Thank You`;

  page.drawText(text, {
    x: 50,
    y: imgY - 100,
    size: 12,
    font,
    lineHeight: 18,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { userId, action, startDate, endDate, projectTitle } =
      await req.json();
    if (!userId || !action)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const existingUser = await users.findOne({ _id: new ObjectId(userId) });
    if (!existingUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (action === "approve") {
      if (!startDate || !endDate || !projectTitle) {
        return NextResponse.json(
          { error: "Missing project details" },
          { status: 400 }
        );
      }

      const logoBytes = fs.readFileSync("public/logo.png");
      const pdfBuffer = await generateOfferLetterPdf(
        existingUser.fullName,
        projectTitle,
        startDate,
        endDate,
        logoBytes
      );
      const pdfBase64 = pdfBuffer.toString("base64");

      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            verified: true,
            verifiedAt: new Date(),
            offerLetter: pdfBase64,
            internship: {
              projectTitle,
              startDate,
              endDate,
            },
          },
        }
      );

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: existingUser.email,
        subject: "Internship Offer Letter",
        text: `Congratulations! Please find your offer letter attached.\n\nProject Title: ${projectTitle}\nStart Date: ${startDate}\nEnd Date: ${endDate}`,
        attachments: [{ filename: "OfferLetter.pdf", content: pdfBuffer }],
      });
    } else if (action === "reject") {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { verified: false, rejected: false, rejectedAt: new Date() } }
      );
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ message: `User ${action}d successfully` });
  } catch (err) {
    console.error("Verify student error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
