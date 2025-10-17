import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern, { IIntern } from "@/models/Intern";

export async function PATCH(req: NextRequest) {
  const { internId, projectId, startDate, endDate, status } = await req.json();

  if (!internId || !projectId) {
    return NextResponse.json({ error: "Missing internId or projectId" }, { status: 400 });
  }

  try {
    await dbConnect();
    const intern = await Intern.findById(internId);
    if (!intern) return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    // Cast properly
    const assignments = intern.projectsAssigned as (typeof intern.projectsAssigned)[number][];
    const assignment = assignments.find((a) => a.project?.toString() === projectId);

    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    if (startDate) assignment.startDate = new Date(startDate);
    if (endDate) assignment.endDate = new Date(endDate);
    if (status) assignment.status = status;

    await intern.save();
    return NextResponse.json({ message: "Assignment updated", intern });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { internId, projectId } = await req.json();

  if (!internId || !projectId) {
    return NextResponse.json({ error: "Missing internId or projectId" }, { status: 400 });
  }

  try {
    await dbConnect();
    const intern = await Intern.findById(internId);
    if (!intern) return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const assignments = intern.projectsAssigned as (typeof intern.projectsAssigned)[number][];
    intern.projectsAssigned = assignments.filter((a) => a.project?.toString() !== projectId);

    await intern.save();
    return NextResponse.json({ message: "Assignment removed", intern });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to remove assignment" }, { status: 500 });
  }
}
