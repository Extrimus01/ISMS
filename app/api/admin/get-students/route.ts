import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("isms");
    const users = db.collection("users");

    const students = await users
      .find({ role: "student" })
      .project({ password: 0 })
      .sort({ fullName: 1 })
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
