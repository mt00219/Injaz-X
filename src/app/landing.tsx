"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Shield,
  FileText,
  Zap,
  Lock,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Globe,
  Award,
  Clock,
  BarChart3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const stats = [
  { ar: "سند إلكتروني صادر", en: "Electronic Notes Issued",  value: "1,200,000+" },
  { ar: "مستخدم مسجل",       en: "Registered Users",        value: "85,000+"     },
  { ar: "معدل النجاح",        en: "Success Rate",            value: "99.8%"       },
  { ar: "مليار ريال معالج",   en: "SAR Billion Processed",  value: "45+"         },
];

const features = [
  {
    icon: Zap,
    color: "bg-[#E8F5EE] text-[#006C35]",
    ar: { title: "إصدار فوري", desc: "أصدر سندك الإلكتروني في ثوانٍ معدودة بخطوات بسيطة" },
    en: { title: "Instant Issuance", desc: "Issue your electronic note in seconds with simple steps" },
  },
  {
    icon: Shield,
    color: "bg-[#EEF1F8] text-[#1B2B4B]",
    ar: { title: "أمان وموثوقية", desc: "حماية كاملة للبيانات وتشفير عالي المستوى يضمن سرية معاملاتك" },
    en: { title: "Security & Trust", desc: "Complete data protection and high-level encryption for your transactions" },
  },
  {
    icon: Lock,
    color: "bg-[#FDF6E3] text-[#9A7B35]",
    ar: { title: "توقيع إلكتروني", desc: "توقيع رقمي معتمد قانونياً يعادل التوقيع الورقي في جميع الإجراءات" },
    en: { title: "Digital Signature", desc: "Legally recognized digital signature equivalent to paper signature" },
  },
  {
    icon: TrendingUp,
    color: "bg-[#EEF1F8] text-[#1B2B4B]",
    ar: { title: "تتبع ومراقبة", desc: "تتبع حالة سنداتك لحظة بلحظة مع إشعارات فورية عند كل تحديث" },
    en: { title: "Real-time Tracking", desc: "Track your notes status in real-time with instant notifications" },
  },
  {
    icon: Users,
    color: "bg-[#E8F5EE] text-[#006C35]",
    ar: { title: "متعدد الأطراف", desc: "يدعم الأفراد والشركات والبنوك ومؤسسات التمويل والقطاع العقاري" },
    en: { title: "Multi-party Support", desc: "Supports individuals, companies, banks, and financing institutions" },
  },
  {
    icon: Award,
    color: "bg-[#FDF6E3] text-[#9A7B35]",
    ar: { title: "امتثال قانوني", desc: "متوافق مع أنظمة الأوراق التجارية وجميع الأنظمة القانونية في المملكة" },
    en: { title: "Legal Compliance", desc: "Compliant with commercial papers regulations and all legal frameworks" },
  },
];

const steps = [
  {
    num: "01",
    ar: { title: "التسجيل", desc: "سجّل بهويتك الوطنية أو السجل التجاري في دقيقة واحدة" },
    en: { title: "Register", desc: "Register with your national ID or commercial registration in one minute" },
  },
  {
    num: "02",
    ar: { title: "إصدار السند", desc: "أدخل بيانات المدين والمبلغ وتاريخ الاستحقاق ثم أرسل الطلب" },
    en: { title: "Issue Note", desc: "Enter debtor info, amount, and due date then send the request" },
  },
  {
    num: "03",
    ar: { title: "التوقيع والاعتماد", desc: "يوقّع المدين إلكترونياً ويصبح السند نافذاً ومعتمداً" },
    en: { title: "Sign & Approve", desc: "Debtor signs electronically and the note becomes active and valid" },
  },
  {
    num: "04",
    ar: { title: "التتبع والتحصيل", desc: "تتبع حالة السداد وربط مباشر بمحاكم التنفيذ عند التعثر" },
    en: { title: "Track & Collect", desc: "Track payment status with direct link to execution courts if needed" },
  },
];

