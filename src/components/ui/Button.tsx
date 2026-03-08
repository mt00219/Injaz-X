"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#006C35] hover:bg-[#004D26] text-white focus:ring-[#006C35] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#1B2B4B] hover:bg-[#0F1B33] text-white focus:ring-[#1B2B4B] shadow-sm hover:shadow-md",
    outline:
      "border-2 border-[#006C35] text-[#006C35] hover:bg-[#006C35] hover:text-white focus:ring-[#006C35]",
    ghost:
      "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus:ring-[#006C35]",
    danger:
      "bg-[#EF4444] hover:bg-[#DC2626] text-white focus:ring-[#EF4444] shadow-sm",
    gold:
      "bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] hover:from-[#B8933D] hover:to-[#D4B555] text-white focus:ring-[#C9A84C] shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "text-sm px-4 py-2 h-9",
    md: "text-sm px-5 py-2.5 h-10",
    lg: "text-base px-7 py-3 h-12",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
