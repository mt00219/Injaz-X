"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  Download,
} from "lucide-react";
import type { NoteWithParties } from "@/types";

const ACTION_LABELS: Record<string, { ar: string; en: string }> = {
  ISSUED:    { ar: "تم إصدار السند",       en: "Note Issued"       },
  SIGNED:    { ar: "تم توقيع السند",       en: "Note Signed"       },
  PAID:      { ar: "تم تسديد السند",       en: "Note Paid"         },
  REJECTED:  { ar: "تم رفض السند",         en: "Note Rejected"     },
  CANCELLED: { ar: "تم إلغاء السند",       en: "Note Cancelled"    },
  OVERDUE:   { ar: "السند متأخر السداد",    en: "Note Overdue"      },
  CREATED:   { ar: "تم إنشاء السند",       en: "Note Created"      },
};

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { t, isRTL, lang } = useLanguage();
  const [note, setNote] = useState<NoteWithParties | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const user = session?.user as any;

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/notes/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.id) setNote(d);
        else setError(t("السند غير موجود", "Note not found"));
      })
      .catch(() => setError(t("حدث خطأ", "An error occurred")))
      .finally(() => setLoading(false));
  }, [params.id]);

  const doAction = async (action: "SIGN" | "REJECT" | "PAY" | "CANCEL") => {
    setActionLoading(action);
    try {
      const res = await fetch(`/api/notes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) setNote(data);
      else setError(data.error ?? t("حدث خطأ", "An error occurred"));
    } finally {
      setActionLoading("");
    }
  };

  const isCreditor = note && user?.id === note.creditor.id;
  const isDebtor   = note && user?.id === note.debtor?.id;

  if (loading) {
    return (
      <div>
        <Header title={t("تفاصيل السند", "Note Details")} />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-[#E2E8F0] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div>
        <Header title={t("تفاصيل السند", "Note Details")} />
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-[#0F172A] font-bold mb-2">{error}</p>
            <button onClick={() => router.back()} className="text-[#006C35] hover:underline text-sm">
              {t("العودة", "Go Back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t("تفاصيل السند", "Note Details")}
        subtitle={note.noteNumber}
      />

      <div className="p-6 space-y-6">
        {/* Back + Actions bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            {t("العودة للسندات", "Back to Notes")}
          </button>

          <div className="flex items-center gap-2">
            {/* Debtor actions */}
            {isDebtor && note.status === "PENDING" && (
              <>
                <button
                  onClick={() => doAction("SIGN")}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#006C35] text-white text-sm font-semibold rounded-xl hover:bg-[#004D26] transition-colors disabled:opacity-60"
                >
                  {actionLoading === "SIGN" ? <span className="animate-spin">⟳</span> : <CheckCircle className="w-4 h-4" />}
                  {t("توقيع وقبول", "Sign & Accept")}
                </button>
                <button
                  onClick={() => doAction("REJECT")}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {actionLoading === "REJECT" ? <span className="animate-spin">⟳</span> : <XCircle className="w-4 h-4" />}
                  {t("رفض", "Reject")}
                </button>
              </>
            )}
            {/* Creditor: confirm payment */}
            {isCreditor && note.status === "ACTIVE" && (
              <button
                onClick={() => doAction("PAY")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white text-sm font-semibold rounded-xl hover:bg-[#2563EB] transition-colors disabled:opacity-60"
              >
                {actionLoading === "PAY" ? <span className="animate-spin">⟳</span> : <CheckCircle className="w-4 h-4" />}
                {t("تأكيد الاستلام", "Confirm Receipt")}
              </button>
            )}
            {/* Creditor: cancel pending */}
            {isCreditor && note.status === "PENDING" && (
              <button
                onClick={() => doAction("CANCEL")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
              >
                {t("إلغاء", "Cancel")}
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <Download className="w-4 h-4" />
              {t("تحميل", "Download")}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center shadow-md">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-0.5">{t("رقم السند", "Note Number")}</p>
                    <p className="text-xl font-black text-[#0F172A]">{note.noteNumber}</p>
                  </div>
                </div>
                <StatusBadge status={note.status} lang={lang} />
              </div>

              {/* Amount highlight */}
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] rounded-xl p-5 mb-6 text-center border border-[#E2E8F0]">
                <p className="text-sm text-[#64748B] mb-1">{t("قيمة السند", "Note Amount")}</p>
                <p className="text-4xl font-black text-[#006C35]">{formatCurrency(note.amount)}</p>
                <p className="text-sm text-[#94A3B8] mt-1">{note.currency}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: { ar: "تاريخ الإصدار", en: "Issue Date" },      value: formatDate(note.issueDate, lang) },
                  { icon: Calendar, label: { ar: "تاريخ الاستحقاق", en: "Due Date" },    value: formatDate(note.dueDate, lang) },
                  { icon: DollarSign, label: { ar: "العملة", en: "Currency" },            value: note.currency },
                  { icon: FileText,   label: { ar: "الغرض", en: "Purpose" },              value: note.purpose ? t(note.purpose, note.purpose) : "—" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8]">{t(item.label.ar, item.label.en)}</p>
                      <p className="text-sm font-semibold text-[#0F172A]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {note.description && (
                <div className="mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <p className="text-xs text-[#94A3B8] mb-1">{t("الملاحظات", "Notes")}</p>
                  <p className="text-sm text-[#475569]">{note.description}</p>
                </div>
              )}
            </div>

            {/* Parties */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
              <h3 className="text-base font-bold text-[#0F172A] mb-4">{t("أطراف السند", "Note Parties")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Creditor */}
                <div className="p-4 bg-[#E8F5EE] border border-[#006C35]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#006C35] flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#006C35] uppercase tracking-wide">{t("الدائن", "Creditor")}</span>
                  </div>
                  <p className="text-sm font-bold text-[#0F172A]">{note.creditor.name}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{t("الهوية:", "ID:")} {note.creditor.nationalId}</p>
                  <p className="text-xs text-[#64748B]">
                    {note.creditor.userType === "COMPANY" ? t("شركة", "Company") : note.creditor.userType === "BANK" ? t("بنك", "Bank") : t("فرد", "Individual")}
                  </p>
                </div>

                {/* Debtor */}
                <div className="p-4 bg-[#EEF1F8] border border-[#1B2B4B]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#1B2B4B] flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#1B2B4B] uppercase tracking-wide">{t("المدين", "Debtor")}</span>
                  </div>
                  {note.debtor ? (
                    <>
                      <p className="text-sm font-bold text-[#0F172A]">{note.debtor.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{t("الهوية:", "ID:")} {note.debtor.nationalId}</p>
                      <p className="text-xs text-[#64748B]">
                        {note.debtor.userType === "COMPANY" ? t("شركة", "Company") : note.debtor.userType === "BANK" ? t("بنك", "Bank") : t("فرد", "Individual")}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-[#0F172A]">{t("في انتظار التسجيل", "Awaiting Registration")}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{t("الهوية:", "ID:")} {note.debtorNationalId}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 h-fit">
            <h3 className="text-base font-bold text-[#0F172A] mb-5">{t("سجل الأحداث", "Activity Timeline")}</h3>
            {note.history && note.history.length > 0 ? (
              <div className="relative">
                <div className="absolute top-0 bottom-0 start-4 w-px bg-[#E2E8F0]" />
                <div className="space-y-5">
                  {note.history.map((event, i) => {
                    const label = ACTION_LABELS[event.action];
                    const isFirst = i === 0;
                    return (
                      <div key={event.id} className="relative flex gap-4 ps-10">
                        <div className={`absolute start-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${
                          isFirst ? "bg-[#006C35] border-[#006C35]" : "bg-white border-[#E2E8F0]"
                        }`}>
                          {event.action === "ISSUED" || event.action === "CREATED" ? (
                            <FileText className={`w-3.5 h-3.5 ${isFirst ? "text-white" : "text-[#94A3B8]"}`} />
                          ) : event.action === "SIGNED" || event.action === "PAID" ? (
                            <CheckCircle className={`w-3.5 h-3.5 ${isFirst ? "text-white" : "text-[#006C35]"}`} />
                          ) : event.action === "REJECTED" || event.action === "CANCELLED" ? (
                            <XCircle className={`w-3.5 h-3.5 ${isFirst ? "text-white" : "text-red-500"}`} />
                          ) : (
                            <Clock className={`w-3.5 h-3.5 ${isFirst ? "text-white" : "text-[#94A3B8]"}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {label ? t(label.ar, label.en) : event.action}
                          </p>
                          {event.actorName && (
                            <p className="text-xs text-[#64748B]">{t("بواسطة:", "By:")} {event.actorName}</p>
                          )}
                          {event.details && (
                            <p className="text-xs text-[#94A3B8] mt-0.5">{event.details}</p>
                          )}
                          <p className="text-xs text-[#CBD5E1] mt-1">
                            {formatDate(event.createdAt, lang)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                <p className="text-sm text-[#94A3B8]">{t("لا توجد أحداث", "No events yet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
