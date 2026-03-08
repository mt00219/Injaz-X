import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const where = { OR: [{ creditorId: userId }, { debtorId: userId }] };

  const [all, monthly] = await Promise.all([
    prisma.note.findMany({ where }),
    // Last 6 months of activity
    prisma.note.findMany({
      where: {
        ...where,
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
        },
      },
    }),
  ]);

  const totalNotes      = all.length;
  const activeNotes     = all.filter((n) => n.status === "ACTIVE").length;
  const pendingNotes    = all.filter((n) => n.status === "PENDING").length;
  const overdueNotes    = all.filter((n) => n.status === "OVERDUE").length;
  const paidNotes       = all.filter((n) => n.status === "PAID").length;
  const totalAmountIssued = all.reduce((s, n) => s + n.amount, 0);
  const totalAmountPaid   = all.filter((n) => n.status === "PAID").reduce((s, n) => s + n.amount, 0);

  // Build monthly data for last 6 months
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const month = AR_MONTHS[d.getMonth()];
    const y = d.getFullYear();
    const m = d.getMonth();
    const notesInMonth = monthly.filter((n) => {
      const nd = new Date(n.createdAt);
      return nd.getFullYear() === y && nd.getMonth() === m;
    });
    return {
      month,
      issued: notesInMonth.length,
      paid: notesInMonth.filter((n) => n.status === "PAID").length,
      amount: notesInMonth.reduce((s, n) => s + n.amount, 0),
    };
  });

  return NextResponse.json({
    totalNotes,
    activeNotes,
    pendingNotes,
    overdueNotes,
    paidNotes,
    totalAmountIssued,
    totalAmountPaid,
    monthlyData,
  });
}
