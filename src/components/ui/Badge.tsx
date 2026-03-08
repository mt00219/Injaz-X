import React from "react";
import { cn } from "@/lib/utils";
import type { NoteStatus } from "@/types";

const statusConfig: Record<NoteStatus, { label: { ar: string; en: string }; className: string }> = {
  PENDING:   { label: { ar: "قيد الانتظار", en: "Pending"   }, className: "status-pending"   },
  ACTIVE:    { label: { ar: "نشط",          en: "Active"    }, className: "status-active"    },
  PAID:      { label: { ar: "مسدد",         en: "Paid"      }, className: "status-paid"      },
  OVERDUE:   { label: { ar: "متأخر",        en: "Overdue"   }, className: "status-overdue"   },
  CANCELLED: { label: { ar: "ملغي",         en: "Cancelled" }, className: "status-cancelled" },
  REJECTED:  { label: { ar: "مرفوض",        en: "Rejected"  }, className: "status-rejected"  },
};

interface BadgeProps {
  status: NoteStatus;
  lang?: "ar" | "en";
  className?: string;
}

export function StatusBadge({ status, lang = "ar", className }: BadgeProps) {
  const config = statusConfig[status] ?? statusConfig.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label[lang]}
    </span>
  );
}

interface GenericBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: GenericBadgeProps) {
  const variants = {
    default: "bg-[#F1F5F9] text-[#475569]",
    success: "bg-[#D1FAE5] text-[#065F46]",
    warning: "bg-[#FEF3C7] text-[#92400E]",
    danger:  "bg-[#FEE2E2] text-[#991B1B]",
    info:    "bg-[#DBEAFE] text-[#1E40AF]",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
