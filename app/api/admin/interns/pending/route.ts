import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function GET() {
  await dbConnect();
  const interns = await Intern.find({ isActive: false }).select(
    "fullName email phone college course department semester refNo recommendation collegeId"
  );
  return NextResponse.json({ interns });
}

export async function PATCH(req: Request) {
  await dbConnect();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

  const intern = await Intern.findByIdAndUpdate(id, { isActive: true }, { new: true });
  if (!intern) return NextResponse.json({ error: "Intern not found" }, { status: 404 });

  return NextResponse.json({ success: true, intern });
}
