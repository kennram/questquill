"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200">
      <MarketingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border-4 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
            <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-8 tracking-tight text-center">Privacy Policy</h1>
            <p className="text-sky-600/70 font-bold text-center mb-12 uppercase tracking-widest text-sm">Last Updated: March 2026</p>
            
            <div className="space-y-12 text-sky-900/80 leading-relaxed font-medium">
              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-500"><Lock className="w-4 h-4" /></div>
                  Safety First
                </h3>
                <p>
                  At QuestQuill, your child's safety and privacy are our highest priorities. We are built from the ground up to be fully COPPA and GDPR compliant. We do not sell, rent, or trade student data to third parties. Ever.
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-500"><Eye className="w-4 h-4" /></div>
                  Information We Collect
                </h3>
                <p className="mb-4">To provide a personalized reading experience, we collect minimal data:</p>
                <ul className="list-disc pl-6 space-y-2 font-bold text-sky-900/60">
                  <li>Guide (Parent/Teacher) email and billing info via Stripe.</li>
                  <li>Student first names (or nicknames) for story personalization.</li>
                  <li>Reading performance data (challenge attempts and word mastery).</li>
                  <li>Interests provided during story creation.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500"><ShieldCheck className="w-4 h-4" /></div>
                  How We Use Data
                </h3>
                <p>
                  Data is used exclusively to adapt the difficulty of stories, generate unique adventures, and provide pedagogical insights to Guides. We use Google Gemini AI to process story text, but no PII (Personally Identifiable Information) is shared with the model.
                </p>
              </section>

              <section className="bg-sky-50 p-8 rounded-3xl border-2 border-sky-100">
                <h4 className="text-xl font-black text-sky-900 font-comic mb-2">Student Deletion</h4>
                <p className="text-sm font-bold opacity-70">
                  Guides have full control over student data. Deleting a student profile instantly and permanently removes all associated stories, analytics, and personal information from our production database.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
