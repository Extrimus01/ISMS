import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import College, { ICollege } from "@/models/College";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const colleges = await College.find<ICollege>({}, { name: 1 }).sort({
      name: 1,
    });
    return NextResponse.json(colleges);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
