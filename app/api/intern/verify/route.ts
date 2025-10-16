import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, resume, idProof, interviewDate, interviewSlot } = body;

    if (!email || !resume || !idProof || !interviewDate || !interviewSlot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await users.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          resume,
          idProof,
          additionalDocs: body.additionalDocs || null,
          course: body.course || "",
          year: body.year || "",
          interviewDate,
          interviewSlot,
          verified: false,
          verifiedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Verification submitted successfully" });
  } catch (err) {
    console.error("Verification API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
