import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#1B2B4B]">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] rtl:right-3 ltr:left-3">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-11 px-4 text-sm rounded-xl border bg-white text-[#0F172A] placeholder-[#94A3B8]",
            "border-[#E2E8F0] transition-all duration-200",
            "focus:border-[#006C35] focus:outline-none",
            error ? "border-red-400 bg-red-50" : "",
            leftIcon ? "pr-10 rtl:pr-10 ltr:pl-10" : "",
            rightIcon ? "pl-10 rtl:pl-10 ltr:pr-10" : "",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] rtl:left-3 ltr:right-3">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#1B2B4B]">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-4 py-3 text-sm rounded-xl border bg-white text-[#0F172A] placeholder-[#94A3B8]",
          "border-[#E2E8F0] transition-all duration-200 resize-none",
          "focus:border-[#006C35] focus:outline-none",
          error ? "border-red-400 bg-red-50" : "",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id ?? label?.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#1B2B4B]">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full h-11 px-4 text-sm rounded-xl border bg-white text-[#0F172A]",
          "border-[#E2E8F0] transition-all duration-200 cursor-pointer appearance-none",
          "focus:border-[#006C35] focus:outline-none",
          error ? "border-red-400 bg-red-50" : "",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
