import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      role,
      fullName,
      universityName,
      companyName,
      companyAddress,
      email,
      password,
    } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("internshipPlatform");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      role,
      email,
      password: hashedPassword,
      fullName: fullName || null,
      universityName: universityName || null,
      companyName: companyName || null,
      companyAddress: companyAddress || null,
      createdAt: new Date(),
    };

    await users.insertOne(user);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
