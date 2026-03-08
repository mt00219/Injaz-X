"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/context/LanguageContext";
import { Bell, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const mockNotifications = [
  { id: 1, type: "SIGNED",  icon: CheckCircle, color: "text-[#006C35] bg-[#E8F5EE]", time: "منذ ساعتين",   time_en: "2h ago",      ar: "وقّع أحمد العمري على السند INJ-2025-488901",      en: "Ahmed Al-Omari signed note INJ-2025-488901" },
  { id: 2, type: "PENDING", icon: Clock,        color: "text-[#F59E0B] bg-[#FEF3C7]", time: "منذ 5 ساعات",  time_en: "5h ago",      ar: "طلب توقيع جديد من محمد السالم",                   en: "New signature request from Mohammed Al-Salim" },
  { id: 3, type: "OVERDUE", icon: AlertTriangle,color: "text-[#EF4444] bg-[#FEE2E2]", time: "منذ يوم",      time_en: "1d ago",      ar: "السند INJ-2025-412234 تجاوز تاريخ الاستحقاق",     en: "Note INJ-2025-412234 is past due date" },
  { id: 4, type: "PAID",    icon: CheckCircle,  color: "text-[#3B82F6] bg-[#DBEAFE]", time: "منذ يومين",    time_en: "2d ago",      ar: "تم تأكيد استلام مبلغ السند INJ-2025-399871",      en: "Payment confirmed for note INJ-2025-399871" },
  { id: 5, type: "SIGNED",  icon: CheckCircle,  color: "text-[#006C35] bg-[#E8F5EE]", time: "منذ 3 أيام",   time_en: "3d ago",      ar: "تم إصدار سند جديد برقم INJ-2025-388120",          en: "New note issued: INJ-2025-388120" },
];

export default function NotificationsPage() {
  const { t, lang } = useLanguage();

  return (
    <div>
      <Header
        title={t("الإشعارات", "Notifications")}
        subtitle={t("جميع التنبيهات والتحديثات", "All alerts and updates")}
      />

      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-base font-bold text-[#0F172A]">{t("آخر الإشعارات", "Recent Notifications")}</h3>
            <button className="text-sm text-[#006C35] font-medium hover:underline">
              {t("تعليم الكل كمقروء", "Mark all as read")}
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {mockNotifications.map((n, i) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors ${i < 2 ? "bg-[#FAFCFF]" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A]">{t(n.ar, n.en)}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{lang === "ar" ? n.time : n.time_en}</p>
                  </div>
                  {i < 2 && (
                    <div className="w-2 h-2 bg-[#006C35] rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
