"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Check, Sparkles, Crown, Zap, Users, BarChart3, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      {/* Magical Gradient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-sky-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
      </div>

      <MarketingNav />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 pt-16 md:pt-24 pb-20 text-center">
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 border border-orange-200 shadow-sm">
              <Sparkles className="w-4 h-4 fill-orange-600" /> Choose Your Adventure
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-sky-950 font-comic mb-8 leading-tight tracking-tight">
              Pricing for every <span className="text-orange-500">Explorer</span>
            </h1>
            <p className="text-xl md:text-3xl text-sky-900/60 font-bold max-w-3xl mx-auto leading-relaxed">
              Start your journey for free, or unlock the full power of AI-driven literacy with our Legendary plans.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free Adventurer */}
            <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white flex flex-col hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-black font-comic mb-2 text-sky-400 uppercase tracking-tighter">Adventurer</h3>
              <p className="text-sky-900/60 font-bold mb-8">Perfect for a quick test drive of the magic.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-black">€0</span>
                <span className="text-sky-400 font-bold ml-2">/ forever</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {[
                  "3 AI Stories per Month",
                  "Standard AI Voice",
                  "Up to 2 Explorers",
                  "Basic Growth Tracking",
                  "Frontier Map Access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-sky-700">
                    <Check className="w-5 h-5 text-sky-400" /> {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="w-full py-5 bg-sky-500 text-white font-black text-xl rounded-3xl shadow-[0_6px_0_rgb(7,118,181)] hover:translate-y-1 active:shadow-none transition-all text-center">
                Get Started
              </Link>
            </div>

            {/* Legendary Family */}
            <div className="bg-gradient-to-b from-orange-400 to-orange-600 rounded-[48px] p-10 shadow-2xl border-8 border-white relative overflow-hidden flex flex-col transform md:scale-105 z-20">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Crown className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black font-comic mb-2 text-orange-100 uppercase tracking-tighter">Legendary Family</h3>
                <p className="text-white/80 font-bold mb-8 italic">The ultimate home adventure experience.</p>
                
                <div className="mb-8 text-white">
                  <span className="text-5xl font-black">€8.99</span>
                  <span className="text-orange-100 font-bold ml-2">/ month</span>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {[
                    "Unlimited AI Stories",
                    "Cinematic AI Narration",
                    "Advanced Behavioral Analytics",
                    "Unlimited Explorer Profiles",
                    "Early Access to New Biomes"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-white">
                      <Zap className="w-5 h-5 text-orange-200 fill-orange-200" /> {item}
                    </li>
                  ))}
                </ul>

                <Link href="/signup?role=parent" className="w-full py-6 bg-white text-orange-600 font-black text-2xl rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all border-b-8 border-orange-100 text-center block">
                  Go Legendary
                </Link>
              </div>
            </div>

            {/* Legendary Classroom */}
            <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white flex flex-col hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-black font-comic mb-2 text-purple-500 uppercase tracking-tighter">Classroom Guide</h3>
              <p className="text-sky-900/60 font-bold mb-8">The ultimate toolkit for differentiation.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-black">€24.99</span>
                <span className="text-purple-400 font-bold ml-2">/ month</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {[
                  "Everything in Family Plan",
                  "Unlimited Students",
                  "Bulk Student Onboarding",
                  "AI Pedagogical Strategist",
                  "Class-wide Performance Reports"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-sky-700">
                    <Check className="w-5 h-5 text-purple-500" /> {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup?role=teacher" className="w-full py-5 bg-purple-500 text-white font-black text-xl rounded-3xl shadow-[0_6px_0_rgb(107,33,168)] hover:translate-y-1 active:shadow-none transition-all text-center">
                Start Teaching
              </Link>
            </div>

          </div>
        </section>

        {/* FAQ Teasers */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-sky-950 font-comic mb-12">Common Questions</h2>
          <div className="space-y-6 text-left">
            {[
              { q: "Can I cancel anytime?", a: "Yes! There are no long-term contracts. You can manage your subscription directly from your Guide Profile." },
              { q: "What is 'AI Story Fuel'?", a: "Each story requires high-performance AI generation. Free accounts get a healthy starting dose, while Legendary accounts have an infinite reservoir." },
              { q: "Is it safe for my classroom?", a: "Absolutely. We use strict safety filters and never store sensitive student data. We are fully GDPR and COPPA compliant." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border-4 border-white shadow-lg">
                <h4 className="text-xl font-black text-sky-900 font-comic mb-2">{faq.q}</h4>
                <p className="text-sky-600/70 font-bold leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
