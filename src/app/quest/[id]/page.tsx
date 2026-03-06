import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";
import AdventureView from "@/components/AdventureView";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { cookies } from "next/headers";

export default async function QuestPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Handle temporary stories (not saved in DB)
  if (id.startsWith("temp-")) {
    return (
      <div className="min-h-screen bg-sky-50 p-6 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-12 rounded-[48px] shadow-2xl border-4 border-orange-200 max-w-2xl">
          <AlertTriangle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-sky-900 mb-4 font-comic">Adventure Not Saved!</h1>
          <p className="text-xl text-sky-600 font-bold mb-8">
            The magic story was created, but we couldn't save it to your bookshelf. 
            You might need to try creating a new one!
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-white font-black bg-sky-500 px-10 py-5 rounded-2xl shadow-lg hover:bg-sky-600 transition-all hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Use Admin client to bypass RLS (Crucial for Student sessions)
  const { data: story, error } = await supabaseAdmin
    .from("stories")
    .select("*, children(parent_id)")
    .eq("id", id)
    .single();

  if (error || !story) {
    console.error("[QUEST PAGE] Story fetch failed:", error?.message);
    notFound();
  }

  // Detect role
  const cookieStore = await cookies();
  const studentSession = cookieStore.get("student_session");
  const isStudent = !!studentSession;
  const role = isStudent ? "student" : "parent"; // or teacher
  const dashboardPath = isStudent ? "/student/dashboard" : "/dashboard";

  // Fetch parent profile for premium status (via Admin)
  const parentId = (story.children as any)?.parent_id;
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_premium")
    .eq("id", parentId)
    .single();

  // content_json matches the structure AdventureView expects
  const storyData = {
    id: story.id,
    child_id: story.child_id,
    is_premium: !!profile?.is_premium,
    ...story.content_json
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 md:p-12">
      <Link 
        href={`${dashboardPath}?childId=${story.child_id}`} 
        className="inline-flex items-center gap-2 text-sky-600 font-black mb-8 hover:text-sky-800 transition-colors bg-white px-6 py-3 rounded-full shadow-md border-2 border-sky-100 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <AdventureView story={storyData} role={role as any} />
    </div>
  );
}
