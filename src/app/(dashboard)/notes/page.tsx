"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Plus, Search, Filter, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { NoteWithParties, NoteStatus } from "@/types";

const STATUSES: { value: string; ar: string; en: string }[] = [
  { value: "ALL",       ar: "الكل",         en: "All"       },
  { value: "PENDING",   ar: "انتظار",        en: "Pending"   },
  { value: "ACTIVE",    ar: "نشط",           en: "Active"    },
  { value: "PAID",      ar: "مسدد",          en: "Paid"      },
  { value: "OVERDUE",   ar: "متأخر",         en: "Overdue"   },
  { value: "CANCELLED", ar: "ملغي",          en: "Cancelled" },
];

const ROLES = [
  { value: "ALL",      ar: "الكل",     en: "All Roles"  },
  { value: "CREDITOR", ar: "دائن",     en: "Creditor"   },
  { value: "DEBTOR",   ar: "مدين",     en: "Debtor"     },
];

export default function NotesPage() {
  const { t, isRTL, lang } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [notes, setNotes] = useState<NoteWithParties[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(status !== "ALL" && { status }),
      ...(role !== "ALL" && { role }),
      ...(search && { search }),
      page: String(page),
      limit: String(limit),
    });
    try {
      const res = await fetch(`/api/notes?${params}`);
      if (res.ok) {
        const d = await res.json();
        setNotes(d.notes ?? []);
        setTotal(d.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [status, role, search, page]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <Header
        title={t("السندات الإلكترونية", "Electronic Notes")}
        subtitle={t(`إجمالي ${total} سند`, `Total ${total} notes`)}
      />

      <div className="p-6 space-y-5">
        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t("بحث برقم السند أو الهوية...", "Search by note number or ID...")}
                className="w-full h-10 px-4 pe-10 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Role filter */}
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setPage(1); }}
                className="h-10 px-3 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] focus:border-[#006C35] focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{t(r.ar, r.en)}</option>
                ))}
              </select>

              <Link
                href="/notes/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#006C35] text-white text-sm font-semibold rounded-xl hover:bg-[#004D26] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {t("سند جديد", "New Note")}
              </Link>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  status === s.value
                    ? "bg-[#006C35] text-white shadow-sm"
                    : "text-[#64748B] hover:bg-[#F1F5F9]"
                }`}
              >
                {t(s.ar, s.en)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold text-[#64748B] uppercase tracking-wide">
            <div className="col-span-3">{t("رقم السند", "Note #")}</div>
            <div className="col-span-2 hidden md:block">{t("الطرف الآخر", "Other Party")}</div>
            <div className="col-span-2">{t("المبلغ", "Amount")}</div>
            <div className="col-span-2 hidden lg:block">{t("تاريخ الاستحقاق", "Due Date")}</div>
            <div className="col-span-2">{t("الحالة", "Status")}</div>
            <div className="col-span-1 text-center">{t("إجراء", "Action")}</div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-[#F8FAFC] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#CBD5E1]" />
              </div>
              <p className="text-[#64748B] font-medium mb-1">{t("لا توجد سندات", "No notes found")}</p>
              <p className="text-sm text-[#94A3B8]">{t("جرب تغيير معايير البحث", "Try changing search criteria")}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#006C35]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{note.noteNumber}</p>
                        <p className="text-xs text-[#94A3B8]">{formatDate(note.issueDate, lang)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    {user?.id === note.creditor.id ? (
                      <>
                        <p className="text-sm font-medium text-[#0F172A] truncate">
                          {note.debtor?.name ?? note.debtorNationalId ?? "—"}
                        </p>
                        <p className="text-xs text-[#94A3B8]">{t("مدين", "Debtor")}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-[#0F172A] truncate">
                          {note.creditor.name}
                        </p>
                        <p className="text-xs text-[#94A3B8]">{t("دائن", "Creditor")}</p>
                      </>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-[#0F172A]">{formatCurrency(note.amount)}</p>
                    <p className="text-xs text-[#94A3B8]">{note.currency}</p>
                  </div>
                  <div className="col-span-2 hidden lg:block">
                    <p className="text-sm text-[#475569]">{formatDate(note.dueDate, lang)}</p>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={note.status} lang={lang} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Link
                      href={`/notes/${note.id}`}
                      className="p-2 rounded-lg text-[#94A3B8] hover:text-[#006C35] hover:bg-[#E8F5EE] transition-all"
                      title={t("عرض", "View")}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">
                {t(`عرض ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} من ${total}`,
                   `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`)}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 transition-all"
                >
                  {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? "bg-[#006C35] text-white shadow-sm"
                          : "text-[#475569] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 transition-all"
                >
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
