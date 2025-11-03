import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: Request) {
  await dbConnect();

  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = await verifyToken(token);
  if (!user || user.role !== "manager")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get all projects managed by this manager
  const projects = await Project.find({ manager: user.id }).select("_id");
  const projectIds = projects.map((p) => p._id);

  // Get attendance for interns under these projects
  const attendanceRecords = await Attendance.find()
    .populate({
      path: "intern",
      match: { "projects.projectId": { $in: projectIds } },
      select: "fullName email department",
    })
    .sort({ date: -1 });

  return NextResponse.json(attendanceRecords);
}

export async function PATCH(req: Request) {
  await dbConnect();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = await verifyToken(token);
  if (!user || user.role !== "manager")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, confirmed } = await req.json();

  const attendance = await Attendance.findById(id);
  if (!attendance)
    return NextResponse.json(
      { error: "Attendance not found" },
      { status: 404 }
    );

  attendance.confirmedByManager = confirmed;
  await attendance.save();

  return NextResponse.json({ success: true });
}
