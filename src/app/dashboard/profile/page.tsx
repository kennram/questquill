import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  User as UserIcon, 
  Settings, 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  Users, 
  Trophy, 
  Crown,
  CreditCard,
  Mail,
  ShieldCheck,
  School,
  Bug,
  ExternalLink,
  ChevronRight,
  Gem,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { updateProfile, togglePremiumDebug, resetStoryLimitDebug, incrementStoryCountDebug } from "@/app/dashboard/actions";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 1. Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "parent";
  const roleTitle = role === "teacher" ? "Classroom Guide" : "Explorer Guide";
  const studentLabel = role === "teacher" ? "Students" : "Explorers";

  // 2. Fetch children and their aggregated stats
  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id);

  const childIds = children?.map(c => c.id) || [];

  // 3. Aggregate stats
  const { count: totalStories } = await supabase
    .from("stories")
    .select("*", { count: 'exact', head: true })
    .in("child_id", childIds);

  const { count: totalVocab } = await supabase
    .from("vocabulary")
    .select("*", { count: 'exact', head: true })
    .in("child_id", childIds);

  const totalGems = children?.reduce((acc, curr) => acc + (curr.gems || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans pb-20 selection:bg-orange-200">
      
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-2xl rounded-[32px] p-4 flex justify-between items-center px-8 md:px-12 ring-8 ring-sky-50/50">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-all border-2 border-sky-100 group">
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🖋️</span>
              <h1 className="text-2xl font-black text-sky-600 font-comic tracking-tight hidden sm:block">QuestQuill</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(7,118,181)] hover:shadow-[0_3px_0_rgb(7,118,181)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all text-sm group">
              <LayoutDashboard className="w-4 h-4 group-hover:rotate-6" /> Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: 4/12 width */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Quick Profile Card */}
            <div className="bg-white rounded-[48px] p-10 shadow-2xl border-4 border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-bl-[120px] -mr-10 -mt-10 transition-all group-hover:scale-110" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative group/avatar">
                  <div className="w-40 h-40 rounded-[48px] bg-sky-100 flex items-center justify-center text-sky-500 mb-8 shadow-2xl border-4 border-white overflow-hidden ring-8 ring-sky-50 transition-transform group-hover/avatar:rotate-3">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      role === "teacher" ? <School className="w-20 h-20" /> : <UserIcon className="w-20 h-20" />
                    )}
                  </div>
                  {profile?.is_premium && (
                    <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-xl rotate-12 border-4 border-white">
                      <Crown className="w-8 h-8 fill-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-4xl font-black text-sky-950 font-comic tracking-tight mb-2 leading-none">{profile?.username}</h2>
                <div className="flex items-center gap-2 bg-sky-50 px-4 py-1.5 rounded-full border-2 border-sky-100 mb-8">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-sky-600 font-black text-xs uppercase tracking-widest">{roleTitle}</p>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="bg-sky-50 p-4 rounded-3xl border-4 border-white shadow-xl shadow-sky-900/5">
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">{studentLabel}</p>
                    <p className="text-3xl font-black text-sky-950 font-comic leading-none">{children?.length || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-3xl border-4 border-white shadow-xl shadow-orange-900/5">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Rank</p>
                    <p className="text-3xl font-black text-orange-950 font-comic leading-none">ELITE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact/Stats Card */}
            <div className="bg-sky-600 rounded-[48px] p-10 shadow-2xl text-white relative overflow-hidden border-b-[12px] border-sky-800">
              <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4">
                <Trophy className="w-64 h-64" />
              </div>
              <h3 className="text-2xl font-black font-comic mb-8 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-300" /> Magic Stats
              </h3>
              <div className="space-y-4 relative z-10">
                {[
                  { label: "Quests Read", val: totalStories || 0, icon: <BookOpen className="w-5 h-5" />, color: "bg-white/10" },
                  { label: "Words Mastered", val: totalVocab || 0, icon: <Sparkles className="w-5 h-5" />, color: "bg-white/10" },
                  { label: "Total Gems", val: totalGems, icon: <Gem className="w-5 h-5 text-yellow-300 fill-yellow-300" />, color: "bg-white/10" }
                ].map((stat, i) => (
                  <div key={i} className={`flex justify-between items-center ${stat.color} backdrop-blur-xl p-5 rounded-[24px] border-2 border-white/20 shadow-lg`}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/20 rounded-xl">{stat.icon}</div>
                      <span className="font-black text-lg tracking-tight">{stat.label}</span>
                    </div>
                    <span className="text-3xl font-black font-comic">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN TOOLS - DRAMATIC OVERHAUL */}
            {user.email === 'kenndavisux@gmail.com' && (
              <div className="bg-slate-950 rounded-[48px] p-10 shadow-2xl text-white border-b-[12px] border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Bug className="w-32 h-32" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500"><Bug className="w-4 h-4" /></div>
                  Developer Matrix
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Story Fuel</span>
                      <span className="font-black text-orange-400">{profile?.story_count_monthly || 0} / 3</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: `${((profile?.story_count_monthly || 0) / 3) * 100}%` }} />
                    </div>
                  </div>

                  <form action={togglePremiumDebug}>
                    <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl border-b-8 active:shadow-none active:translate-y-2 ${profile?.is_premium ? 'bg-red-500 border-red-700' : 'bg-emerald-500 border-emerald-700'}`}>
                      {profile?.is_premium ? "REMOVE PREMIUM STATUS" : "ACTIVATE LEGENDARY"}
                    </button>
                  </form>
                  <div className="grid grid-cols-2 gap-4">
                    <form action={resetStoryLimitDebug}>
                      <button className="w-full py-4 bg-slate-800 border-b-8 border-slate-900 rounded-2xl font-black text-xs hover:bg-slate-700 transition-all active:translate-y-2 active:border-b-0 uppercase">
                        Zero Count
                      </button>
                    </form>
                    <form action={incrementStoryCountDebug}>
                      <button className="w-full py-4 bg-orange-500/10 text-orange-400 border-b-8 border-orange-900/50 rounded-2xl font-black text-xs hover:bg-orange-500/20 transition-all active:translate-y-2 active:border-b-0 uppercase">
                        Boost +1
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 8/12 width */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Guide Settings (ProfileSettingsForm) */}
            <div className="bg-white rounded-[48px] p-12 shadow-2xl border-4 border-white relative overflow-hidden">
              <h3 className="text-3xl font-black text-sky-950 font-comic mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-lg border-2 border-white">
                  <Settings className="w-6 h-6" />
                </div>
                Guide Profile Settings
              </h3>
              
              <ProfileSettingsForm 
                initialUsername={profile?.username || ""} 
                initialAvatarUrl={profile?.avatar_url || ""}
                userEmail={user.email || ""}
              />
            </div>

            {/* Membership & Billing Card */}
            <div className="bg-white rounded-[48px] p-12 shadow-2xl border-4 border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10">
                <ShieldCheck className={`w-20 h-20 ${profile?.is_premium ? 'text-emerald-50' : 'text-slate-50'}`} />
              </div>
              <h3 className="text-3xl font-black text-sky-950 font-comic mb-2 flex items-center gap-4 leading-none">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg border-2 border-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                Membership Path
              </h3>
              <p className="text-xl text-sky-600/70 font-bold mb-10 max-w-md">Unlock the full magic of AI storytelling and cinematic voices.</p>
              
              <div className={`p-8 rounded-[40px] border-4 flex flex-col md:flex-row justify-between items-center gap-8 transition-all duration-500
                ${profile?.is_premium ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="text-center md:text-left">
                  <h4 className={`text-2xl font-black ${profile?.is_premium ? 'text-emerald-900' : 'text-slate-900'} font-comic mb-1`}>
                    {profile?.is_premium ? 'Legendary Explorer' : 'Free Adventurer'}
                  </h4>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <p className={`font-black uppercase tracking-widest text-xs ${profile?.is_premium ? 'text-emerald-600' : 'text-slate-500'}`}>Status: Active Path</p>
                    {profile?.is_premium && <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />}
                  </div>
                </div>
                
                {profile?.is_premium ? (
                  <form action="/api/portal" method="POST" className="w-full md:w-auto">
                    <button type="submit" className="w-full px-10 py-5 bg-white text-emerald-600 font-black text-xl rounded-[24px] shadow-[0_8px_0_rgb(209,250,229)] hover:shadow-[0_4px_0_rgb(209,250,229)] hover:translate-y-[4px] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-3 group border-2 border-emerald-50">
                      Manage Billing <ExternalLink className="w-5 h-5 group-hover:rotate-12" />
                    </button>
                  </form>
                ) : (
                  <Link 
                    href="/dashboard/upgrade"
                    className="w-full md:w-auto px-12 py-6 bg-orange-500 text-white font-black text-2xl rounded-[32px] shadow-[0_10px_0_rgb(194,65,12)] hover:shadow-[0_5px_0_rgb(194,65,12)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all text-center group"
                  >
                    Go Legendary 👑
                  </Link>
                )}
              </div>
            </div>

            {/* Explorers / Students List */}
            <div className="bg-white rounded-[48px] p-12 shadow-2xl border-4 border-white relative overflow-hidden">
              <h3 className="text-3xl font-black text-sky-950 font-comic mb-10 flex items-center gap-4 leading-none">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg border-2 border-white">
                  <Users className="w-6 h-6" />
                </div>
                Active {studentLabel}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children?.map((child) => (
                  <Link 
                    key={child.id} 
                    href={`/dashboard?childId=${child.id}`}
                    className="group flex items-center gap-5 p-6 bg-[#F0F9FF] rounded-[32px] border-4 border-white shadow-xl shadow-sky-900/5 hover:shadow-sky-900/10 hover:border-sky-300 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
                  >
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border-4 border-white overflow-hidden transition-transform group-hover:rotate-3 relative z-10 shrink-0">
                      {child.avatar_url ? (
                        <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sky-200"><UserIcon className="w-10 h-10" /></div>
                      )}
                    </div>
                    <div className="relative z-10 overflow-hidden">
                      <h4 className="font-black text-2xl text-sky-950 font-comic leading-none mb-1 truncate">{child.name}</h4>
                      <p className="text-xs font-black text-sky-400 uppercase tracking-widest">Level {child.explorer_level} Explorer</p>
                    </div>
                    <div className="ml-auto w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-300 shadow-md border-2 border-sky-50 transition-all group-hover:text-sky-600 group-hover:translate-x-1 shrink-0">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </Link>
                ))}
                
                <Link 
                  href="/dashboard"
                  className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-[32px] border-4 border-dashed border-sky-100 text-sky-300 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-200 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-sky-50 flex items-center justify-center transition-transform group-hover:scale-110">
                    <PlusIcon className="w-8 h-8" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-sm">Add New {role === "teacher" ? "Student" : "Explorer"}</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
