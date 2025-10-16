
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { attendanceId, managerId, approve } = await req.json();

    if (!attendanceId || !managerId || typeof approve !== "boolean") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    
    const attendance = await db.collection("attendance").findOne({ _id: new ObjectId(attendanceId) });
    if (!attendance) {
      return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
    }

    
    const project = await db.collection("projects").findOne({ _id: attendance.projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.managerId.toString() !== managerId.toString()) {
      return NextResponse.json({ error: "Not authorized to approve this attendance" }, { status: 403 });
    }

    const newStatus = approve ? "approved" : "rejected";
    const update = {
      $set: {
        status: newStatus,
        approvedAt: new Date(),
        approvedBy: new ObjectId(managerId),
      },
    };

    await db.collection("attendance").updateOne({ _id: new ObjectId(attendanceId) }, update);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("approve error:", err);
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}
