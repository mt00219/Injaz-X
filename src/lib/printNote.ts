import type { NoteWithParties } from "@/types";
import { formatDate } from "./utils";

const PURPOSE_AR: Record<string, string> = {
  COMMERCIAL: "تجاري",
  PERSONAL: "شخصي",
  REAL_ESTATE: "عقاري",
  EDUCATION: "تعليمي",
  VEHICLE: "مركبة",
  OTHER: "أخرى",
};

const USER_TYPE_AR: Record<string, string> = {
  INDIVIDUAL: "فرد",
  COMPANY: "شركة",
  BANK: "بنك",
};

// ── Arabic number-to-words ──────────────────────────────────────────────────
const ONES = [
  "", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
  "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر",
  "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر",
];
const TENS = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const HUNDREDS = ["", "مئة", "مئتان", "ثلاثمئة", "أربعمئة", "خمسمئة", "ستمئة", "سبعمئة", "ثمانمئة", "تسعمئة"];

function threeDigits(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const t = Math.floor(rem / 10);
  const o = rem % 10;
  const parts: string[] = [];
  if (h) parts.push(HUNDREDS[h]);
  if (rem < 20) {
    if (rem) parts.push(ONES[rem]);
  } else {
    if (o) parts.push(ONES[o]);
    parts.push(TENS[t]);
  }
  return parts.join(" و");
}

function numberToArabicWords(amount: number): string {
  const whole = Math.floor(amount);
  const fils = Math.round((amount - whole) * 100);
  const millions = Math.floor(whole / 1_000_000);
  const thousands = Math.floor((whole % 1_000_000) / 1_000);
  const rest = whole % 1_000;

  const parts: string[] = [];
  if (millions) parts.push(threeDigits(millions) + " مليون");
  if (thousands) parts.push(threeDigits(thousands) + " ألف");
  if (rest) parts.push(threeDigits(rest));
  const mainText = parts.join(" و") || "صفر";

  return fils > 0
    ? `${mainText} ريال سعودي و${ONES[fils] || threeDigits(fils)} هللة`
    : `${mainText} ريال سعودي لا غير`;
}

