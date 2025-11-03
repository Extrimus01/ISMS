import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function PATCH(req: NextRequest) {
  try {
    const { internId, projectId, startDate, endDate, status } =
      await req.json();

    if (!internId || !projectId) {
      return NextResponse.json(
        { error: "Missing internId or projectId" },
        { status: 400 }
      );
    }

    await dbConnect();

    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const assignmentIndex = intern.projectsAssigned.findIndex(
      (a: any) => a.project?.toString() === projectId
    );

    if (assignmentIndex === -1)
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );

    // ✅ Safely update fields
    if (startDate)
      intern.projectsAssigned[assignmentIndex].startDate = new Date(startDate);
    if (endDate)
      intern.projectsAssigned[assignmentIndex].endDate = new Date(endDate);
    if (status) intern.projectsAssigned[assignmentIndex].status = status;

    await intern.save();

    return NextResponse.json({
      success: true,
      message: "Assignment updated successfully",
      data: intern.projectsAssigned[assignmentIndex],
    });
  } catch (err: any) {
    console.error("PATCH /api/intern/project error:", err);
    return NextResponse.json(
      { error: "Failed to update assignment", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { internId, projectId } = await req.json();

    if (!internId || !projectId) {
      return NextResponse.json(
        { error: "Missing internId or projectId" },
        { status: 400 }
      );
    }

    await dbConnect();

    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const beforeCount = intern.projectsAssigned.length;
    intern.projectsAssigned = intern.projectsAssigned.filter(
      (a: any) => a.project?.toString() !== projectId
    );

    if (beforeCount === intern.projectsAssigned.length) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    await intern.save();

    return NextResponse.json({
      success: true,
      message: "Assignment removed successfully",
    });
  } catch (err: any) {
    console.error("DELETE /api/intern/project error:", err);
    return NextResponse.json(
      { error: "Failed to remove assignment", details: err.message },
      { status: 500 }
    );
  }
}
