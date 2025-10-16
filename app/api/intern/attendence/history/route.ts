import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    const history = await db
      .collection("attendance")
      .aggregate([
        {
          $match: { studentId: new ObjectId(studentId) },
        },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "project",
          },
        },
        {
          $unwind: {
            path: "$project",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { date: -1 } },
      ])
      .toArray();

    const response = history.map((h) => ({
      _id: h._id.toString(),
      date: h.date,
      status: h.status,
      project: h.project
        ? {
            _id: h.project._id?.toString() || null,
            name: h.project.name || "Unknown",
          }
        : null,
      markedAt: h.markedAt,
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error("attendance history error:", err);
    return NextResponse.json(
      { error: "Failed to fetch attendance history" },
      { status: 500 }
    );
  }
}
