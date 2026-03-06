"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/app/auth/actions";
import { Users, School, Mail, Lock, User as UserIcon, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize role from URL if present, otherwise default to parent
  const initialRole = searchParams.get("role");
  const [role, setRole] = useState<"parent" | "teacher">(
    (initialRole === "teacher" || initialRole === "parent") ? initialRole : "parent"
  );

  // Sync role if URL param changes
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "teacher" || roleParam === "parent") {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await signUp(formData);
      if (result) {
        if (result.error) {
          setError(result.error);
          setLoading(false);
        } else if (result.message) {
          setSuccessMessage(result.message);
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        return;
      }
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl border-2 md:border-4 border-white w-full animate-in zoom-in duration-500 relative overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
        <Sparkles className="w-16 h-16 md:w-24 md:h-24 rotate-12" />
      </div>

      <div className="text-center mb-8 md:mb-10 relative z-10">
        <div className="inline-flex bg-sky-50 p-3 md:p-4 rounded-2xl md:rounded-3xl border-2 border-sky-100 mb-4 md:mb-6 text-sky-500">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-sky-950 font-comic tracking-tight mb-1 md:mb-2">Join the Quest!</h1>
        <p className="text-sky-600/60 font-bold text-base md:text-lg">Your adventure begins with a single word...</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold rounded-xl md:rounded-2xl text-center text-sm md:text-base">
          {error}
        </div>
      )}

      {successMessage ? (
        <div className="py-8 md:py-12 text-center space-y-4 md:space-y-6 animate-in zoom-in">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner ring-4 md:ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-sky-950 font-comic">Check Your Mail!</h2>
          <p className="text-sky-600 font-bold text-base md:text-lg px-4 leading-relaxed">
            {successMessage}
          </p>
          <Link href="/login" className="inline-block text-orange-500 font-black text-lg md:text-xl underline decoration-4 underline-offset-8 decoration-orange-100 hover:decoration-orange-300 transition-all">
            Go to Login Page
          </Link>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
          {/* Role Selection */}
          <div className="space-y-3 md:space-y-4">
            <label className="block text-sky-700 font-black uppercase tracking-widest text-[10px] md:text-xs ml-2 text-center">Which guide are you?</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`p-4 md:p-6 rounded-2xl md:rounded-[32px] border-2 md:border-4 transition-all flex flex-col items-center gap-2 md:gap-3 group ${
                  role === "parent" 
                    ? "border-sky-500 bg-sky-50 text-sky-600 shadow-inner scale-105" 
                    : "border-sky-50 bg-white text-sky-200 hover:border-sky-100"
                }`}
              >
                <Users className={`w-8 h-8 md:w-10 md:h-10 ${role === 'parent' ? 'animate-bounce' : 'group-hover:rotate-6'}`} />
                <span className="font-black text-[10px] md:text-xs uppercase tracking-tighter">Family Guide</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-4 md:p-6 rounded-2xl md:rounded-[32px] border-2 md:border-4 transition-all flex flex-col items-center gap-2 md:gap-3 group ${
                  role === "teacher" 
                    ? "border-purple-500 bg-purple-50 text-purple-600 shadow-inner scale-105" 
                    : "border-sky-50 bg-white text-sky-200 hover:border-sky-100"
                }`}
              >
                <School className={`w-8 h-8 md:w-10 md:h-10 ${role === 'teacher' ? 'animate-bounce' : 'group-hover:rotate-6'}`} />
                <span className="font-black text-[10px] md:text-xs uppercase tracking-tighter">Classroom Guide</span>
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-[10px] md:text-xs ml-2">
                <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /> Your Name
              </label>
              <input
                name="username"
                type="text"
                required
                className="w-full p-4 md:p-5 bg-sky-50 border-2 md:border-4 border-sky-100 rounded-xl md:rounded-[24px] focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-200 text-sky-950 font-bold text-base md:text-lg shadow-inner"
                placeholder={role === "teacher" ? "Professor Smith" : "Sarah Explorer"}
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-[10px] md:text-xs ml-2">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" /> Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-4 md:p-5 bg-sky-50 border-2 md:border-4 border-sky-100 rounded-xl md:rounded-[24px] focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-200 text-sky-950 font-bold text-base md:text-lg shadow-inner"
                placeholder="guide@questquill.com"
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-[10px] md:text-xs ml-2">
                <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Secret Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full p-4 md:p-5 bg-sky-50 border-2 md:border-4 border-sky-100 rounded-xl md:rounded-[24px] focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-200 text-sky-950 font-bold text-base md:text-lg shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 md:py-6 text-white font-black text-xl md:text-3xl rounded-2xl md:rounded-[32px] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:grayscale group mt-4 md:mt-8 shadow-[0_6px_0] md:shadow-[0_10px_0]
              ${role === "teacher" 
                ? "bg-purple-600 shadow-purple-800 hover:bg-purple-700 hover:translate-y-[2px] md:hover:translate-y-[5px] active:shadow-none active:translate-y-[6px] md:active:translate-y-[10px]" 
                : "bg-sky-500 shadow-sky-700 hover:bg-sky-600 hover:translate-y-[2px] md:hover:translate-y-[5px] active:shadow-none active:translate-y-[6px] md:active:translate-y-[10px]"}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Start the Quest! <Sparkles className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {!successMessage && (
        <div className="mt-8 md:mt-12 text-center relative z-10 border-t-2 md:border-t-4 border-sky-50 pt-6 md:pt-8">
          <p className="text-sky-600/60 font-bold text-sm md:text-base">
            Already exploring?
          </p>
          <Link href="/login" className="text-sky-600 font-black text-lg md:text-xl hover:text-sky-500 transition-colors underline decoration-2 md:decoration-4 underline-offset-4 decoration-sky-100 hover:decoration-sky-300">
            Log into your account
          </Link>
        </div>
      )}
    </div>
  );
}
