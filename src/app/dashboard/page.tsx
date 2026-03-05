import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { LogOut, User as UserIcon, Crown, Sparkles } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Ensure profile exists
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username: user.user_metadata.username || "Explorer Guide",
      role: user.user_metadata.role || "parent"
    }).select().single();

    if (!insertError) {
      profile = newProfile;
    }
  }

  const role = profile?.role || user.user_metadata.role || "parent";
  const roleTitle = role === "teacher" ? "Classroom Guide" : "Explorer Guide";
  const displayUsername = profile?.username || user.user_metadata.username || "Explorer Guide";
  const classMission = profile?.class_mission || null;
  const classMissions = profile?.class_missions || [];
  const classCode = profile?.class_code || null;

  // Fetch children
  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id);

  const childIds = children?.map(c => c.id) || [];

  // Fetch related data
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .in("child_id", childIds)
    .order("created_at", { ascending: false });

  const { data: stickers } = await supabase
    .from("stickers")
    .select("*");

  const { data: vocabulary } = await supabase
    .from("vocabulary")
    .select("*")
    .in("child_id", childIds)
    .order("created_at", { ascending: false });

  const { data: discoveries } = await supabase
    .from("map_discoveries")
    .select("*")
    .in("child_id", childIds);

  const { data: challengeLogs } = await supabase
    .from("challenge_logs")
    .select("*")
    .in("child_id", childIds)
    .order("created_at", { ascending: false });
  
  const filteredStickers = stickers?.filter(s => childIds.includes(s.child_id)) || [];

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-2xl rounded-[32px] p-4 flex justify-between items-center px-8 md:px-12 ring-8 ring-sky-50/50">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-sky-500 p-2 rounded-xl shadow-lg border-2 border-sky-400 group-hover:rotate-6 transition-transform">
              <span className="text-2xl">🖋️</span>
            </div>
            <h1 className="text-2xl font-black text-sky-600 font-comic tracking-tight hidden sm:block text-shadow-sm">QuestQuill</h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-8">
            {!profile?.is_premium && (
              <Link 
                href="/dashboard/upgrade" 
                className="hidden sm:flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-orange-100 text-orange-600 font-black rounded-2xl hover:bg-orange-200 transition-all border-b-4 border-orange-200 active:translate-y-1 active:border-b-0 text-xs md:text-base"
              >
                <Crown className="w-4 h-4" /> <span className="hidden md:inline">Go Legendary</span><span className="md:hidden text-[10px]">UPGRADE</span>
              </Link>
            )}
            
            <Link href="/dashboard/profile" className="flex items-center gap-2 md:gap-4 group hover:bg-sky-50 p-1 md:p-2 md:pr-4 rounded-2xl transition-all shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner border-2 border-white overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sky-900 font-black leading-none flex items-center gap-1 text-sm">
                  {displayUsername} 
                  {profile?.is_premium && <Crown className="w-3 h-3 text-orange-500 fill-orange-500" />}
                </p>
                <p className="text-sky-400 text-[10px] font-bold uppercase tracking-widest">{roleTitle}</p>
              </div>
            </Link>

            <form action={signOut}>
              <button className="p-2.5 md:p-3 bg-red-50 text-red-400 rounded-2xl hover:text-white hover:bg-red-500 transition-all shadow-inner group border-2 border-transparent hover:border-red-400">
                <LogOut className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <DashboardClient 
          children={children || []} 
          stories={stories || []} 
          stickers={filteredStickers}
          vocabulary={vocabulary || []}
          discoveries={discoveries || []}
          challengeLogs={challengeLogs || []}
          classMission={classMission}
          classMissions={classMissions}
          classCode={classCode}
          role={role as "parent" | "teacher" | "student"}
          isPremium={!!profile?.is_premium}
        />
      </main>

      <footer className="p-12 text-center text-sky-200 font-black tracking-widest uppercase text-xs">
        © 2026 QuestQuill Adventure Studios
      </footer>
    </div>
  );
}
