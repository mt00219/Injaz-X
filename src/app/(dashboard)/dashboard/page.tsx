"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowLeft,
  ArrowRight,
  Eye,
} from "lucide-react";
import type { DashboardStats, NoteWithParties } from "@/types";

const COLORS = ["#006C35", "#F59E0B", "#3B82F6", "#EF4444", "#64748B"];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t, isRTL, lang } = useLanguage();
  const user = session?.user as any;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentNotes, setRecentNotes] = useState<NoteWithParties[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, notesRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/notes?limit=5"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (notesRes.ok) {
          const d = await notesRes.json();
          setRecentNotes(d.notes ?? []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("صباح الخير", "Good morning");
    if (h < 17) return t("مساء الخير", "Good afternoon");
    return t("مساء الخير", "Good evening");
  };

  const pieData = stats
    ? [
        { name: t("نشط", "Active"),    value: stats.activeNotes,   color: "#006C35" },
        { name: t("انتظار", "Pending"), value: stats.pendingNotes,  color: "#F59E0B" },
        { name: t("مسدد", "Paid"),      value: stats.paidNotes,     color: "#3B82F6" },
        { name: t("متأخر", "Overdue"),  value: stats.overdueNotes,  color: "#EF4444" },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div>
      <Header
        title={`${greeting()}، ${user?.name?.split(" ")[0] ?? ""}`}
        subtitle={t("هذا ملخص نشاطك الأخير", "Here's a summary of your recent activity")}
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title={t("إجمالي السندات", "Total Notes")}
            value={loading ? "—" : (stats?.totalNotes ?? 0).toLocaleString()}
            icon={<FileText className="w-6 h-6" />}
            color="navy"
            trend={{ value: 12, label: t("مقارنة بالشهر الماضي", "vs last month") }}
          />
          <StatCard
            title={t("السندات النشطة", "Active Notes")}
            value={loading ? "—" : (stats?.activeNotes ?? 0).toLocaleString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
            trend={{ value: 8, label: t("هذا الأسبوع", "this week") }}
          />
          <StatCard
            title={t("قيد الانتظار", "Pending Signature")}
            value={loading ? "—" : (stats?.pendingNotes ?? 0).toLocaleString()}
            icon={<Clock className="w-6 h-6" />}
            color="gold"
          />
          <StatCard
            title={t("متأخرة السداد", "Overdue Notes")}
            value={loading ? "—" : (stats?.overdueNotes ?? 0).toLocaleString()}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Second row: Amount stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <StatCard
            title={t("إجمالي المبالغ الصادرة", "Total Amount Issued")}
            value={loading ? "—" : formatCurrency(stats?.totalAmountIssued ?? 0)}
            subtitle={t("ريال سعودي", "Saudi Riyals")}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title={t("المبالغ المحصلة", "Amount Collected")}
            value={loading ? "—" : formatCurrency(stats?.totalAmountPaid ?? 0)}
            subtitle={t("ريال سعودي", "Saudi Riyals")}
            icon={<CheckCircle className="w-6 h-6" />}
            color="blue"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Area Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {t("نشاط السندات الشهري", "Monthly Notes Activity")}
                </h3>
                <p className="text-sm text-[#64748B]">{t("آخر 6 أشهر", "Last 6 months")}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={stats?.monthlyData ?? []}>
                <defs>
                  <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006C35" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006C35" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  labelStyle={{ color: "#0F172A", fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="issued" name={t("صادر", "Issued")} stroke="#006C35" strokeWidth={2.5} fill="url(#colorIssued)" />
                <Area type="monotone" dataKey="paid"   name={t("مسدد", "Paid")}   stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorPaid)"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              {t("توزيع السندات", "Notes Distribution")}
            </h3>
            <p className="text-sm text-[#64748B] mb-4">{t("حسب الحالة", "By status")}</p>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: "Empty", value: 1, color: "#E2E8F0" }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(pieData.length ? pieData : [{ color: "#E2E8F0" }]).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-2">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                      <span className="text-[#475569]">{entry.name}</span>
                    </div>
                    <span className="font-semibold text-[#0F172A]">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A]">
              {t("آخر السندات", "Recent Notes")}
            </h3>
            <div className="flex items-center gap-3">
              <Link
                href="/notes/create"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006C35] text-white text-xs font-semibold rounded-lg hover:bg-[#004D26] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t("سند جديد", "New Note")}
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-1.5 text-sm text-[#006C35] font-medium hover:underline"
              >
                {t("عرض الكل", "View All")}
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-[#F8FAFC] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#CBD5E1]" />
              </div>
              <p className="text-[#64748B] font-medium">{t("لا توجد سندات بعد", "No notes yet")}</p>
              <Link
                href="/notes/create"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#006C35] text-white text-sm font-semibold rounded-xl hover:bg-[#004D26] transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("إصدار أول سند", "Issue First Note")}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#006C35]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {note.noteNumber}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {t("المدين:", "Debtor:")} {note.debtor?.name ?? note.debtorNationalId ?? t("—", "—")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-end rtl:text-end ltr:text-start hidden sm:block">
                      <p className="text-sm font-bold text-[#0F172A]">{formatCurrency(note.amount)}</p>
                      <p className="text-xs text-[#64748B]">{formatDate(note.dueDate, lang)}</p>
                    </div>
                    <StatusBadge status={note.status} lang={lang} />
                    <Link href={`/notes/${note.id}`} className="p-1.5 text-[#94A3B8] hover:text-[#006C35] transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
