
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");
    const projectId = url.searchParams.get("projectId");

    if (!studentId || !projectId) {
      return NextResponse.json({ error: "Missing studentId or projectId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    const match = {
      studentId: new ObjectId(studentId),
      projectId: new ObjectId(projectId),
    };

    const total = await db.collection("attendance").countDocuments(match);
    const approved = await db.collection("attendance").countDocuments({ ...match, status: "approved" });
    const pending = await db.collection("attendance").countDocuments({ ...match, status: "pending" });
    const rejected = await db.collection("attendance").countDocuments({ ...match, status: "rejected" });

    return NextResponse.json({ total, approved, pending, rejected });
  } catch (err) {
    console.error("stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
