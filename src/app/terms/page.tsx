"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { FileText, Scale, Gavel, ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200">
      <MarketingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border-4 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
            <Scale className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-8 tracking-tight text-center">Terms of Service</h1>
            <p className="text-sky-600/70 font-bold text-center mb-12 uppercase tracking-widest text-sm">Last Updated: March 2026</p>
            
            <div className="space-y-12 text-sky-900/80 leading-relaxed font-medium">
              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-500"><ScrollText className="w-4 h-4" /></div>
                  Agreement
                </h3>
                <p>
                  By creating a QuestQuill account, you agree to these terms. QuestQuill is an AI-powered educational platform designed for children, and accounts must be managed by an adult (the "Guide").
                </p>
              </section>

              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500"><Gavel className="w-4 h-4" /></div>
                  Usage Rules
                </h3>
                <p className="mb-4">To keep the magic safe for everyone:</p>
                <ul className="list-disc pl-6 space-y-2 font-bold text-sky-900/60">
                  <li>Do not use offensive or inappropriate language in interest prompts.</li>
                  <li>Guides are responsible for student behavior on the platform.</li>
                  <li>Do not attempt to bypass our AI safety filters.</li>
                  <li>Subscriptions are for individual family or classroom use only.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-2xl font-black text-sky-950 font-comic mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-500"><FileText className="w-4 h-4" /></div>
                  AI Content
                </h3>
                <p>
                  QuestQuill uses generative AI to create stories. While we have strict filters in place, AI can sometimes produce unexpected results. If you encounter any content that feels "off," please report it to our support team immediately. Content generated is for educational use and belongs to the account holder.
                </p>
              </section>

              <section className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-100 text-center">
                <p className="text-sm font-bold text-purple-900/70">
                  Have questions about our terms? We're here to help. <br />
                  Reach out at <span className="text-purple-600 font-black">support@questquill.app</span>
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
