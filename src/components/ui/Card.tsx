import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E2E8F0] shadow-sm",
        hover && "card-hover cursor-pointer",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "green" | "navy" | "gold" | "red" | "blue";
  trend?: { value: number; label: string };
}

export function StatCard({ title, value, subtitle, icon, color = "green", trend }: StatCardProps) {
  const colors = {
    green: { bg: "bg-[#E8F5EE]", text: "text-[#006C35]", border: "border-[#006C35]/20" },
    navy:  { bg: "bg-[#EEF1F8]", text: "text-[#1B2B4B]", border: "border-[#1B2B4B]/20" },
    gold:  { bg: "bg-[#FDF6E3]", text: "text-[#9A7B35]", border: "border-[#C9A84C]/20" },
    red:   { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#EF4444]/20" },
    blue:  { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", border: "border-[#3B82F6]/20" },
  };
  const c = colors[color];

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#64748B] font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#0F172A] leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-500"}`}>
              <span>{trend.value >= 0 ? "+" : ""}{trend.value}%</span>
              <span className="text-[#94A3B8]">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl border", c.bg, c.border)}>
          <div className={cn("w-6 h-6", c.text)}>{icon}</div>
        </div>
      </div>
      {/* Decorative corner */}
      <div className={cn("absolute -bottom-4 -left-4 rtl:-left-4 ltr:-right-4 w-20 h-20 rounded-full opacity-5", c.bg)} />
    </Card>
  );
}
