import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nationalId, email, phone, userType, password } = body;

    if (!name || !nationalId || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (nationalId.length !== 10) {
      return NextResponse.json({ error: "National ID must be 10 digits" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { nationalId } });
    if (existing) {
      return NextResponse.json({ error: "National ID already registered" }, { status: 409 });
    }

    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        nationalId,
        email: email || null,
        phone: phone || null,
        userType: userType || "INDIVIDUAL",
        password: hashedPassword,
      },
    });

    return NextResponse.json({ id: user.id, name: user.name }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
