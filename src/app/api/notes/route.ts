import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateNoteNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const { searchParams } = new URL(req.url);
  const status    = searchParams.get("status") ?? undefined;
  const role      = searchParams.get("role") ?? undefined;
  const search    = searchParams.get("search") ?? undefined;
  const page      = parseInt(searchParams.get("page") ?? "1");
  const limit     = parseInt(searchParams.get("limit") ?? "10");
  const skip      = (page - 1) * limit;

  const where: any = {
    AND: [
      // Role filter
      role === "CREDITOR"
        ? { creditorId: userId }
        : role === "DEBTOR"
        ? { debtorId: userId }
        : { OR: [{ creditorId: userId }, { debtorId: userId }] },
      // Status filter
      ...(status ? [{ status }] : []),
      // Search
      ...(search
        ? [{ OR: [{ noteNumber: { contains: search } }, { debtorNationalId: { contains: search } }] }]
        : []),
    ],
  };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        creditor: { select: { id: true, name: true, nationalId: true, userType: true } },
        debtor:   { select: { id: true, name: true, nationalId: true, userType: true } },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return NextResponse.json({ notes, total });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const creditorId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const { debtorNationalId, amount, dueDate, purpose, description } = body;

    if (!debtorNationalId || !amount || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });
    }

    // Check if debtor exists
    const debtor = await prisma.user.findUnique({ where: { nationalId: debtorNationalId } });

    // Check not self
    const creditor = await prisma.user.findUnique({ where: { id: creditorId } });
    if (creditor?.nationalId === debtorNationalId) {
      return NextResponse.json({ error: "Cannot create note with yourself as debtor" }, { status: 400 });
    }

    const noteNumber = generateNoteNumber();

    const note = await prisma.note.create({
      data: {
        noteNumber,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        purpose: purpose ?? "OTHER",
        description: description ?? null,
        creditorId,
        debtorId: debtor?.id ?? null,
        debtorNationalId,
        status: "PENDING",
        history: {
          create: {
            action: "ISSUED",
            actorName: creditor?.name ?? "Creditor",
            details: `Note issued for amount ${amount} SAR`,
          },
        },
      },
      include: {
        creditor: { select: { id: true, name: true, nationalId: true, userType: true } },
        debtor:   { select: { id: true, name: true, nationalId: true, userType: true } },
        history:  { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
