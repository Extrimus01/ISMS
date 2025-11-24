import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (!id)
      return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

    await dbConnect();

    const intern = await Intern.findById(id).select("attendance");
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    const todayIST = new Date(
      nowIST.getFullYear(),
      nowIST.getMonth(),
      nowIST.getDate()
    );

    if (action === "mark") {
      const alreadyMarked = intern.attendance.find((a: any) => {
        const aDate = new Date(a.date);
        aDate.setHours(0, 0, 0, 0);
        return aDate.getTime() === todayIST.getTime();
      });

      if (alreadyMarked)
        return NextResponse.json(
          { error: "Today already marked" },
          { status: 400 }
        );

      intern.attendance.push({
        date: todayIST,
        status: "pending",
        requestedAt: nowIST,
      });

      await intern.save();
    }

    return NextResponse.json({ attendance: intern.attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process attendance" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const interns = await Intern.find({}).select(
      "fullName college course projectsAssigned mentor attendance"
    );

    const data = interns.map((intern) => {
      const present = intern.attendance.filter(
        (a: any) => a.status === "present"
      ).length;
      const absent = intern.attendance.filter(
        (a: any) => a.status === "absent"
      ).length;
      const pending = intern.attendance.filter(
        (a: any) => a.status === "pending"
      ).length;

      return {
        id: intern._id,
        name: intern.fullName,
        college: intern.college,
        course: intern.course,
        project: intern.projectsAssigned[0]?.project || "N/A",
        mentor: intern.mentor || "Unassigned",
        present,
        absent,
        pending,
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch attendance summary" },
      { status: 500 }
    );
  }
}
