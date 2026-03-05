import Link from "next/link";
import { Sparkles, BookOpen, Map as MapIcon, Users, Crown, ChevronRight, Zap, Volume2, ShieldCheck, Star, BarChart3, AlertCircle, TrendingUp } from "lucide-react";
import StoryCarousel from "@/components/StoryCarousel";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Magical Gradient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 md:px-16 py-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-sky-100 group-hover:rotate-6 transition-transform duration-300">
            <span className="text-3xl">🖋️</span>
          </div>
          <h1 className="text-3xl font-black text-sky-600 font-comic tracking-tight">QuestQuill</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-8 py-3 text-sky-600 font-black hover:bg-sky-50 rounded-2xl transition-all">
            Log In
          </Link>
          <Link href="/signup" className="px-8 py-4 bg-sky-500 text-white font-black rounded-2xl shadow-[0_8px_0_rgb(7,118,181)] hover:shadow-[0_4px_0_rgb(7,118,181)] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center gap-2 group">
            Start Adventure <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-16 pb-32 grid lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 border border-sky-200 shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" /> Next-Gen Literacy Magic
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-sky-950 font-comic leading-[1.1] mb-8 tracking-tight">
            Where every word is a <span className="text-sky-500 relative">Discovery<span className="absolute bottom-2 left-0 w-full h-4 bg-sky-100 -z-10 rounded-full" /></span>
          </h2>
          <p className="text-2xl text-sky-900/60 font-bold mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-balance">
            Personalized AI reading quests that adapt to every learner. From bedtime adventures to classroom literacy goals, QuestQuill turns curiosity into mastery.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <Link href="/signup" className="px-12 py-6 bg-orange-500 text-white font-black text-3xl rounded-[32px] shadow-[0_10px_0_rgb(194,65,12)] hover:shadow-[0_5px_0_rgb(194,65,12)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all flex items-center justify-center gap-3 group">
              Start Your Quest <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 text-sky-400 font-bold">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1519238263530-99bbe197c909?auto=format&fit=crop&q=80&w=150"
              ].map((src, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-sky-100 overflow-hidden shadow-lg relative z-10 hover:z-20 transition-all hover:scale-110">
                  <img src={src} alt="Explorer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sky-900/40 uppercase tracking-widest text-xs font-black ml-2">Trusted by 10,000+ Guides & Teachers</span>
          </div>
        </div>

        {/* Hero Visual - "The Magic Window" */}
        <div className="relative animate-in zoom-in-95 duration-1000 delay-200">
          <StoryCarousel />
          
          {/* Floating Elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500 rounded-[32px] shadow-xl flex items-center justify-center text-white rotate-12 animate-bounce transition-all cursor-pointer hover:scale-110 z-20">
            <Crown className="w-16 h-16" />
          </div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-emerald-400 rounded-[24px] shadow-xl flex items-center justify-center text-white -rotate-12 animate-pulse z-20">
            <Star className="w-12 h-12 fill-white" />
          </div>
        </div>
      </header>

      {/* Role-Based Split Section */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid md:grid-cols-2 gap-12 relative z-10">
          
          {/* Parent Path */}
          <div className="bg-sky-50 p-12 rounded-[48px] border-4 border-white shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-black text-sky-900 font-comic mb-4 tracking-tight">For Parents</h3>
            <p className="text-xl text-sky-700/70 font-bold mb-8 leading-relaxed">
              Transform bedtime into a personalized adventure. Boost literacy skills with stories that feature your child as the hero.
            </p>
            <ul className="space-y-4 mb-10">
              {["Unlimited Explorer Profiles", "Progress Tracking", "Sticker Collection"].map(feat => (
                <li key={feat} className="flex items-center gap-3 font-black text-sky-900/60">
                  <ShieldCheck className="w-6 h-6 text-sky-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup?role=parent" className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(7,118,181)] hover:translate-y-1 hover:shadow-[0_3px_0_rgb(7,118,181)] active:shadow-none active:translate-y-1.5 transition-all">
              Start Family Plan <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Teacher Path */}
          <div className="bg-purple-50 p-12 rounded-[48px] border-4 border-white shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-20 h-20 bg-purple-500 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-black text-purple-900 font-comic mb-4 tracking-tight">For Teachers</h3>
            <p className="text-xl text-purple-700/70 font-bold mb-8 leading-relaxed">
              The ultimate classroom literacy toolkit. Differentiated reading at the click of a button, tailored to each student's needs.
            </p>
            <ul className="space-y-4 mb-10">
              {["Bulk Student Onboarding", "Classroom Analytics", "Reading Level Gating"].map(feat => (
                <li key={feat} className="flex items-center gap-3 font-black text-purple-900/60">
                  <ShieldCheck className="w-6 h-6 text-purple-500" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup?role=teacher" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(107,33,168)] hover:translate-y-1 hover:shadow-[0_3px_0_rgb(107,33,168)] active:shadow-none active:translate-y-1.5 transition-all">
              Start Teacher License <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* --- NEW: ANALYTICS PREVIEW SECTION --- */}
      <section className="py-32 bg-sky-950 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent" />
        
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-8 shadow-lg">
              <BarChart3 className="w-4 h-4" /> Insightful Education
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white font-comic leading-tight mb-8 tracking-tight">
              Stop guessing. <span className="text-sky-400">See the struggle.</span>
            </h2>
            <p className="text-xl md:text-2xl text-sky-200/80 font-bold mb-12 leading-relaxed">
              QuestQuill doesn't just provide stories—it tracks student behavior. Our real-time analytics flag exactly where a student struggles, from vocabulary context to inference.
            </p>
            
            <div className="space-y-8">
              {[
                { 
                  title: "Behavioral Tracking", 
                  desc: "We measure challenge attempts to identify reading patterns.",
                  icon: <Zap className="w-6 h-6" />
                },
                { 
                  title: "AI Pedagogical Advisor", 
                  desc: "Get research-backed teaching strategies tailored to each student.",
                  icon: <Sparkles className="w-6 h-6" />
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="bg-sky-500 p-3 rounded-2xl text-white shadow-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white font-comic mb-2">{item.title}</h4>
                    <p className="text-sky-200/60 font-bold text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Visual Card */}
          <div className="relative animate-in slide-in-from-right duration-1000">
            <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-3xl border-4 border-white/10 relative z-10">
              <div className="flex items-center justify-between mb-8 pb-6 border-b-4 border-sky-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 font-black">L</div>
                  <div>
                    <p className="font-black text-sky-950 text-xl font-comic">Leo's Progress</p>
                    <p className="text-sky-400 font-bold text-xs uppercase tracking-widest">Level 2 Explorer</p>
                  </div>
                </div>
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Inference Alert
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100">
                  <p className="text-sky-900/40 font-black uppercase text-[10px] tracking-widest mb-4">Recommended Strategy</p>
                  <p className="text-sky-950 font-bold text-lg leading-relaxed italic">
                    "Try 'Story Mapping'—Leo is struggling with sequence. Use visual tokens to map out what happened next."
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100">
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-emerald-950 font-black">84% Accuracy</p>
                    <p className="text-emerald-600 font-bold text-sm">Vocabulary context is soaring! ✨</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-sky-500 blur-[100px] opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 max-w-7xl mx-auto px-8 md:px-16 text-center">
        <h2 className="text-5xl font-black text-sky-950 font-comic mb-20 tracking-tight">Everything needed for <span className="text-orange-500">Magical Reading</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: <Zap className="w-8 h-8" />, 
              title: "Gemini 2.0 AI", 
              desc: "Deeply creative storytelling that adapts to your child's feedback in real-time.",
              color: "bg-orange-100 text-orange-600"
            },
            { 
              icon: <Volume2 className="w-8 h-8" />, 
              title: "Cinematic Audio", 
              desc: "High-quality narration that brings characters to life with expressive voices.",
              color: "bg-purple-100 text-purple-600"
            },
            { 
              icon: <MapIcon className="w-8 h-8" />, 
              title: "The Frontiers Map", 
              desc: "A growing world that unlocks as children read more and master new words.",
              color: "bg-emerald-100 text-emerald-600"
            }
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[40px] bg-white shadow-xl border-2 border-sky-50 group hover:-translate-y-2 transition-all">
              <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-12 transition-transform`}>
                {f.icon}
              </div>
              <h4 className="text-2xl font-black text-sky-950 font-comic mb-4">{f.title}</h4>
              <p className="text-sky-900/60 font-bold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-950 py-24 px-8 md:px-16 text-white text-center md:text-left overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12">
          <span className="text-[300px]">🖋️</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <h3 className="text-4xl font-black font-comic mb-6">QuestQuill</h3>
            <p className="text-sky-200/60 font-bold text-xl max-w-sm mb-8 leading-relaxed">
              Crafting magical reading journeys for the next generation of explorers and dreamers.
            </p>
            <div className="flex gap-4">
              {[
                "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150"
              ].map((src, i) => (
                <div key={i} className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden hover:bg-white/20 transition-all hover:scale-110 border border-white/10">
                  <img src={src} alt="Community Member" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sky-400 mb-6">Product</h5>
            <ul className="space-y-4 font-bold text-sky-200/80">
              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Classroom</li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-sky-400 mb-6">Company</h5>
            <ul className="space-y-4 font-bold text-sky-200/80">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
              <li className="hover:text-white cursor-pointer transition-colors">Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 text-sky-200/40 font-bold text-center md:text-left">
          © 2026 QuestQuill Adventure Studios. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
