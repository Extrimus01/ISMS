import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email"); 

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("isms");

    
    const manager = await db
      .collection("users")
      .findOne({ email, role: "project_manager" });
    if (!manager) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    
    const projects = await db
      .collection("projects")
      .aggregate([
        { $match: { managerId: manager._id } },
        {
          $lookup: {
            from: "users",
            localField: "students",
            foreignField: "_id",
            as: "assignedStudents",
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Error fetching manager projects:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
