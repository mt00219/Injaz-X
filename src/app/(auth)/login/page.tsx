"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t, lang, setLang, isRTL } = useLanguage();
  const router = useRouter();
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      nationalId,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("رقم الهوية أو كلمة المرور غير صحيحة", "Invalid national ID or password"));
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const fillDemo = () => {
    setNationalId("1234567890");
    setPassword("password123");
  };

  return (
    <div
      className="min-h-screen flex"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Left / Hero panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B2B4B] via-[#162240] to-[#006C35] relative overflow-hidden flex-col justify-between p-12">
        {/* Decorations */}
        <div className="absolute top-0 right-0 rtl:right-0 ltr:left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 rtl:left-0 ltr:right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-2xl translate-y-1/3" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl">{t("إنجاز إكس", "Injaz X")}</p>
            <p className="text-white/50 text-xs">{t("منصة السندات الإلكترونية", "Electronic Notes Platform")}</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            {t("مرحباً بك في", "Welcome to")}
            <br />
            <span className="text-[#4ADE80]">{t("إنجاز إكس", "Injaz X")}</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            {t(
              "منصتك الموثوقة لإصدار وإدارة السندات الإلكترونية بكل أمان وسهولة",
              "Your trusted platform for issuing and managing electronic notes safely and easily"
            )}
          </p>
          {/* Feature list */}
          <div className="space-y-4">
            {[
              { ar: "إصدار فوري للسندات", en: "Instant note issuance" },
              { ar: "توقيع إلكتروني معتمد", en: "Certified digital signature" },
              { ar: "ربط بمحاكم التنفيذ", en: "Linked to execution courts" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#4ADE80]/20 border border-[#4ADE80]/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                </div>
                <span className="text-white/80 text-sm">{t(item.ar, item.en)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat */}
        <div className="relative flex gap-8">
          {[
            { val: "1.2M+", ar: "سند صادر", en: "Notes Issued" },
            { val: "85K+", ar: "مستخدم", en: "Users" },
            { val: "99.8%", ar: "نجاح", en: "Success" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-white/50 text-xs">{t(s.ar, s.en)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right / Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <p className="text-[#1B2B4B] font-black text-xl">{t("إنجاز إكس", "Injaz X")}</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A] mb-1">
                {t("تسجيل الدخول", "Sign In")}
              </h1>
              <p className="text-[#64748B] text-sm">
                {t("أدخل بيانات حسابك للمتابعة", "Enter your account details to continue")}
              </p>
            </div>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#475569] hover:bg-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === "ar" ? "EN" : "عر"}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* National ID */}
              <div>
                <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                  {t("رقم الهوية الوطنية", "National ID")}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 end-3 text-[#94A3B8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder={t("أدخل رقم الهوية", "Enter national ID")}
                    maxLength={10}
                    required
                    className="w-full h-11 px-4 pe-10 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                  {t("كلمة المرور", "Password")}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 end-3 text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-1/2 -translate-y-1/2 start-3 text-[#94A3B8] hover:text-[#475569]"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("أدخل كلمة المرور", "Enter password")}
                    required
                    className="w-full h-11 px-10 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-[#006C35] hover:underline font-medium">
                  {t("نسيت كلمة المرور؟", "Forgot password?")}
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-base rounded-xl hover:shadow-lg hover:shadow-[#006C35]/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {t("دخول", "Sign In")}
              </button>

              {/* Demo button */}
              <button
                type="button"
                onClick={fillDemo}
                className="w-full h-11 border-2 border-dashed border-[#006C35]/30 text-[#006C35] font-medium text-sm rounded-xl hover:bg-[#006C35]/5 transition-all duration-200"
              >
                {t("استخدام حساب تجريبي", "Use Demo Account")}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
            <Link href="/register" className="text-[#006C35] font-semibold hover:underline">
              {t("إنشاء حساب جديد", "Create new account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
