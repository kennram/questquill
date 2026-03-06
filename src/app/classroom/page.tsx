"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { BookOpen, Users, BarChart3, Zap, ShieldCheck, Star, Sparkles, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function ClassroomPage() {
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
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 border border-purple-200 shadow-sm">
              <GraduationCap className="w-4 h-4 fill-purple-600" /> Education Reimagined
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-sky-950 font-comic mb-8 leading-tight tracking-tight">
              The AI-Powered <span className="text-purple-500">Classroom</span>
            </h1>
            <p className="text-xl md:text-3xl text-sky-900/60 font-bold max-w-3xl mx-auto leading-relaxed">
              QuestQuill gives teachers the tools to deliver differentiated, high-engagement reading experiences to every student, regardless of their level.
            </p>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 grid md:grid-cols-2 gap-12">
          <div className="bg-white p-10 md:p-16 rounded-[48px] shadow-xl border-4 border-white group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-sky-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-sky-950 font-comic mb-6">Effortless Management</h3>
            <p className="text-lg md:text-xl text-sky-700/70 font-bold leading-relaxed mb-8">
              Onboard an entire class in seconds. Generate unique Class Codes that allow students to join without needing email addresses or complex passwords.
            </p>
            <ul className="space-y-4">
              {["Bulk Import Students", "Human-Readable Class Codes", "Student Progress Snapshots"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-black text-sky-900/60">
                  <ShieldCheck className="w-5 h-5 text-sky-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-10 md:p-16 rounded-[48px] shadow-xl border-4 border-white group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-purple-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-sky-950 font-comic mb-6">Real-Time Analytics</h3>
            <p className="text-lg md:text-xl text-purple-700/70 font-bold leading-relaxed mb-8">
              Identify struggling readers before they fall behind. Our insights hub highlights exactly which comprehension skills need targeted intervention.
            </p>
            <ul className="space-y-4">
              {["Skill-Specific Performance Tracking", "Automatic Struggle Alerts", "Research-Backed Strategies"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-black text-purple-900/60">
                  <ShieldCheck className="w-5 h-5 text-purple-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Mission Control Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
          <div className="bg-sky-900 rounded-[64px] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl border-b-[16px] border-sky-950">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black font-comic mb-8">Curriculum-Aligned Quests</h2>
                <p className="text-xl md:text-2xl font-bold text-sky-200/80 mb-10 leading-relaxed">
                  Inject classroom goals directly into the AI. Whether you're teaching "Ecosystems" or "Historical Figures," the story will revolve around your theme while using the student's personal interests as flavor.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Science", "History", "Character Ed", "Literacy"].map((tag) => (
                    <span key={tag} className="px-6 py-2 bg-white/10 rounded-full border border-white/20 font-black text-sm uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-[48px] p-8 border-2 border-white/10 shadow-inner">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"><Zap className="w-6 h-6" /></div>
                    <span className="font-black text-xl font-comic">Teacher Mission Active</span>
                  </div>
                  <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                    <p className="font-bold text-sky-200 uppercase text-xs tracking-widest mb-2">Current Goal</p>
                    <p className="text-2xl font-black leading-tight italic">&quot;Identify cause and effect in a story about outer space.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="animate-in zoom-in-95 duration-1000">
            <h2 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-8 tracking-tight">Ready to transform your classroom?</h2>
            <p className="text-xl md:text-2xl text-sky-900/60 font-bold mb-12 max-w-2xl mx-auto">
              Join hundreds of schools using QuestQuill to build a generation of confident, passionate readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup?role=teacher" className="px-12 py-6 bg-purple-500 text-white font-black text-2xl rounded-3xl shadow-[0_8px_0_rgb(107,33,168)] hover:translate-y-1 active:shadow-none transition-all">
                Start Teacher Account
              </Link>
              <Link href="/support" className="px-12 py-6 bg-white text-sky-600 font-black text-2xl rounded-3xl border-2 border-sky-100 hover:bg-sky-50 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
