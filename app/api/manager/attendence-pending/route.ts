
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const managerId = url.searchParams.get("managerId");
    if (!managerId) {
      return NextResponse.json({ error: "Missing managerId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    
    const projects = await db.collection("projects").find({ managerId: new ObjectId(managerId) }).project({ _id: 1 }).toArray();
    const projectIds = projects.map((p: any) => p._id);

    if (projectIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    
    const pending = await db.collection("attendance").aggregate([
      { $match: { projectId: { $in: projectIds }, status: "pending" } },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $project: {
          studentId: 1,
          projectId: 1,
          date: 1,
          status: 1,
          markedAt: 1,
          "student.fullName": 1,
          "student.email": 1,
          "project.name": 1,
        },
      },
      { $sort: { markedAt: -1 } },
    ]).toArray();

    return NextResponse.json(pending);
  } catch (err) {
    console.error("pending attendance error:", err);
    return NextResponse.json({ error: "Failed to fetch pending attendance" }, { status: 500 });
  }
}
