"use client";

import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import { Sparkles, BookOpen, Map as MapIcon, Zap, Volume2, ShieldCheck, Star, BarChart3, Lightbulb, MousePointer2, Layout, History } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
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
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 border border-sky-200 shadow-sm">
              <Zap className="w-4 h-4 fill-sky-600" /> The Magic Toolkit
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-sky-950 font-comic mb-8 leading-tight tracking-tight">
              Features that fuel <span className="text-sky-500">Imagination</span>
            </h1>
            <p className="text-xl md:text-3xl text-sky-900/60 font-bold max-w-3xl mx-auto leading-relaxed mb-12">
              QuestQuill combines cutting-edge AI with pedagogical research to create a reading experience that is as educational as it is enchanting.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 space-y-32">
          
          {/* Feature 1: AI Storytelling */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl rotate-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-6 leading-tight">Generative Storytelling</h2>
              <p className="text-lg md:text-xl text-sky-900/60 font-bold leading-relaxed mb-8">
                No more generic books. QuestQuill uses Gemini 2.0 to weave unique narratives around your child's specific interests—whether it's "Pizza-loving Dinosaurs in Space" or "Magic Robots in an Underwater Forest."
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-sky-50 shadow-md">
                  <p className="font-black text-sky-900 text-sm mb-1">Tailored Level</p>
                  <p className="text-sky-600/70 text-xs font-bold uppercase">Reading level 1-3</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-sky-50 shadow-md">
                  <p className="font-black text-sky-900 text-sm mb-1">Interest Injection</p>
                  <p className="text-sky-600/70 text-xs font-bold uppercase">Dynamic Themes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-[48px] shadow-2xl border-8 border-white rotate-2 animate-in zoom-in duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1512418490979-92798ccc1380?auto=format&fit=crop&q=80&w=800" 
                alt="AI Storytelling" 
                className="w-full aspect-[4/3] object-cover rounded-[40px]"
              />
            </div>
          </div>

          {/* Feature 2: Interactive World Map */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2 animate-in slide-in-from-right duration-1000">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl -rotate-3">
                <MapIcon className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-6 leading-tight">The Frontier Map</h2>
              <p className="text-lg md:text-xl text-sky-900/60 font-bold leading-relaxed mb-8">
                Reading progress becomes spatial discovery. As explorers finish stories and master words, they unlock new biomes, collect stickers, and excavate rare treasures on an interactive 3D-inspired world map.
              </p>
              <ul className="space-y-4">
                {["Unlockable Regions", "Excavation Mechanics", "Sticker Trophy Room"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-black text-sky-900/60">
                    <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-1 bg-sky-950 p-4 rounded-[48px] shadow-2xl border-8 border-white -rotate-2 animate-in zoom-in duration-1000">
              <div className="bg-sky-900 aspect-[4/3] rounded-[40px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800')] opacity-40 bg-cover bg-center" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-white">
                  <MapIcon className="w-20 h-20 animate-bounce" />
                  <span className="font-black font-comic text-2xl uppercase tracking-widest">Region Unlocked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Deep Analytics */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in slide-in-from-left duration-1000">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl rotate-3">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-sky-950 font-comic mb-6 leading-tight">Pedagogical Visibility</h2>
              <p className="text-lg md:text-xl text-sky-900/60 font-bold leading-relaxed mb-8">
                QuestQuill tracks every challenge attempt. Our dashboard shows you exactly where a student is thriving or struggling, from vocabulary context to inferential reasoning.
              </p>
              <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100 italic font-bold text-purple-900/70 shadow-sm">
                &quot;Leo is struggling with 'Literal Comprehension'. Try asking him to point to the main character in the next story.&quot;
              </div>
            </div>
            <div className="bg-white p-4 rounded-[48px] shadow-2xl border-8 border-white -rotate-1 animate-in zoom-in duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                alt="Pedagogical Analytics" 
                className="w-full aspect-[4/3] object-cover rounded-[40px]"
              />
            </div>
          </div>

        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="bg-sky-600 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-3xl border-b-[12px] border-sky-800">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
            <h2 className="text-4xl md:text-6xl font-black font-comic mb-8 relative z-10">Ready to start the quest?</h2>
            <p className="text-xl md:text-2xl font-bold opacity-80 mb-12 relative z-10">Join thousands of explorers and guides today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link href="/signup" className="px-12 py-6 bg-white text-sky-600 font-black text-2xl rounded-3xl shadow-xl hover:translate-y-1 active:shadow-none transition-all">
                Get Started
              </Link>
              <Link href="/pricing" className="px-12 py-6 bg-sky-500 text-white font-black text-2xl rounded-3xl border-2 border-white/30 hover:bg-sky-400 transition-all">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
