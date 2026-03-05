import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DashboardClient from "@/components/DashboardClient";
import Link from "next/link";
import { Crown, LogOut, Sparkles } from "lucide-react";

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("student_session");

  if (!sessionCookie) {
    redirect("/join");
  }

  const session = JSON.parse(sessionCookie.value);
  const { teacherId, studentId, name } = session;

  // Fetch Teacher Profile (for Class Mission)
  const { data: teacherProfile } = await supabaseAdmin
    .from("profiles")
    .select("class_mission, class_missions, is_premium")
    .eq("id", teacherId)
    .single();

  const isPremium = !!teacherProfile?.is_premium;

  // Fetch Student Data (Just this one child)
  const { data: child } = await supabaseAdmin
    .from("children")
    .select("*")
    .eq("id", studentId)
    .single();

  if (!child) {
    // Session invalid or child deleted
    redirect("/join");
  }

  // PASS MISSION DATA TO CLIENT
  // We send the full list of teacher missions and the student's completion list
  const classMissions = teacherProfile?.class_missions || [];
  const classMission = teacherProfile?.class_mission || null; // Backward compat for older code

  // Fetch Related Data for this child
  const { data: stories } = await supabaseAdmin
    .from("stories")
    .select("*")
    .eq("child_id", studentId)
    .order("created_at", { ascending: false });

  const { data: stickers } = await supabaseAdmin
    .from("stickers")
    .select("*")
    .eq("child_id", studentId);

  const { data: vocabulary } = await supabaseAdmin
    .from("vocabulary")
    .select("*")
    .eq("child_id", studentId)
    .order("created_at", { ascending: false });

  const { data: discoveries } = await supabaseAdmin
    .from("map_discoveries")
    .select("*")
    .eq("child_id", studentId);

  const { data: challengeLogs } = await supabaseAdmin
    .from("challenge_logs")
    .select("*")
    .eq("child_id", studentId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans selection:bg-orange-200">
      {/* Floating Navigation (Student Version) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-2xl rounded-[32px] p-4 flex justify-between items-center px-8 md:px-12 ring-8 ring-sky-50/50">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-sky-500 p-2 rounded-xl shadow-lg border-2 border-sky-400 group-hover:rotate-6 transition-transform">
              <span className="text-2xl">🖋️</span>
            </div>
            <h1 className="text-2xl font-black text-sky-600 font-comic tracking-tight hidden sm:block text-shadow-sm">QuestQuill</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-sky-100 px-4 py-2 rounded-xl">
              <span className="text-lg">🎓</span>
              <span className="text-sky-600 font-black text-sm uppercase tracking-widest">Student View</span>
            </div>
            
            <Link 
              href="/join" 
              className="p-3 bg-red-50 text-red-400 rounded-2xl hover:text-white hover:bg-red-500 transition-all shadow-inner group border-2 border-transparent hover:border-red-400"
              title="Log Out"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <DashboardClient 
          children={[child]} // Pass single child as array
          stories={stories || []} 
          stickers={stickers || []}
          vocabulary={vocabulary || []}
          discoveries={discoveries || []}
          challengeLogs={challengeLogs || []}
          classMission={classMission}
          classMissions={classMissions}
          role="student"
          isPremium={isPremium}
        />
      </main>

      <footer className="p-12 text-center text-sky-200 font-black tracking-widest uppercase text-xs">
        © 2026 QuestQuill Adventure Studios
      </footer>
    </div>
  );
}
