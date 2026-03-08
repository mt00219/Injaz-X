import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

function noteNum(n: number) {
  return `INJ-2025-${String(n).padStart(6, "0")}`;
}

function daysAgo(d: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date;
}

function daysFromNow(d: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date;
}

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // Create users
  const [user1, user2, user3, user4] = await Promise.all([
    prisma.user.upsert({
      where: { nationalId: "1234567890" },
      update: {},
      create: {
        nationalId: "1234567890",
        name: "أحمد محمد العمري",
        email: "ahmed@example.com",
        phone: "0501234567",
        userType: "INDIVIDUAL",
        password,
      },
    }),
    prisma.user.upsert({
      where: { nationalId: "0987654321" },
      update: {},
      create: {
        nationalId: "0987654321",
        name: "شركة الرياض للتجارة",
        email: "info@riyadh-trade.com",
        phone: "0112345678",
        userType: "COMPANY",
        password,
      },
    }),
    prisma.user.upsert({
      where: { nationalId: "1122334455" },
      update: {},
      create: {
        nationalId: "1122334455",
        name: "محمد عبدالله السالم",
        email: "msalem@example.com",
        phone: "0559876543",
        userType: "INDIVIDUAL",
        password,
      },
    }),
    prisma.user.upsert({
      where: { nationalId: "5544332211" },
      update: {},
      create: {
        nationalId: "5544332211",
        name: "بنك الأهلي التجاري",
        email: "contact@alahli.sa",
        phone: "920002470",
        userType: "BANK",
        password,
      },
    }),
  ]);

  console.log("Users created.");

  // Seed notes with history
  const notesData = [
    {
      noteNumber: noteNum(100001),
      amount: 50000,
      status: "ACTIVE",
      creditorId: user1.id,
      debtorId: user2.id,
      debtorNationalId: user2.nationalId,
      dueDate: daysFromNow(45),
      issueDate: daysAgo(15),
      purpose: "COMMERCIAL",
      description: "دفعة أولى لعقد توريد",
      signedAt: daysAgo(13),
      history: [
        { action: "ISSUED", actorName: user1.name, details: "تم إصدار السند", createdAt: daysAgo(15) },
        { action: "SIGNED", actorName: user2.name, details: "تم توقيع السند والموافقة عليه", createdAt: daysAgo(13) },
      ],
    },
    {
      noteNumber: noteNum(100002),
      amount: 120000,
      status: "PENDING",
      creditorId: user2.id,
      debtorId: user1.id,
      debtorNationalId: user1.nationalId,
      dueDate: daysFromNow(30),
      issueDate: daysAgo(2),
      purpose: "REAL_ESTATE",
      description: "دفعة إيجار سنوية",
      history: [
        { action: "ISSUED", actorName: user2.name, details: "تم إصدار السند وإرسال طلب التوقيع", createdAt: daysAgo(2) },
      ],
    },
    {
      noteNumber: noteNum(100003),
      amount: 25000,
      status: "PAID",
      creditorId: user1.id,
      debtorId: user3.id,
      debtorNationalId: user3.nationalId,
      dueDate: daysAgo(5),
      issueDate: daysAgo(60),
      purpose: "PERSONAL",
      signedAt: daysAgo(58),
      paidAt: daysAgo(3),
      history: [
        { action: "ISSUED", actorName: user1.name, details: "تم إصدار السند", createdAt: daysAgo(60) },
        { action: "SIGNED", actorName: user3.name, details: "تم التوقيع والقبول", createdAt: daysAgo(58) },
        { action: "PAID",   actorName: user1.name, details: "تم تأكيد الاستلام والتسديد", createdAt: daysAgo(3) },
      ],
    },
    {
      noteNumber: noteNum(100004),
      amount: 75000,
      status: "OVERDUE",
      creditorId: user4.id,
      debtorId: user1.id,
      debtorNationalId: user1.nationalId,
      dueDate: daysAgo(10),
      issueDate: daysAgo(90),
      purpose: "COMMERCIAL",
      signedAt: daysAgo(88),
      history: [
        { action: "ISSUED",  actorName: user4.name, details: "تم إصدار السند", createdAt: daysAgo(90) },
        { action: "SIGNED",  actorName: user1.name, details: "تم التوقيع", createdAt: daysAgo(88) },
        { action: "OVERDUE", actorName: "النظام",   details: "تجاوز السند تاريخ الاستحقاق", createdAt: daysAgo(10) },
      ],
    },
    {
      noteNumber: noteNum(100005),
      amount: 35000,
      status: "ACTIVE",
      creditorId: user2.id,
      debtorId: user3.id,
      debtorNationalId: user3.nationalId,
      dueDate: daysFromNow(60),
      issueDate: daysAgo(20),
      purpose: "EDUCATION",
      signedAt: daysAgo(18),
      history: [
        { action: "ISSUED", actorName: user2.name, details: "تم إصدار السند", createdAt: daysAgo(20) },
        { action: "SIGNED", actorName: user3.name, details: "تم التوقيع والموافقة", createdAt: daysAgo(18) },
      ],
    },
    {
      noteNumber: noteNum(100006),
      amount: 15000,
      status: "CANCELLED",
      creditorId: user1.id,
      debtorId: null,
      debtorNationalId: "9988776655",
      dueDate: daysFromNow(20),
      issueDate: daysAgo(5),
      purpose: "VEHICLE",
      history: [
        { action: "ISSUED",    actorName: user1.name, details: "تم إصدار السند", createdAt: daysAgo(5) },
        { action: "CANCELLED", actorName: user1.name, details: "تم إلغاء السند من قبل الدائن", createdAt: daysAgo(3) },
      ],
    },
    {
      noteNumber: noteNum(100007),
      amount: 200000,
      status: "ACTIVE",
      creditorId: user4.id,
      debtorId: user2.id,
      debtorNationalId: user2.nationalId,
      dueDate: daysFromNow(120),
      issueDate: daysAgo(30),
      purpose: "COMMERCIAL",
      description: "قرض تجاري مضمون",
      signedAt: daysAgo(28),
      history: [
        { action: "ISSUED", actorName: user4.name, details: "تم إصدار السند", createdAt: daysAgo(30) },
        { action: "SIGNED", actorName: user2.name, details: "تم التوقيع والموافقة", createdAt: daysAgo(28) },
      ],
    },
    {
      noteNumber: noteNum(100008),
      amount: 8500,
      status: "PAID",
      creditorId: user3.id,
      debtorId: user1.id,
      debtorNationalId: user1.nationalId,
      dueDate: daysAgo(2),
      issueDate: daysAgo(45),
      purpose: "PERSONAL",
      signedAt: daysAgo(43),
      paidAt: daysAgo(1),
      history: [
        { action: "ISSUED", actorName: user3.name, details: "تم إصدار السند", createdAt: daysAgo(45) },
        { action: "SIGNED", actorName: user1.name, details: "تم التوقيع", createdAt: daysAgo(43) },
        { action: "PAID",   actorName: user3.name, details: "تم الاستلام", createdAt: daysAgo(1) },
      ],
    },
  ];

  for (const nd of notesData) {
    const { history, ...noteFields } = nd;
    await prisma.note.upsert({
      where: { noteNumber: nd.noteNumber },
      update: {},
      create: {
        ...noteFields,
        history: {
          create: history.map((h) => ({
            action: h.action,
            actorName: h.actorName,
            details: h.details,
            createdAt: h.createdAt,
          })),
        },
      },
    });
  }

  console.log("Notes seeded.");
  console.log("\nDemo credentials:");
  console.log("  National ID: 1234567890");
  console.log("  Password:    password123");
  console.log("\nDatabase seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
