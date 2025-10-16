import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Intern, { IIntern } from "@/models/Intern";
import Project, { IProject } from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get("id");

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required." },
        { status: 400 }
      );
    }

    // Find intern by certificateId
    const intern = await Intern.findOne({ certificateId })
      .populate({
        path: "projectsAssigned.project",
        model: Project,
        select: "title",
      })
      .lean<IIntern & { projectsAssigned: { project: IProject }[] }>();

    if (!intern) {
      return NextResponse.json(
        { error: "Invalid certificate ID. Please check and try again." },
        { status: 404 }
      );
    }

    // Get the last assigned project name (if exists)
    const lastProject =
      intern.projectsAssigned && intern.projectsAssigned.length > 0
        ? intern.projectsAssigned[intern.projectsAssigned.length - 1]?.project
            ?.title || "N/A"
        : "N/A";

    const responseData = {
      name: intern.fullName,
      college: intern.college,
      project: lastProject,
      issueDate: intern.issueDate || "N/A",
      certificateId: intern.certificateId,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