// ── HTML template ───────────────────────────────────────────────────────────
export function printNote(note: NoteWithParties) {
  const issueDate = formatDate(note.issueDate, "ar");
  const dueDate   = formatDate(note.dueDate, "ar");

  // Find the SIGNED event date for approval date, fall back to issue date
  const signedEvent = note.history?.find((h) => h.action === "SIGNED");
  const approvalDate = signedEvent ? formatDate(signedEvent.createdAt, "ar") : issueDate;

  const amountWords = numberToArabicWords(Number(note.amount));
  const purposeAr = note.purpose ? (PURPOSE_AR[note.purpose] ?? note.purpose) : "—";
  const debtorName = note.debtor?.name ?? "—";
  const debtorId   = note.debtor?.nationalId ?? note.debtorNationalId ?? "—";
  const debtorType = note.debtor ? (USER_TYPE_AR[note.debtor.userType] ?? "فرد") : "—";
  const creditorType = USER_TYPE_AR[note.creditor.userType] ?? "فرد";

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>سند لأمر - ${note.noteNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', 'Arabic Typesetting', 'Traditional Arabic', Tahoma, Arial, sans-serif;
    direction: rtl;
    background: #fff;
    color: #1a1a1a;
    font-size: 13px;
    line-height: 1.6;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 12mm 14mm;
    background: #fff;
    position: relative;
  }

  /* ── Header ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 2px solid #1a5c35;
  }
  .logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .logo-text {
    font-size: 32px;
    font-weight: 900;
    color: #006C35;
    letter-spacing: -1px;
    line-height: 1;
  }
  .logo-sub {
    font-size: 10px;
    color: #555;
    margin-top: 2px;
  }
  .header-right {
    text-align: left;
  }
  .doc-title {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: 2px;
  }
  .note-number {
    font-size: 15px;
    color: #333;
    font-weight: 600;
    margin-top: 4px;
    font-family: monospace;
    letter-spacing: 1px;
  }

  /* ── Section ── */
  .section {
    margin-bottom: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  .section-header {
    background: #1a5c35;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    padding: 7px 14px;
    letter-spacing: 0.5px;
  }
  .section-body {
    padding: 10px 14px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .field.full {
    grid-column: 1 / -1;
  }
  .field-label {
    font-size: 10px;
    color: #666;
    font-weight: 600;
  }
  .field-value {
    font-size: 12.5px;
    color: #111;
    font-weight: 500;
    border-bottom: 1px dotted #ccc;
    padding-bottom: 2px;
    min-height: 20px;
  }

  /* ── Commitment ── */
  .commitment {
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.9;
    margin-bottom: 14px;
    color: #222;
  }

  /* ── Signature ── */
  .signature-area {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 14px;
  }
  .sig-block {
    text-align: center;
    width: 45%;
  }
  .sig-label {
    font-size: 11px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
  }
  .sig-name {
    font-size: 12px;
    color: #111;
    border-top: 1px solid #333;
    padding-top: 4px;
    margin-top: 28px;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
  }
  .footer-text {
    font-size: 9px;
    color: #555;
    line-height: 1.6;
    max-width: 75%;
  }
  .qr-placeholder {
    width: 60px;
    height: 60px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    color: #999;
    flex-shrink: 0;
  }
  .issue-date-line {
    text-align: center;
    font-size: 12px;
    margin-bottom: 14px;
    color: #333;
  }

  @media print {
    body { background: white; }
    .page { margin: 0; padding: 10mm 12mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="logo-wrap">
      <span class="logo-text">سند</span>
      <span class="logo-sub">منصة السندات الإلكترونية</span>
    </div>
    <div class="header-right">
      <div class="doc-title">سند لأمر</div>
      <div class="note-number">رقم السند: ${note.noteNumber}</div>
    </div>
  </div>

  <!-- Note Data -->
  <div class="section">
    <div class="section-header">بيانات السند</div>
    <div class="section-body">
      <div class="field">
        <div class="field-label">تاريخ الإنشاء</div>
        <div class="field-value">${issueDate}</div>
      </div>
      <div class="field">
        <div class="field-label">تاريخ الموافقة</div>
        <div class="field-value">${approvalDate}</div>
      </div>
      <div class="field">
        <div class="field-label">مكان الإنشاء</div>
        <div class="field-value">الرياض، المملكة العربية السعودية</div>
      </div>
      <div class="field">
        <div class="field-label">مكان الوفاء</div>
        <div class="field-value">الرياض، المملكة العربية السعودية</div>
      </div>
      <div class="field">
        <div class="field-label">قيمة السند رقماً</div>
        <div class="field-value">${Number(note.amount).toLocaleString("ar-SA")} ريال سعودي</div>
      </div>
      <div class="field">
        <div class="field-label">الغرض</div>
        <div class="field-value">${purposeAr}</div>
      </div>
      <div class="field full">
        <div class="field-label">قيمة السند كتابةً</div>
        <div class="field-value">${amountWords}</div>
      </div>
      <div class="field">
        <div class="field-label">تاريخ الاستحقاق</div>
        <div class="field-value">${dueDate}</div>
      </div>
      <div class="field">
        <div class="field-label">العملة</div>
        <div class="field-value">ريال سعودي</div>
      </div>
      ${note.description ? `
      <div class="field full">
        <div class="field-label">ملاحظات</div>
        <div class="field-value">${note.description}</div>
      </div>` : ""}
    </div>
  </div>

  <!-- Debtor -->
  <div class="section">
    <div class="section-header">بيانات محرر السند (المدين)</div>
    <div class="section-body">
      <div class="field">
        <div class="field-label">الاسم</div>
        <div class="field-value">${debtorName}</div>
      </div>
      <div class="field">
        <div class="field-label">رقم الهوية</div>
        <div class="field-value">${debtorId}</div>
      </div>
      <div class="field">
        <div class="field-label">نوع المستخدم</div>
        <div class="field-value">${debtorType}</div>
      </div>
    </div>
  </div>

  <!-- Creditor -->
  <div class="section">
    <div class="section-header">بيانات المستفيد (الدائن)</div>
    <div class="section-body">
      <div class="field">
        <div class="field-label">الاسم</div>
        <div class="field-value">${note.creditor.name}</div>
      </div>
      <div class="field">
        <div class="field-label">رقم الهوية</div>
        <div class="field-value">${note.creditor.nationalId}</div>
      </div>
      <div class="field">
        <div class="field-label">نوع المستخدم</div>
        <div class="field-value">${creditorType}</div>
      </div>
    </div>
  </div>

  <!-- Commitment text -->
  <div class="commitment">
    أتعهد تعهداً باتاً لا رجعة فيه دون قيد أو شرط بأن أدفع لأمر
    <strong>${note.creditor.name}</strong>
    مبلغاً وقدره
    <strong>${Number(note.amount).toLocaleString("ar-SA")} ريال سعودي</strong>
    (${amountWords})
    وفق البيانات المذكورة أعلاه، ولحامل هذا السند حق الرجوع مباشرة دون حاجة لأي مصاريف أو إشعار أو احتجاج بعدم الوفاء.
  </div>

  <!-- Issue date line -->
  <div class="issue-date-line">
    صدر بتاريخ: ${issueDate}
  </div>

  <!-- Signature -->
  <div class="signature-area">
    <div class="sig-block">
      <div class="sig-label">محرر السند (المدين)</div>
      <div class="sig-name">${debtorName}</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">المستفيد (الدائن)</div>
      <div class="sig-name">${note.creditor.name}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">
      هذا السند صادر من خلال منصة سند الإلكترونية تحت إشراف وزارة العدل ووزارة التجارة.
      وللاستشارة والاستفسار عن السند وبيانات الأطراف يمكنك التواصل عبر المنصة على الرقم الموحد.
    </div>
    <div class="qr-placeholder">QR</div>
  </div>

</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}