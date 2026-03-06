"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export default function MarketingNav() {
  return (
    <nav className="relative z-50 flex justify-between items-center px-4 sm:px-8 md:px-16 py-6 md:py-8">
      <div className="flex items-center gap-8 md:gap-12">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer text-inherit no-underline">
          <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg border-2 border-sky-100 group-hover:rotate-6 transition-transform duration-300">
            <span className="text-xl md:text-3xl">🖋️</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-3xl font-black text-sky-600 font-comic tracking-tight uppercase block">QuestQuill</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/features" className="text-sky-900/60 hover:text-sky-600 font-black uppercase text-xs tracking-widest transition-colors">Features</Link>
          <Link href="/pricing" className="text-sky-900/60 hover:text-sky-600 font-black uppercase text-xs tracking-widest transition-colors">Pricing</Link>
          <Link href="/classroom" className="text-sky-900/60 hover:text-sky-600 font-black uppercase text-xs tracking-widest transition-colors">Classroom</Link>
        </div>
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
  );
}
