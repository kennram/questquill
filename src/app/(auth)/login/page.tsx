import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
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

      <div className="relative z-10 w-full max-w-md my-12">
        <LoginForm />
      </div>
    </div>
  );
}
