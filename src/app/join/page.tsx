import JoinClassForm from "@/components/JoinClassForm";
import Link from "next/link";
import { ArrowLeft, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-server";

export default async function JoinPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 text-9xl animate-bounce">🏰</div>
        <div className="absolute bottom-20 right-20 text-9xl animate-pulse delay-700">🐉</div>
        <div className="absolute top-1/2 left-1/4 text-8xl -rotate-12 opacity-50">✨</div>
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Link 
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2 px-6 py-3 bg-white text-sky-500 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform border-b-4 border-sky-100 active:border-b-0 active:translate-y-1"
        >
          <ArrowLeft className="w-5 h-5" /> Back to {session ? "Dashboard" : "Home"}
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-black text-sky-500 font-comic tracking-tight mb-2 text-shadow-lg stroke-white">
            Class Login
          </h1>
          <p className="text-2xl text-sky-900/60 font-bold">Enter the magic code from your teacher!</p>
        </div>

        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border-[6px] border-white ring-8 ring-sky-100">
          <JoinClassForm />
        </div>
        
        <p className="mt-8 text-sky-300 font-bold text-sm uppercase tracking-widest">QuestQuill Adventure Studios</p>
      </div>
    </div>
  );
}