export default function LandingPage() {
  const { lang, setLang, t, isRTL } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[#1B2B4B] font-bold text-lg leading-tight">
                {t("إنجاز إكس", "Injaz X")}
              </p>
              <p className="text-[#94A3B8] text-xs leading-none">
                {t("منصة السندات الإلكترونية", "Electronic Notes Platform")}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#features" className="hover:text-[#006C35] transition-colors">
              {t("المميزات", "Features")}
            </a>
            <a href="#how-it-works" className="hover:text-[#006C35] transition-colors">
              {t("كيف يعمل", "How It Works")}
            </a>
            <a href="#stats" className="hover:text-[#006C35] transition-colors">
              {t("الإحصائيات", "Statistics")}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === "ar" ? "EN" : "عر"}
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[#006C35] hover:text-[#004D26] transition-colors"
            >
              {t("تسجيل الدخول", "Sign In")}
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-[#006C35] hover:bg-[#004D26] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t("ابدأ الآن", "Get Started")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B2B4B] via-[#162240] to-[#0F172A] py-28 px-6">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 rtl:right-0 ltr:left-0 w-[600px] h-[600px] bg-[#006C35]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 rtl:left-0 ltr:right-0 w-[400px] h-[400px] bg-[#C9A84C]/10 rounded-full blur-3xl translate-y-1/2" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0tNiA2aDZ2Nmg2di02aC02di02aC02djZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#006C35]/20 border border-[#006C35]/40 text-[#4ADE80] text-sm font-medium px-5 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" />
            {t("منصة معتمدة رسمياً", "Officially Certified Platform")}
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            {t("منصة", "The Future of")}
            <br />
            <span className="bg-gradient-to-r from-[#4ADE80] via-[#00A651] to-[#C9A84C] bg-clip-text text-transparent">
              {t("إنجاز إكس", "Injaz X")}
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-white/70 font-light">
              {t("للسندات الإلكترونية", "Electronic Notes")}
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
            {t(
              "منصة متكاملة لإصدار وإدارة وتتبع السندات الإلكترونية بشكل آمن وموثوق، مع ربط مباشر بمنظومة العدالة لضمان حقوق جميع الأطراف",
              "A comprehensive platform for issuing, managing, and tracking electronic promissory notes securely, with direct integration to the justice system to protect all parties' rights"
            )}
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-[#006C35]/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t("ابدأ مجاناً", "Start for Free")}
              <ArrowIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-2xl border border-white/20 transition-all duration-300"
            >
              {t("تسجيل الدخول", "Sign In")}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-16 flex-wrap">
            {[
              { ar: "وزارة العدل", en: "Ministry of Justice", icon: Shield },
              { ar: "مؤمّن 256-bit", en: "256-bit Secured", icon: Lock },
              { ar: "متاح 24/7", en: "Available 24/7", icon: Clock },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                <badge.icon className="w-4 h-4 text-[#4ADE80]" />
                {t(badge.ar, badge.en)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-6 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-[#006C35] mb-2">{stat.value}</p>
                <p className="text-sm text-[#64748B] font-medium">{t(stat.ar, stat.en)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#E8F5EE] text-[#006C35] text-sm font-semibold rounded-full mb-4">
              {t("مميزات المنصة", "Platform Features")}
            </span>
            <h2 className="text-4xl font-black text-[#0F172A] mb-4">
              {t("لماذا إنجاز إكس؟", "Why Injaz X?")}
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              {t(
                "نوفر لك أحدث تقنيات إدارة السندات الإلكترونية مع ضمان الامتثال القانوني الكامل",
                "We provide the latest electronic note management technology with full legal compliance guarantee"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    {t(feature.ar.title, feature.en.title)}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {t(feature.ar.desc, feature.en.desc)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#EEF1F8] text-[#1B2B4B] text-sm font-semibold rounded-full mb-4">
              {t("خطوات بسيطة", "Simple Steps")}
            </span>
            <h2 className="text-4xl font-black text-[#0F172A] mb-4">
              {t("كيف يعمل إنجاز إكس؟", "How Does Injaz X Work?")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center text-white font-black text-lg mb-4 shadow-md">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">
                    {t(step.ar.title, step.en.title)}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {t(step.ar.desc, step.en.desc)}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -end-3 z-10">
                    <ChevronIcon className="w-6 h-6 text-[#006C35]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1B2B4B] to-[#0F172A]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6">
            {t("ابدأ رحلتك الرقمية اليوم", "Start Your Digital Journey Today")}
          </h2>
          <p className="text-xl text-white/70 mb-10 leading-relaxed">
            {t(
              "انضم إلى الآلاف من الأفراد والشركات الذين يثقون بمنصة إنجاز إكس لإدارة سنداتهم الإلكترونية",
              "Join thousands of individuals and companies who trust Injaz X for managing their electronic notes"
            )}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {t("إنشاء حساب مجاني", "Create Free Account")}
              <ArrowIcon className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-white/40 text-sm">
            {[
              { ar: "لا يلزم بطاقة ائتمان", en: "No credit card required" },
              { ar: "تسجيل في دقيقة", en: "One-minute registration" },
              { ar: "دعم على مدار الساعة", en: "24/7 support" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />
                {t(item.ar, item.en)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#006C35] to-[#00A651] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">{t("إنجاز إكس", "Injaz X")}</span>
            </div>
            <p className="text-[#64748B] text-sm text-center">
              {t(
                "© 2025 إنجاز إكس. جميع الحقوق محفوظة.",
                "© 2025 Injaz X. All rights reserved."
              )}
            </p>
            <div className="flex items-center gap-4 text-sm text-[#64748B]">
              <a href="#" className="hover:text-white transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</a>
              <a href="#" className="hover:text-white transition-colors">{t("شروط الاستخدام", "Terms of Use")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
