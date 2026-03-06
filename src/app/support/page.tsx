"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { MessageCircle, Mail, BookOpen, HelpCircle, LifeBuoy, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200">
      <MarketingNav />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <section className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 border border-orange-200 shadow-sm">
            <LifeBuoy className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-sky-950 font-comic mb-8 tracking-tight">How can we <span className="text-sky-500">help?</span></h1>
          <p className="text-xl md:text-2xl text-sky-600/80 font-bold max-w-2xl mx-auto leading-relaxed">
            Whether you're a Parent Explorer or a Classroom Guide, our team is here to ensure your journey is magical.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Contact Card 1 */}
          <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white group hover:shadow-2xl transition-all text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-3xl flex items-center justify-center text-sky-500 mx-auto mb-8 group-hover:rotate-6 transition-transform">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-comic mb-4 text-sky-950">Email Us</h3>
            <p className="font-bold text-sky-600/70 mb-8 leading-relaxed">Response within 24 hours for all adventurers.</p>
            <a href="mailto:support@questquill.app" className="inline-block font-black text-sky-500 hover:text-sky-600 underline underline-offset-4 decoration-2">support@questquill.app</a>
          </div>

          {/* Contact Card 2 */}
          <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white group hover:shadow-2xl transition-all text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-500 mx-auto mb-8 group-hover:rotate-6 transition-transform shadow-lg">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-comic mb-4 text-sky-950">Live Chat</h3>
            <p className="font-bold text-sky-600/70 mb-8 leading-relaxed">Available for Legendary Guides during magic hours.</p>
            <button className="px-8 py-3 bg-orange-500 text-white font-black rounded-2xl shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all">Start Chat</button>
          </div>

          {/* Contact Card 3 */}
          <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white group hover:shadow-2xl transition-all text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-500 mx-auto mb-8 group-hover:rotate-6 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black font-comic mb-4 text-sky-950">Guides Hub</h3>
            <p className="font-bold text-sky-600/70 mb-8 leading-relaxed">Read tutorials on classroom setup and story management.</p>
            <Link href="/classroom" className="inline-flex items-center gap-2 font-black text-purple-500 hover:text-purple-600 group">
              View Guide <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Support FAQ */}
        <section className="bg-sky-950 rounded-[64px] p-12 md:p-24 text-white">
          <h2 className="text-3xl md:text-5xl font-black font-comic mb-16 text-center">Quick Fixes</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { q: "Stories aren't generating?", a: "Make sure you have a stable internet connection and haven't reached your monthly Story Fuel limit." },
              { q: "How do I add students?", a: "If you're a Teacher, head to your Dashboard and use the 'Add Students' button to onboard them in bulk." },
              { q: "Lost a Class Code?", a: "Guides can always see and regenerate Class Codes in the Student Management section of their dashboard." },
              { q: "Billing issues?", a: "You can manage your subscription and download invoices directly from your Profile settings." }
            ].map((faq, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg mt-1"><HelpCircle className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-xl font-black font-comic mb-2">{faq.q}</h4>
                    <p className="text-sky-200/60 font-bold leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
