"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type UserType = "INDIVIDUAL" | "COMPANY" | "BANK";

export default function RegisterPage() {
  const { t, lang, setLang, isRTL } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    nationalId: "",
    email: "",
    phone: "",
    userType: "INDIVIDUAL" as UserType,
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  const updateForm = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    if (!form.name || !form.nationalId || !form.userType) {
      setError(t("يرجى ملء جميع الحقول المطلوبة", "Please fill all required fields"));
      return false;
    }
    if (form.nationalId.length !== 10) {
      setError(t("رقم الهوية يجب أن يكون 10 أرقام", "National ID must be 10 digits"));
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!form.password || form.password.length < 8) {
      setError(t("كلمة المرور يجب أن تكون 8 أحرف على الأقل", "Password must be at least 8 characters"));
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("كلمة المرور وتأكيدها غير متطابقين", "Passwords do not match"));
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nationalId: form.nationalId,
          email: form.email || undefined,
          phone: form.phone || undefined,
          userType: form.userType,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("حدث خطأ، يرجى المحاولة مرة أخرى", "An error occurred, please try again"));
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError(t("حدث خطأ في الاتصال", "Connection error occurred"));
      setLoading(false);
    }
  };

  const userTypes = [
    { value: "INDIVIDUAL", ar: "فرد", en: "Individual", desc_ar: "مواطن أو مقيم", desc_en: "Citizen or resident" },
    { value: "COMPANY",    ar: "شركة", en: "Company",    desc_ar: "منشأة تجارية",    desc_en: "Business entity"    },
    { value: "BANK",       ar: "بنك",  en: "Bank",       desc_ar: "مؤسسة مالية",     desc_en: "Financial institution" },
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#006C35]" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-2">
            {t("تم إنشاء الحساب بنجاح!", "Account created successfully!")}
          </h2>
          <p className="text-[#64748B]">
            {t("جاري تحويلك لصفحة الدخول...", "Redirecting to sign in...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir={isRTL ? "rtl" : "ltr"}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B2B4B] via-[#162240] to-[#006C35] relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute top-0 right-0 rtl:right-0 ltr:left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 rtl:left-0 ltr:right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-2xl translate-y-1/3" />

        <div className="relative flex items-center gap-3 mb-16">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl">{t("إنجاز إكس", "Injaz X")}</p>
            <p className="text-white/50 text-xs">{t("منصة السندات الإلكترونية", "Electronic Notes Platform")}</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            {t("انضم إلى آلاف المستخدمين", "Join Thousands of Users")}
          </h2>
          <p className="text-white/70 leading-relaxed mb-10">
            {t(
              "أنشئ حسابك في دقيقة واحدة وابدأ في إصدار سنداتك الإلكترونية بأمان وموثوقية كاملة",
              "Create your account in one minute and start issuing electronic notes securely and reliably"
            )}
          </p>

          {/* Progress steps */}
          <div className="space-y-4">
            {[
              { ar: "بيانات الهوية", en: "Identity Data", num: 1 },
              { ar: "كلمة المرور", en: "Password Setup", num: 2 },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  step === s.num
                    ? "bg-white/15 border border-white/20"
                    : step > s.num
                    ? "opacity-50"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    step > s.num
                      ? "bg-[#4ADE80] text-[#065F46]"
                      : step === s.num
                      ? "bg-white text-[#1B2B4B]"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-white font-medium">{t(s.ar, s.en)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right / Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${step === 1 ? "bg-[#006C35] text-white" : "bg-[#D1FAE5] text-[#006C35]"}`}>
                  {t("الخطوة", "Step")} {step}/2
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#0F172A]">
                {step === 1 ? t("بيانات الهوية", "Identity Data") : t("كلمة المرور", "Password Setup")}
              </h1>
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

            {step === 1 && (
              <div className="space-y-5">
                {/* User Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-2">
                    {t("نوع الحساب", "Account Type")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {userTypes.map((ut) => (
                      <button
                        key={ut.value}
                        type="button"
                        onClick={() => updateForm("userType", ut.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          form.userType === ut.value
                            ? "border-[#006C35] bg-[#E8F5EE]"
                            : "border-[#E2E8F0] hover:border-[#006C35]/30"
                        }`}
                      >
                        <p className={`text-sm font-bold ${form.userType === ut.value ? "text-[#006C35]" : "text-[#0F172A]"}`}>
                          {t(ut.ar, ut.en)}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{t(ut.desc_ar, ut.desc_en)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {form.userType === "INDIVIDUAL" ? t("الاسم الكامل", "Full Name") : t("اسم المنشأة", "Entity Name")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder={t("أدخل الاسم", "Enter name")}
                    required
                    className="w-full h-11 px-4 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {form.userType === "INDIVIDUAL" ? t("رقم الهوية الوطنية", "National ID") : t("رقم السجل التجاري", "Commercial Registration")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nationalId}
                    onChange={(e) => updateForm("nationalId", e.target.value.replace(/\D/g, ""))}
                    placeholder="1234567890"
                    maxLength={10}
                    required
                    className="w-full h-11 px-4 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">{t("10 أرقام", "10 digits")}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("البريد الإلكتروني", "Email Address")}
                    <span className="text-[#94A3B8] text-xs mr-1">({t("اختياري", "optional")})</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="example@email.com"
                    className="w-full h-11 px-4 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("رقم الجوال", "Mobile Number")}
                    <span className="text-[#94A3B8] text-xs mr-1">({t("اختياري", "optional")})</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full h-11 px-4 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-12 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-base rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t("التالي", "Next")}
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("كلمة المرور", "Password")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-1/2 -translate-y-1/2 start-3 text-[#94A3B8] hover:text-[#475569]"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      placeholder={t("8 أحرف على الأقل", "At least 8 characters")}
                      required
                      className="w-full h-11 ps-10 px-4 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                  {/* Strength indicator */}
                  {form.password && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            form.password.length >= i * 2
                              ? i <= 2 ? "bg-[#F59E0B]" : "bg-[#006C35]"
                              : "bg-[#E2E8F0]"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("تأكيد كلمة المرور", "Confirm Password")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => updateForm("confirmPassword", e.target.value)}
                    placeholder={t("أعد إدخال كلمة المرور", "Re-enter password")}
                    required
                    className={`w-full h-11 px-4 text-sm rounded-xl border bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:bg-white transition-all ${
                      form.confirmPassword && form.password !== form.confirmPassword
                        ? "border-red-400"
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? "border-[#006C35]"
                        : "border-[#E2E8F0]"
                    }`}
                  />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <p className="text-xs text-[#006C35] mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t("كلمتا المرور متطابقتان", "Passwords match")}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-2 border-[#E2E8F0] text-[#475569] font-semibold text-base rounded-xl hover:bg-[#F8FAFC] transition-all duration-200"
                  >
                    {t("السابق", "Back")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-base rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {t("إنشاء الحساب", "Create Account")}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            {t("لديك حساب بالفعل؟", "Already have an account?")}{" "}
            <Link href="/login" className="text-[#006C35] font-semibold hover:underline">
              {t("تسجيل الدخول", "Sign In")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
