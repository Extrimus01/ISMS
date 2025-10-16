
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    
    const project = await db.collection("projects").findOne({
      students: { $elemMatch: { $eq: new ObjectId(studentId) } },
    });

    if (!project) {
      return NextResponse.json({ error: "No project assigned to student" }, { status: 404 });
    }

    const projectId = project._id;
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; 

    
    const existing = await db.collection("attendance").findOne({
      studentId: new ObjectId(studentId),
      projectId: new ObjectId(projectId),
      date: dateString,
    });

    if (existing) {
      return NextResponse.json({ error: "Attendance already marked for today" }, { status: 400 });
    }

    const result = await db.collection("attendance").insertOne({
      studentId: new ObjectId(studentId),
      projectId: new ObjectId(projectId),
      date: dateString,
      status: "pending", 
      markedAt: new Date(),
      approvedAt: null,
      approvedBy: null,
    });

    return NextResponse.json({ success: true, attendanceId: result.insertedId });
  } catch (err) {
    console.error("attendance error:", err);
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}
