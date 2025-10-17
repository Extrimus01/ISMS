import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

    await dbConnect();

    const intern = await Intern.findById(id).select("attendance");
    if (!intern) return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (action === "mark") {
      const alreadyMarked = intern.attendance.find((a: any) => {
        const aDate = new Date(a.date);
        aDate.setHours(0, 0, 0, 0);
        return aDate.getTime() === today.getTime();
      });

      if (alreadyMarked) return NextResponse.json({ error: "Today already marked" }, { status: 400 });

      intern.attendance.push({
        date: new Date(),
        status: "pending",
        requestedAt: new Date(),
      });

      await intern.save();
    }

    return NextResponse.json({ attendance: intern.attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process attendance" }, { status: 500 });
  }
}
