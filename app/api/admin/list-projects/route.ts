import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("isms");

    Join projects with manager details
    const projects = await db
      .collection("projects")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "managerId",
            foreignField: "_id",
            as: "manager",
          },
        },
        { $unwind: "$manager" },
        {
          $project: {
            name: 1,
            description: 1,
            deadline: 1,
            status: 1,
            createdAt: 1,
            "manager.fullName": 1,
            "manager.email": 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
