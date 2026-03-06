"use client";

import Link from "next/link";
import { Sparkles, BookOpen, Map as MapIcon, Users, Crown, ChevronRight, Zap, Volume2, ShieldCheck, Star, BarChart3, AlertCircle, TrendingUp } from "lucide-react";
import StoryCarousel from "@/components/StoryCarousel";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      {/* Magical Gradient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-sky-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-4 sm:px-8 md:px-16 py-6 md:py-8">
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg border-2 border-sky-100 group-hover:rotate-6 transition-transform duration-300">
            <span className="text-xl md:text-3xl">🖋️</span>
          </div>
          <h1 className="text-xl md:text-3xl font-black text-sky-600 font-comic tracking-tight uppercase hidden sm:block">QuestQuill</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="px-3 sm:px-8 py-3 text-sky-600 font-black hover:bg-sky-50 rounded-xl md:rounded-2xl transition-all text-xs sm:text-base">
            Log In
          </Link>
          <Link href="/signup" className="px-4 sm:px-8 py-3 sm:py-4 bg-sky-500 text-white font-black rounded-xl md:rounded-2xl shadow-[0_4px_0_rgb(7,118,181)] sm:shadow-[0_8px_0_rgb(7,118,181)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all flex items-center gap-1 sm:gap-2 group text-xs sm:text-base whitespace-nowrap">
            <span className="hidden xs:inline">Start</span> Adventure <ChevronRight className="w-3.5 h-3.5 sm:w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-8 md:pt-16 pb-20 md:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center text-center lg:text-left">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-4 py-2 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest mb-6 md:mb-8 border border-sky-200 shadow-sm mx-auto lg:mx-0">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" /> Next-Gen Literacy Magic
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-sky-950 font-comic leading-[1.1] mb-6 md:mb-8 tracking-tight">
            Where every word is a <span className="text-sky-500 relative">Discovery<span className="absolute bottom-1 md:bottom-2 left-0 w-full h-3 md:h-4 bg-sky-100 -z-10 rounded-full" /></span>
          </h2>
          <p className="text-lg md:text-2xl text-sky-900/60 font-bold mb-8 md:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance">
            Personalized AI reading quests that adapt to every learner. From bedtime adventures to classroom literacy goals, QuestQuill turns curiosity into mastery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
            <Link href="/signup" className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-orange-500 text-white font-black text-xl md:text-3xl rounded-[24px] md:rounded-[32px] shadow-[0_8px_0_rgb(194,65,12)] md:shadow-[0_10px_0_rgb(194,65,12)] hover:shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3 group text-center">
              Start Your Quest <Sparkles className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
          <div className="mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 text-sky-400 font-bold">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1519238263530-99bbe197c909?auto=format&fit=crop&q=80&w=150"
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white bg-sky-100 overflow-hidden shadow-lg relative z-10 hover:z-20 transition-all hover:scale-110">
                  <img src={src} alt="Explorer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sky-900/40 uppercase tracking-widest text-[10px] font-black text-center md:text-left">Trusted by 10,000+ Guides & Teachers</span>
          </div>
        </div>

        {/* Hero Visual - "The Magic Window" */}
        <div className="relative animate-in zoom-in-95 duration-1000 delay-200 order-1 lg:order-2 px-4 sm:px-0">
          <div className="scale-90 sm:scale-100">
            <StoryCarousel />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 md:-top-12 md:-right-12 w-20 h-20 md:w-32 md:h-32 bg-purple-500 rounded-[24px] md:rounded-[32px] shadow-xl flex items-center justify-center text-white rotate-12 animate-bounce transition-all cursor-pointer hover:scale-110 z-20">
            <Crown className="w-10 h-10 md:w-16 md:h-16" />
          </div>
          <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-16 h-16 md:w-24 md:h-24 bg-emerald-400 rounded-[18px] md:rounded-[24px] shadow-xl flex items-center justify-center text-white -rotate-12 animate-pulse z-20">
            <Star className="w-8 h-8 md:w-12 md:h-12 fill-white" />
          </div>
        </div>
      </header>

      {/* Role-Based Split Section */}
      <section className="bg-white py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-8 md:gap-12 relative z-10 text-center md:text-left">
          
          {/* Parent Path */}
          <div className="bg-sky-50 p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-4 border-white shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-sky-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white mb-6 md:mb-8 group-hover:rotate-6 transition-transform mx-auto md:mx-0">
              <Users className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-sky-900 font-comic mb-4 tracking-tight">For Parents</h3>
            <p className="text-lg md:text-xl text-sky-700/70 font-bold mb-8 leading-relaxed">
              Transform bedtime into a personalized adventure. Boost literacy skills with stories that feature your child as the hero.
            </p>
            <ul className="space-y-4 mb-10 text-left">
              {["Unlimited Explorer Profiles", "Progress Tracking", "Sticker Collection"].map(feat => (
                <li key={feat} className="flex items-center gap-3 font-black text-sky-900/60 text-sm md:text-base">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-sky-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup?role=parent" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-sky-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(7,118,181)] hover:translate-y-1 hover:shadow-[0_3px_0_rgb(7,118,181)] active:shadow-none active:translate-y-1.5 transition-all text-sm md:text-base">
              Start Family Plan <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Teacher Path */}
          <div className="bg-purple-50 p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-4 border-white shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white mb-6 md:mb-8 group-hover:rotate-6 transition-transform mx-auto md:mx-0">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-purple-900 font-comic mb-4 tracking-tight">For Teachers</h3>
            <p className="text-lg md:text-xl text-purple-700/70 font-bold mb-8 leading-relaxed">
              The ultimate classroom literacy toolkit. Differentiated reading at the click of a button, tailored to each student's needs.
            </p>
            <ul className="space-y-4 mb-10 text-left">
              {["Bulk Student Onboarding", "Classroom Analytics", "Reading Level Gating"].map(feat => (
                <li key={feat} className="flex items-center gap-3 font-black text-purple-900/60 text-sm md:text-base">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup?role=teacher" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-purple-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(107,33,168)] hover:translate-y-1 hover:shadow-[0_3px_0_rgb(107,33,168)] active:shadow-none active:translate-y-1.5 transition-all text-sm md:text-base">
              Start Teacher License <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* --- ANALYTICS PREVIEW SECTION --- */}
      <section className="py-20 md:py-32 bg-sky-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative z-10 animate-in fade-in slide-in-from-left duration-1000 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest mb-6 md:mb-8 shadow-lg mx-auto lg:mx-0">
              <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Insightful Education
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white font-comic leading-tight mb-6 md:mb-8 tracking-tight">
              Stop guessing. <br className="hidden md:block" /> <span className="text-sky-400">See the struggle.</span>
            </h2>
            <p className="text-lg md:text-2xl text-sky-200/80 font-bold mb-10 md:mb-12 leading-relaxed text-balance">
              QuestQuill doesn't just provide stories—it tracks student behavior. Our real-time analytics flag exactly where a student struggles, from vocabulary context to inference.
            </p>
            
            <div className="grid gap-6 md:gap-8 max-w-2xl mx-auto lg:mx-0">
              {[
                { 
                  title: "Behavioral Tracking", 
                  desc: "We measure challenge attempts to identify reading patterns.",
                  icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />
                },
                { 
                  title: "Pedagogical Advisor", 
                  desc: "Get research-backed teaching strategies tailored to each student.",
                  icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start text-center sm:text-left">
                  <div className="bg-sky-500 p-3 md:p-4 rounded-2xl text-white shadow-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-white font-comic mb-2">{item.title}</h4>
                    <p className="text-sky-200/60 font-bold text-base md:text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Visual Card */}
          <div className="relative animate-in slide-in-from-right duration-1000 px-2 sm:px-0">
            <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 shadow-3xl border-4 border-white/10 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0 pb-6 border-b-4 border-sky-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 font-black shrink-0">L</div>
                  <div>
                    <p className="font-black text-sky-950 text-lg md:text-xl font-comic leading-none mb-1 text-center sm:text-left">Leo's Progress</p>
                    <p className="text-sky-400 font-bold text-[10px] uppercase tracking-widest text-center sm:text-left">Level 2 Explorer</p>
                  </div>
                </div>
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> Inference Alert
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-sky-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 border-sky-100 shadow-inner">
                  <p className="text-sky-900/40 font-black uppercase text-[9px] tracking-widest mb-3">Recommended Strategy</p>
                  <p className="text-sky-950 font-bold text-base md:text-lg leading-relaxed italic">
                    &quot;Try &apos;Story Mapping&apos;&mdash;Leo is struggling with sequence. Use visual tokens to map out what happened next.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 border-emerald-100">
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-emerald-950 font-black text-base md:text-lg leading-tight">84% Accuracy</p>
                    <p className="text-emerald-600 font-bold text-xs md:text-sm">Vocabulary context is soaring! ✨</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-sky-500 blur-[60px] md:blur-[100px] opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6 md:px-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-950 font-comic mb-16 md:mb-20 tracking-tight leading-tight">Everything needed for <br className="md:hidden" /> <span className="text-orange-500">Magical Reading</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { 
              icon: <Zap className="w-7 h-7 md:w-8 md:h-8" />, 
              title: "Gemini 2.0 AI", 
              desc: "Deeply creative storytelling that adapts to your child's feedback in real-time.",
              color: "bg-orange-100 text-orange-600"
            },
            { 
              icon: <Volume2 className="w-7 h-7 md:w-8 md:h-8" />, 
              title: "Cinematic Audio", 
              desc: "High-quality narration that brings characters to life with expressive voices.",
              color: "bg-purple-100 text-purple-600"
            },
            { 
              icon: <MapIcon className="w-7 h-7 md:w-8 md:h-8" />, 
              title: "The Frontiers Map", 
              desc: "A growing world that unlocks as children read more and master new words.",
              color: "bg-emerald-100 text-emerald-600"
            }
          ].map((f, i) => (
            <div key={i} className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white shadow-xl border-2 border-sky-50 group hover:-translate-y-2 transition-all">
              <div className={`w-14 h-14 md:w-16 md:h-16 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:rotate-12 transition-transform`}>
                {f.icon}
              </div>
              <h4 className="text-xl md:text-2xl font-black text-sky-950 font-comic mb-4">{f.title}</h4>
              <p className="text-sky-900/60 font-bold leading-relaxed text-sm md:text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-950 py-16 md:py-24 px-6 md:px-16 text-white text-center md:text-left overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12 pointer-events-none hidden sm:block">
          <span className="text-[200px] md:text-[300px]">🖋️</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          <div className="sm:col-span-2">
            <h3 className="text-3xl md:text-4xl font-black font-comic mb-6 uppercase">QuestQuill</h3>
            <p className="text-sky-200/60 font-bold text-lg md:text-xl max-w-sm mb-8 leading-relaxed mx-auto md:mx-0">
              Crafting magical reading journeys for the next generation of explorers and dreamers.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              {[
                "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150"
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl overflow-hidden hover:bg-white/20 transition-all hover:scale-110 border border-white/10 shrink-0">
                  <img src={src} alt="Community Member" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sky-400 text-xs md:text-sm mb-6">Product</h5>
            <ul className="space-y-4 font-bold text-sky-200/80 text-sm md:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Classroom</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sky-400 text-xs md:text-sm mb-6">Company</h5>
            <ul className="space-y-4 font-bold text-sky-200/80 text-sm md:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
              <li className="hover:text-white cursor-pointer transition-colors">Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 border-t border-white/10 text-sky-200/40 font-bold text-[10px] md:text-xs text-center md:text-left">
          © 2026 QuestQuill Adventure Studios. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
