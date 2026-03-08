"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const { lang, setLang, t } = useLanguage();
  const user = session?.user as any;

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
    : "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">{title}</h1>
          {subtitle && <p className="text-sm text-[#64748B]">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 w-64">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder={t("بحث...", "Search...")}
              className="flex-1 text-sm bg-transparent outline-none text-[#0F172A] placeholder-[#94A3B8]"
            />
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === "ar" ? "EN" : "عر"}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] transition-all duration-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 rtl:right-1.5 ltr:left-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-[#0F172A] leading-tight">
                {user?.name ?? t("مستخدم", "User")}
              </p>
              <p className="text-xs text-[#64748B]">
                {user?.userType === "COMPANY"
                  ? t("شركة", "Company")
                  : user?.userType === "BANK"
                  ? t("بنك", "Bank")
                  : t("فرد", "Individual")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
