import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "SAR"): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, lang = "ar"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (lang === "ar") {
    return format(d, "dd MMMM yyyy", { locale: ar });
  }
  return format(d, "dd MMM yyyy");
}

export function generateNoteNumber(): string {
  const prefix = "INJ";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}-${year}-${random}`;
}

export const NOTE_STATUS_MAP = {
  ar: {
    PENDING: "قيد الانتظار",
    ACTIVE: "نشط",
    PAID: "مسدد",
    OVERDUE: "متأخر",
    CANCELLED: "ملغي",
    REJECTED: "مرفوض",
  },
  en: {
    PENDING: "Pending",
    ACTIVE: "Active",
    PAID: "Paid",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
  },
};

export const NOTE_PURPOSE_MAP = {
  ar: {
    COMMERCIAL: "تجاري",
    PERSONAL: "شخصي",
    REAL_ESTATE: "عقاري",
    EDUCATION: "تعليمي",
    VEHICLE: "مركبة",
    OTHER: "أخرى",
  },
  en: {
    COMMERCIAL: "Commercial",
    PERSONAL: "Personal",
    REAL_ESTATE: "Real Estate",
    EDUCATION: "Education",
    VEHICLE: "Vehicle",
    OTHER: "Other",
  },
};

export const USER_TYPE_MAP = {
  ar: {
    INDIVIDUAL: "فرد",
    COMPANY: "شركة",
    BANK: "بنك",
  },
  en: {
    INDIVIDUAL: "Individual",
    COMPANY: "Company",
    BANK: "Bank",
  },
};
