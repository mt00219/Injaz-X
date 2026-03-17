"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    ar: "لوحة التحكم",
    en: "Dashboard",
  },
  {
    href: "/notes",
    icon: FileText,
    ar: "السندات",
    en: "Notes",
  },
  {
    href: "/notes/create",
    icon: PlusCircle,
    ar: "سند جديد",
    en: "New Note",
    highlight: true,
  },
  {
    href: "/notifications",
    icon: Bell,
    ar: "الإشعارات",
    en: "Notifications",
  },
  {
    href: "/settings",
    icon: Settings,
    ar: "الإعدادات",
    en: "Settings",
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 z-40 flex flex-col bg-[#1B2B4B] shadow-xl transition-all duration-300",
        isRTL ? "right-0" : "left-0",
        collapsed ? "w-18" : "w-64"
      )}
      style={{ width: collapsed ? "72px" : "256px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-base leading-tight">
              {t("سند", "Sanad")}
            </p>
            <p className="text-white/50 text-xs">{t("منصة السندات", "Notes Platform")}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.ar, item.en) : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all duration-200 group",
                isActive
                  ? item.highlight
                    ? "bg-gradient-to-r from-[#006C35] to-[#00A651] text-white shadow-md"
                    : "bg-white/15 text-white"
                  : item.highlight
                  ? "border border-[#006C35]/40 text-[#00A651] hover:bg-[#006C35] hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{t(item.ar, item.en)}</span>
              )}
              {!collapsed && isActive && (
                <span className="mr-auto rtl:mr-auto ltr:ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
          title={collapsed ? t("تسجيل الخروج", "Sign Out") : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">{t("تسجيل الخروج", "Sign Out")}</span>
          )}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full mt-2 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {isRTL ? (
            collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
