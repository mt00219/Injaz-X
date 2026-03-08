import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      creditor: { select: { id: true, name: true, nationalId: true, userType: true } },
      debtor:   { select: { id: true, name: true, nationalId: true, userType: true } },
      history:  { orderBy: { createdAt: "desc" } },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const userId   = (session.user as any).id as string;
  const userName = session.user.name ?? "User";

  const note = await prisma.note.findUnique({
    where: { id },
    include: { creditor: true, debtor: true },
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const body = await req.json();
  const { action } = body as { action: "SIGN" | "REJECT" | "PAY" | "CANCEL" };

  const isCreditor = note.creditorId === userId;
  const isDebtor   = note.debtorId === userId || note.debtorNationalId === (await prisma.user.findUnique({ where: { id: userId } }))?.nationalId;

  let newStatus: string;
  let historyAction: string;
  let extraData: any = {};

  switch (action) {
    case "SIGN":
      if (!isDebtor) return NextResponse.json({ error: "Only debtor can sign" }, { status: 403 });
      if (note.status !== "PENDING") return NextResponse.json({ error: "Note is not pending" }, { status: 400 });
      newStatus = "ACTIVE";
      historyAction = "SIGNED";
      extraData = { signedAt: new Date(), debtorId: userId };
      break;
    case "REJECT":
      if (!isDebtor) return NextResponse.json({ error: "Only debtor can reject" }, { status: 403 });
      if (note.status !== "PENDING") return NextResponse.json({ error: "Note is not pending" }, { status: 400 });
      newStatus = "REJECTED";
      historyAction = "REJECTED";
      break;
    case "PAY":
      if (!isCreditor) return NextResponse.json({ error: "Only creditor can confirm payment" }, { status: 403 });
      if (note.status !== "ACTIVE") return NextResponse.json({ error: "Note is not active" }, { status: 400 });
      newStatus = "PAID";
      historyAction = "PAID";
      extraData = { paidAt: new Date() };
      break;
    case "CANCEL":
      if (!isCreditor) return NextResponse.json({ error: "Only creditor can cancel" }, { status: 403 });
      if (note.status !== "PENDING") return NextResponse.json({ error: "Only pending notes can be cancelled" }, { status: 400 });
      newStatus = "CANCELLED";
      historyAction = "CANCELLED";
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.note.update({
    where: { id },
    data: {
      status: newStatus,
      ...extraData,
      history: {
        create: {
          action: historyAction,
          actorName: userName,
          details: `Status changed to ${newStatus}`,
        },
      },
    },
    include: {
      creditor: { select: { id: true, name: true, nationalId: true, userType: true } },
      debtor:   { select: { id: true, name: true, nationalId: true, userType: true } },
      history:  { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(updated);
}
