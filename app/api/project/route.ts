import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

export async function GET() {
  await dbConnect();
  const projects = await Project.find({})
    .populate("manager", "fullName")
    .populate("interns.intern", "fullName");
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  try {
    const project = new Project(body);
    await project.save();
    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "Missing project ID" }, { status: 400 });

  const body = await req.json();
  try {
    const project = await Project.findByIdAndUpdate(id, body, { new: true });
    if (!project) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "Missing project ID" }, { status: 400 });

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
