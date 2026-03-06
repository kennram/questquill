import SignupForm from "@/components/SignupForm";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F9FF] p-4 relative overflow-hidden">
      {/* Magical Gradient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-sky-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
      </div>

      <Link 
        href="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-1.5 md:gap-2 text-sky-600 font-black hover:bg-white/50 px-3 py-2 md:px-4 md:py-2 rounded-xl md:rounded-2xl transition-all z-10 text-xs md:text-base"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden xs:inline">Back to Quest</span><span className="xs:hidden">Back</span>
      </Link>

      <div className="relative z-10 w-full max-w-lg my-12">
        <Suspense fallback={
          <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-sky-500 animate-spin" />
            <p className="font-black text-sky-950 font-comic text-center text-sm md:text-base">Preparing the Magic...</p>
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
