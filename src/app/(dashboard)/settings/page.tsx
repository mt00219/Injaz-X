"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/context/LanguageContext";
import { User, Shield, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { t, lang, setLang } = useLanguage();
  const user = session?.user as any;

  return (
    <div>
      <Header
        title={t("الإعدادات", "Settings")}
        subtitle={t("إدارة حسابك وتفضيلاتك", "Manage your account and preferences")}
      />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] flex items-center justify-center">
              <User className="w-4 h-4 text-[#006C35]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">{t("بيانات الحساب", "Account Info")}</h3>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center text-white text-2xl font-black shadow-md">
              {user?.name?.[0] ?? "U"}
            </div>
            <div>
              <p className="text-lg font-black text-[#0F172A]">{user?.name ?? "—"}</p>
              <p className="text-sm text-[#64748B]">{user?.nationalId ?? "—"}</p>
              <p className="text-xs text-[#94A3B8]">
                {user?.userType === "COMPANY" ? t("شركة", "Company") : user?.userType === "BANK" ? t("بنك", "Bank") : t("فرد", "Individual")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: { ar: "الاسم الكامل", en: "Full Name" }, value: user?.name ?? "—" },
              { label: { ar: "رقم الهوية",   en: "National ID" }, value: user?.nationalId ?? "—" },
              { label: { ar: "البريد الإلكتروني", en: "Email" }, value: user?.email ?? t("غير محدد", "Not set") },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-xs text-[#94A3B8] mb-1">{t(field.label.ar, field.label.en)}</label>
                <div className="h-10 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center text-sm text-[#475569]">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#EEF1F8] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#1B2B4B]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">{t("اللغة", "Language")}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "ar", label: "العربية", sub: "Arabic (RTL)" },
              { value: "en", label: "English", sub: "الإنجليزية (LTR)" },
            ].map((l) => (
              <button
                key={l.value}
                onClick={() => setLang(l.value as "ar" | "en")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  lang === l.value
                    ? "border-[#006C35] bg-[#E8F5EE]"
                    : "border-[#E2E8F0] hover:border-[#006C35]/30"
                }`}
              >
                <p className={`font-bold ${lang === l.value ? "text-[#006C35]" : "text-[#0F172A]"}`}>{l.label}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{l.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#FDF6E3] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#9A7B35]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">{t("الأمان", "Security")}</h3>
          </div>

          <button className="w-full h-11 border-2 border-[#E2E8F0] text-[#475569] text-sm font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all text-start px-4">
            {t("تغيير كلمة المرور", "Change Password")}
          </button>
        </div>
      </div>
    </div>
  );
}
