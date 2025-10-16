import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { projectId, studentIds } = await req.json();

    if (!projectId || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: "Missing project or students" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");
    const projects = db.collection("projects");

    const objectStudentIds = studentIds.map((id) => new ObjectId(id));

    const result = await projects.updateOne(
      { _id: new ObjectId(projectId) },
      { $addToSet: { students: { $each: objectStudentIds } }, $set: { updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No students assigned" }, { status: 400 });
    }

    return NextResponse.json({ success: true, assignedCount: objectStudentIds.length });
  } catch (error) {
    console.error("Error assigning students:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
