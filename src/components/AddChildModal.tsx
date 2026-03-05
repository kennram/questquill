"use client";

import { useState } from "react";
import { X, UserPlus, Sparkles, Wand2, Loader2, Crown, CheckCircle2, ChevronLeft } from "lucide-react";
import { addChild } from "@/app/dashboard/actions";
import Link from "next/link";

interface AddChildModalProps {
  onClose: () => void;
  role?: "parent" | "teacher" | "student";
}

export default function AddChildModal({ 
  onClose, 
  role = "parent" 
}: AddChildModalProps) {
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState<{ message: string, limitReached?: boolean } | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [readingLevel, setReadingLevel] = useState(1);

  const label = (role === "teacher" || role === "student") ? "Student" : "Explorer";
  const brandColor = (role === "teacher" || role === "student") ? "bg-purple-600" : "bg-sky-500";
  const brandBorder = (role === "teacher" || role === "student") ? "border-purple-800" : "border-sky-700";

  async function generateAvatar() {
    if (!name && !interests) {
      setError({ message: `Add a name or interest first so the magic knows what to draw!` });
      return;
    }
    setGenLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-avatar", {
        method: "POST",
        body: JSON.stringify({ description: `${name} who likes ${interests}` }),
      });
      const data = await res.json();
      setAvatarUrl(data.imageUrl);
    } catch (err) {
      setError({ message: "Magic mirror is fuzzy... try again!" });
    } finally {
      setGenLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    if (avatarUrl) formData.append("avatarUrl", avatarUrl);

    const result = await addChild(formData);
    if (result?.error) {
      const isLimit = result.error.includes("Limit reached");
      setError({ message: result.error, limitReached: isLimit });
      setLoading(false);
    } else {
      setSuccess(`${name} has joined the adventure! ✨`);
      setTimeout(onClose, 1500);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sky-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-300">
        
        {/* Header - High Fidelity */}
        <div className={`${brandColor} p-8 flex justify-between items-center text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserPlus className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-comic tracking-tight leading-none mb-1">New {label}</h2>
              <p className="text-white/70 font-bold text-xs uppercase tracking-widest">A New Adventure Awaits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/10 rounded-full transition-colors relative z-10">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-10">
          {success ? (
            <div className="py-16 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner ring-[12px] ring-emerald-50">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
              </div>
              <h3 className="text-4xl font-black text-sky-950 font-comic tracking-tight">{success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className={`p-6 rounded-[32px] border-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm ${error.limitReached ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${error.limitReached ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}`}>
                      {error.limitReached ? <Crown className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <p className={`font-black leading-tight ${error.limitReached ? 'text-orange-700' : 'text-red-600'}`}>{error.message}</p>
                  </div>
                  {error.limitReached && (
                    <Link 
                      href="/dashboard/upgrade" 
                      className="bg-orange-500 text-white font-black py-4 rounded-2xl text-center hover:bg-orange-600 transition-all shadow-xl border-b-4 border-orange-700 active:translate-y-1 active:border-b-0"
                    >
                      Unlock Unlimited Slots 👑
                    </Link>
                  )}
                </div>
              )}

              {/* Avatar Studio Section */}
              <div className="flex flex-col items-center gap-6 mb-4">
                <div className="relative group">
                  {/* Magic Aura Ring */}
                  <div className="absolute inset-[-12px] rounded-[56px] bg-gradient-to-tr from-sky-400 via-purple-400 to-orange-400 opacity-20 animate-spin-slow" />
                  
                  <div className="w-40 h-40 rounded-[48px] bg-sky-50 border-4 border-white overflow-hidden relative shadow-2xl z-10 ring-4 ring-sky-50">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sky-200">
                        {genLoading ? <Loader2 className="w-12 h-12 animate-spin" /> : <Sparkles className="w-12 h-12" />}
                      </div>
                    )}
                  </div>
                  {genLoading && (
                    <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm rounded-[48px] flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={generateAvatar}
                  disabled={genLoading}
                  className="flex items-center gap-3 px-8 py-3 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl border-b-4 border-purple-800 active:translate-y-1 active:border-b-0 disabled:opacity-50 font-comic text-lg relative z-10"
                >
                  <Wand2 className="w-5 h-5" />
                  {avatarUrl ? "Magic Remix ✨" : "Create Magic Avatar ✨"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60">
                    Name of {label}
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-orange-400 focus:outline-none text-sky-950 font-bold text-2xl shadow-inner placeholder:text-sky-200"
                    placeholder={`e.g. Leo`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60">
                    What do they love?
                  </label>
                  <input
                    name="interests"
                    type="text"
                    required
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-orange-400 focus:outline-none text-sky-950 font-bold text-xl shadow-inner placeholder:text-sky-200"
                    placeholder="e.g. Space, Dinosaurs, Pizza"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60">
                    Reading Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: 1, label: "Beginner", icon: "🌱" },
                      { val: 2, label: "Mid", icon: "🌿" },
                      { val: 3, label: "Advanced", icon: "🌳" },
                    ].map((l) => (
                      <button
                        key={l.val}
                        type="button"
                        onClick={() => setReadingLevel(l.val)}
                        className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-1 ${readingLevel === l.val ? 'bg-sky-500 text-white border-sky-700 shadow-lg' : 'bg-sky-50 text-sky-400 border-sky-100'}`}
                      >
                        <span className="text-xl">{l.icon}</span>
                        <span className="font-black text-[10px] uppercase">{l.label}</span>
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="readingLevel" value={readingLevel} />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || genLoading}
                  className={`w-full py-6 ${brandColor} text-white font-black text-3xl rounded-[32px] transition-all shadow-2xl border-b-[10px] ${brandBorder} hover:scale-[1.02] active:scale-95 active:border-b-0 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 group`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      Start Adventure <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 text-sky-400 font-black text-lg hover:text-sky-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Maybe Later
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
