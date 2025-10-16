import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { name, description, deadline, managerId } = await req.json();

    if (!name || !managerId) {
      return NextResponse.json(
        { error: "Name and manager are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("isms");
    const projects = db.collection("projects");

    const newProject = {
      name,
      description,
      deadline: deadline ? new Date(deadline) : null,
      managerId: new ObjectId(managerId),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await projects.insertOne(newProject);

    return NextResponse.json({ success: true, projectId: result.insertedId });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
