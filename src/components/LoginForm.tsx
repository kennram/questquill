"use client";

import { useState } from "react";
import { login } from "@/app/auth/actions";
import { Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(formData);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      }
      // If no error and no result, it's likely a successful redirect
    } catch (err: unknown) {
      // Next.js redirects throw a special error that we shouldn't catch as a failure
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        return;
      }
      console.error("Login error:", err);
      setError("Something went wrong. Please try again!");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 md:p-12 rounded-[48px] shadow-2xl border-4 border-white w-full animate-in zoom-in duration-500 relative overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-24 h-24 rotate-12" />
      </div>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex bg-sky-50 p-4 rounded-3xl border-2 border-sky-100 mb-6 text-sky-500">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-5xl font-black text-sky-950 font-comic tracking-tight mb-2">Welcome Back!</h1>
        <p className="text-sky-600/60 font-bold text-lg">Your next adventure is waiting...</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold rounded-2xl text-center animate-in shake-1">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-2">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full p-5 bg-sky-50 border-4 border-sky-100 rounded-[24px] focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-200 text-sky-950 font-bold text-lg shadow-inner"
            placeholder="guide@questquill.com"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-2">
            <Lock className="w-4 h-4" /> Secret Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full p-5 bg-sky-50 border-4 border-sky-100 rounded-[24px] focus:border-sky-400 focus:outline-none transition-all placeholder:text-sky-200 text-sky-950 font-bold text-lg shadow-inner"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-orange-500 text-white font-black text-3xl rounded-[32px] shadow-[0_10px_0_rgb(194,65,12)] hover:shadow-[0_5px_0_rgb(194,65,12)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale group mt-8"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Opening World...
            </>
          ) : (
            <>
              Start Exploring! <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 text-center relative z-10 border-t-4 border-sky-50 pt-8">
        <p className="text-sky-600/60 font-bold">
          New to the kingdom?
        </p>
        <Link href="/signup" className="text-sky-600 font-black text-xl hover:text-sky-500 transition-colors underline decoration-4 underline-offset-4 decoration-sky-100 hover:decoration-sky-300">
          Create Your Free Guide Account
        </Link>
      </div>
    </div>
  );
}
