import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  ChevronLeft, 
  Crown, 
  Check, 
  Sparkles, 
  Volume2, 
  Map as MapIcon, 
  Users, 
  Zap,
  PlayCircle,
  BarChart3,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_premium")
    .eq("id", user.id)
    .single();

  const isTeacher = profile?.role === "teacher";

  return (
    <div className="min-h-screen bg-sky-50 font-sans pb-20 text-sky-900">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b-4 border-white p-6 flex justify-between items-center px-12 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/profile" className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-4xl">🖋️</span>
            <h1 className="text-3xl font-black text-sky-600 font-comic">QuestQuill</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 mt-16 text-center">
        {/* Hero Section */}
        <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black uppercase text-xs tracking-widest mb-6 border border-orange-200 shadow-sm">
            <Crown className="w-4 h-4" /> The Legendary Path
          </div>
          <h2 className="text-6xl font-black font-comic leading-tight mb-6">
            Unlock the Full <span className="text-sky-500">Magic</span> of QuestQuill
          </h2>
          <p className="text-2xl text-sky-600/80 font-bold max-w-2xl mx-auto leading-relaxed">
            From {isTeacher ? "pedagogical insights" : "cinematic voices"} to unlimited regions, give your {isTeacher ? "students" : "explorers"} the adventure they deserve.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20 text-left">
          {/* Free Card */}
          <div className="bg-white rounded-[48px] p-10 shadow-xl border-4 border-white flex flex-col">
            <h3 className="text-2xl font-black font-comic mb-2 text-sky-400 uppercase tracking-tighter">Adventurer</h3>
            <p className="text-sky-900/60 font-bold mb-8">Perfect for a quick test drive.</p>
            
            <div className="mb-8">
              <span className="text-5xl font-black">€0</span>
              <span className="text-sky-400 font-bold ml-2">/ forever</span>
            </div>

            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 font-bold text-sky-700">
                <Check className="w-5 h-5 text-sky-400" /> 3 AI Stories per Month
              </li>
              <li className="flex items-center gap-3 font-bold text-sky-700">
                <Check className="w-5 h-5 text-sky-400" /> Standard AI Voice
              </li>
              <li className="flex items-center gap-3 font-bold text-sky-700">
                <Check className="w-5 h-5 text-sky-400" /> {isTeacher ? "Up to 5 Students" : "Up to 2 Explorers"}
              </li>
              <li className="flex items-center gap-3 font-bold text-sky-700">
                <Check className="w-5 h-5 text-sky-400" /> Basic Growth Tracking
              </li>
            </ul>

            <button disabled className="w-full py-5 bg-sky-100 text-sky-400 font-black text-xl rounded-3xl border-b-4 border-sky-200">
              Your Current Path
            </button>
          </div>

          {/* Premium Card */}
          <div className="bg-gradient-to-b from-orange-400 to-orange-600 rounded-[48px] p-10 shadow-2xl border-8 border-white relative overflow-hidden flex flex-col transform md:scale-105">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Crown className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black font-comic mb-2 text-orange-100 uppercase tracking-tighter">Legendary Explorer</h3>
              <p className="text-white/80 font-bold mb-8 italic">The ultimate adventure experience.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-black text-white">{isTeacher ? "€24.99" : "€8.99"}</span>
                <span className="text-orange-100 font-bold ml-2">/ month</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                <li className="flex items-center gap-3 font-bold text-white">
                  <Zap className="w-5 h-5 text-orange-200 fill-orange-200" /> Unlimited AI Stories
                </li>
                <li className="flex items-center gap-3 font-bold text-white">
                  <BarChart3 className="w-5 h-5 text-orange-200 fill-orange-200" /> Advanced Behavioral Analytics
                </li>
                <li className="flex items-center gap-3 font-bold text-white">
                  <Lightbulb className="w-5 h-5 text-orange-200 fill-orange-200" /> AI Pedagogical Strategy Advisor
                </li>
                {isTeacher ? (
                  <>
                    <li className="flex items-center gap-3 font-bold text-white">
                      <Users className="w-5 h-5 text-orange-200 fill-orange-200" /> Unlimited Students
                    </li>
                    <li className="flex items-center gap-3 font-bold text-white">
                      <Zap className="w-5 h-5 text-orange-200 fill-orange-200" /> Bulk Student Onboarding
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-3 font-bold text-white">
                      <Sparkles className="w-5 h-5 text-orange-200 fill-orange-200" /> Cinematic AI Narration
                    </li>
                    <li className="flex items-center gap-3 font-bold text-white">
                      <Users className="w-5 h-5 text-orange-200 fill-orange-200" /> Unlimited Explorer Profiles
                    </li>
                  </>
                )}
              </ul>

              <form action="/api/checkout" method="POST">
                <input type="hidden" name="priceId" value={isTeacher ? process.env.NEXT_PUBLIC_STRIPE_PRICE_CLASSROOM : process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY} />
                <button type="submit" className="w-full py-6 bg-white text-orange-600 font-black text-2xl rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all border-b-8 border-orange-100 group">
                  <span className="flex items-center justify-center gap-2">
                    Upgrade Now <Sparkles className="w-6 h-6 animate-pulse" />
                  </span>
                </button>
              </form>
              <p className="text-center mt-4 text-orange-100 text-xs font-bold uppercase tracking-widest">Secure Checkout by Stripe</p>
            </div>
          </div>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-white text-center group hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6 group-hover:rotate-6 transition-transform">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h4 className="font-black font-comic text-lg mb-2">Deep Insights</h4>
            <p className="text-sky-600/70 text-sm font-bold leading-snug">Track every attempt and struggle to pinpoint exactly where students need help.</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-white text-center group hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:rotate-6 transition-transform">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h4 className="font-black font-comic text-lg mb-2">AI Teaching Coach</h4>
            <p className="text-sky-600/70 text-sm font-bold leading-snug">Receive automated classroom strategies based on real-time student behavior.</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-white text-center group hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6 group-hover:rotate-6 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="font-black font-comic text-lg mb-2">Legendary AI</h4>
            <p className="text-sky-600/70 text-sm font-bold leading-snug">Access our most powerful creative models for deeper, branching adventures.</p>
          </div>
        </div>

        <footer className="text-sky-400 font-bold">
          © 2026 QuestQuill Adventure Studios • Secure Checkout by Stripe
        </footer>
      </main>
    </div>
  );
}
