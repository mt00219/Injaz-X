"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle, FileText, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const PURPOSES = [
  { value: "COMMERCIAL",  ar: "تجاري",  en: "Commercial"  },
  { value: "PERSONAL",    ar: "شخصي",   en: "Personal"    },
  { value: "REAL_ESTATE", ar: "عقاري",  en: "Real Estate" },
  { value: "EDUCATION",   ar: "تعليمي", en: "Education"   },
  { value: "VEHICLE",     ar: "مركبة",  en: "Vehicle"     },
  { value: "OTHER",       ar: "أخرى",   en: "Other"       },
];

export default function CreateNotePage() {
  const { t, isRTL, lang } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ id: string; noteNumber: string } | null>(null);

  const [form, setForm] = useState({
    debtorNationalId: "",
    amount: "",
    dueDate: "",
    purpose: "COMMERCIAL",
    description: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const validateStep1 = () => {
    if (!form.debtorNationalId || form.debtorNationalId.length !== 10) {
      setError(t("رقم هوية المدين يجب أن يكون 10 أرقام", "Debtor national ID must be 10 digits"));
      return false;
    }
    setError(""); return true;
  };

  const validateStep2 = () => {
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError(t("يرجى إدخال مبلغ صحيح", "Please enter a valid amount"));
      return false;
    }
    if (amount > 10_000_000) {
      setError(t("الحد الأقصى 10 مليون ريال", "Maximum amount is 10 million SAR"));
      return false;
    }
    if (!form.dueDate) {
      setError(t("يرجى تحديد تاريخ الاستحقاق", "Please select due date"));
      return false;
    }
    setError(""); return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtorNationalId: form.debtorNationalId,
          amount: parseFloat(form.amount),
          dueDate: new Date(form.dueDate).toISOString(),
          purpose: form.purpose,
          description: form.description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("حدث خطأ", "An error occurred"));
        setLoading(false);
        return;
      }
      setCreated({ id: data.id, noteNumber: data.noteNumber });
    } catch {
      setError(t("حدث خطأ في الاتصال", "Connection error"));
      setLoading(false);
    }
  };

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  if (created) {
    return (
      <div>
        <Header title={t("إنشاء سند جديد", "Create New Note")} />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-12 text-center max-w-md w-full">
            <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#006C35]" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">
              {t("تم إصدار السند بنجاح!", "Note Issued Successfully!")}
            </h2>
            <p className="text-[#64748B] mb-2">
              {t("رقم السند:", "Note Number:")}
            </p>
            <div className="bg-[#F8FAFC] rounded-xl px-6 py-3 mb-8 border border-[#E2E8F0]">
              <p className="text-xl font-black text-[#006C35]">{created.noteNumber}</p>
            </div>
            <p className="text-sm text-[#64748B] mb-8">
              {t(
                "تم إرسال طلب التوقيع إلى المدين. سيتم تفعيل السند عند توقيعه.",
                "Signature request sent to debtor. Note will activate upon signing."
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/notes/${created.id}`)}
                className="flex-1 px-4 py-3 bg-[#006C35] text-white font-semibold rounded-xl hover:bg-[#004D26] transition-colors"
              >
                {t("عرض السند", "View Note")}
              </button>
              <button
                onClick={() => { setCreated(null); setStep(1); setForm({ debtorNationalId: "", amount: "", dueDate: "", purpose: "COMMERCIAL", description: "" }); }}
                className="flex-1 px-4 py-3 border-2 border-[#E2E8F0] text-[#475569] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                {t("سند جديد", "New Note")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t("إنشاء سند إلكتروني جديد", "Create New Electronic Note")}
        subtitle={t("أكمل الخطوات التالية لإصدار السند", "Complete the following steps to issue the note")}
      />

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { n: 1, ar: "بيانات المدين", en: "Debtor Info" },
              { n: 2, ar: "تفاصيل السند", en: "Note Details" },
              { n: 3, ar: "المراجعة",      en: "Review"       },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s.n
                        ? "bg-[#006C35] text-white"
                        : step === s.n
                        ? "bg-[#1B2B4B] text-white"
                        : "bg-[#E2E8F0] text-[#94A3B8]"
                    }`}
                  >
                    {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step === s.n ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>
                    {t(s.ar, s.en)}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? "bg-[#006C35]" : "bg-[#E2E8F0]"}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Debtor */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] mb-1">{t("بيانات المدين", "Debtor Information")}</h2>
                  <p className="text-sm text-[#64748B]">{t("أدخل رقم هوية المدين لإرسال طلب التوقيع", "Enter debtor's national ID to send signature request")}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("رقم هوية المدين", "Debtor's National ID")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.debtorNationalId}
                    onChange={(e) => update("debtorNationalId", e.target.value.replace(/\D/g, ""))}
                    placeholder="1234567890"
                    maxLength={10}
                    className="w-full h-12 px-4 text-base rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">{t("10 أرقام", "10 digits")}</p>
                </div>

                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#92400E]">
                    {t(
                      "سيتلقى المدين إشعاراً فورياً لمراجعة وتوقيع السند",
                      "The debtor will receive an instant notification to review and sign the note"
                    )}
                  </p>
                </div>

                <button
                  onClick={() => { if (validateStep1()) setStep(2); }}
                  className="w-full h-12 bg-gradient-to-r from-[#1B2B4B] to-[#2D4270] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  {t("التالي: تفاصيل السند", "Next: Note Details")}
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] mb-1">{t("تفاصيل السند", "Note Details")}</h2>
                  <p className="text-sm text-[#64748B]">{t("حدد قيمة السند وشروطه", "Specify the note value and terms")}</p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("قيمة السند (ريال سعودي)", "Note Amount (SAR)")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => update("amount", e.target.value)}
                      placeholder="0.00"
                      min="1"
                      max="10000000"
                      step="0.01"
                      className="w-full h-12 px-4 pe-16 text-base rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all"
                    />
                    <span className="absolute top-1/2 -translate-y-1/2 end-4 text-sm font-medium text-[#64748B]">SAR</span>
                  </div>
                  {form.amount && (
                    <p className="text-xs text-[#006C35] mt-1 font-medium">
                      {t("المبلغ: ", "Amount: ")}
                      {new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(parseFloat(form.amount) || 0)}
                    </p>
                  )}
                </div>

                {/* Due date */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("تاريخ الاستحقاق", "Due Date")}
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => update("dueDate", e.target.value)}
                    min={minDateStr}
                    className="w-full h-12 px-4 text-base rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all cursor-pointer"
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-2">
                    {t("الغرض من السند", "Note Purpose")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PURPOSES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => update("purpose", p.value)}
                        className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-center transition-all ${
                          form.purpose === p.value
                            ? "border-[#006C35] bg-[#E8F5EE] text-[#006C35]"
                            : "border-[#E2E8F0] text-[#475569] hover:border-[#006C35]/30"
                        }`}
                      >
                        {t(p.ar, p.en)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2B4B] mb-1.5">
                    {t("ملاحظات", "Notes")}
                    <span className="text-[#94A3B8] text-xs mr-1">({t("اختياري", "optional")})</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder={t("أضف ملاحظات إضافية...", "Add additional notes...")}
                    rows={3}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#006C35] focus:outline-none focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 px-5 py-3 border-2 border-[#E2E8F0] text-[#475569] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all"
                  >
                    <BackIcon className="w-4 h-4" />
                    {t("السابق", "Back")}
                  </button>
                  <button
                    onClick={() => { if (validateStep2()) setStep(3); }}
                    className="flex-1 h-12 bg-gradient-to-r from-[#1B2B4B] to-[#2D4270] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    {t("التالي: مراجعة السند", "Next: Review Note")}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] mb-1">{t("مراجعة السند", "Review Note")}</h2>
                  <p className="text-sm text-[#64748B]">{t("راجع التفاصيل قبل الإصدار", "Review details before issuing")}</p>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#006C35]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8]">{t("سيتم توليد رقم السند تلقائياً", "Note number will be auto-generated")}</p>
                    </div>
                  </div>

                  {[
                    { label: { ar: "رقم هوية المدين",    en: "Debtor National ID" }, value: form.debtorNationalId },
                    { label: { ar: "قيمة السند",          en: "Amount"             }, value: new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(parseFloat(form.amount) || 0) },
                    { label: { ar: "تاريخ الاستحقاق",    en: "Due Date"           }, value: form.dueDate ? new Date(form.dueDate).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US") : "—" },
                    { label: { ar: "الغرض",               en: "Purpose"            }, value: t(PURPOSES.find(p => p.value === form.purpose)?.ar ?? "", PURPOSES.find(p => p.value === form.purpose)?.en ?? "") },
                    ...(form.description ? [{ label: { ar: "الملاحظات", en: "Notes" }, value: form.description }] : []),
                  ].map((row, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <span className="text-sm text-[#64748B]">{t(row.label.ar, row.label.en)}</span>
                      <span className="text-sm font-semibold text-[#0F172A] text-end">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#E8F5EE] border border-[#006C35]/20 rounded-xl p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006C35] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#065F46]">
                    {t(
                      "بالنقر على 'إصدار السند' فإنك تؤكد صحة البيانات وتوافق على الشروط والأحكام",
                      "By clicking 'Issue Note' you confirm the accuracy of data and agree to terms"
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-5 py-3 border-2 border-[#E2E8F0] text-[#475569] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-all"
                  >
                    <BackIcon className="w-4 h-4" />
                    {t("تعديل", "Edit")}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-[#006C35] to-[#00A651] text-white font-bold text-base rounded-xl hover:shadow-lg hover:shadow-[#006C35]/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {t("إصدار السند", "Issue Note")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
