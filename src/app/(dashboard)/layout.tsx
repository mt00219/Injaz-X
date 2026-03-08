"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 bg-[#006C35] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const sidebarWidth = collapsed ? 72 : 256;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="transition-all duration-300 min-h-screen"
        style={isRTL ? { marginRight: sidebarWidth } : { marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
