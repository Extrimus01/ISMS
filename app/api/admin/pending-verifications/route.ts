import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const pendingUsers = await users
      .find({ role: "student", verified: false })
      .project({
        fullName: 1,
        email: 1,
        phone: 1,
        college: 1,
        course: 1,
        year: 1,
        resume: 1,
        idProof: 1,
        additionalDocs: 1,
        offerLetter: 1,
        interviewDate: 1,
        interviewSlot: 1,
        createdAt: 1,
      })
      .toArray();

    const serializedUsers = pendingUsers.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return NextResponse.json({ users: serializedUsers });
  } catch (err) {
    console.error("Admin pending verifications error:", err);
    return NextResponse.json(
      { error: "Internal server error", users: [] },
      { status: 500 }
    );
  }
}
