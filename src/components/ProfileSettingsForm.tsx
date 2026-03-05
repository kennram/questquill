"use client";

import { useState } from "react";
import { updateProfile } from "@/app/dashboard/actions";
import { User as UserIcon, Check, AlertCircle, Mail, Sparkles, Wand2, Loader2 } from "lucide-react";

export default function ProfileSettingsForm({ 
  initialUsername,
  initialAvatarUrl,
  userEmail 
}: { 
  initialUsername: string,
  initialAvatarUrl?: string,
  userEmail: string
}) {
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [username, setUsername] = useState(initialUsername);

  async function generateAvatar() {
    if (!username) {
      setMessage({ type: "error", text: "Please enter a username first so the magic knows what to draw!" });
      return;
    }
    setGenLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/generate-avatar", {
        method: "POST",
        body: JSON.stringify({ description: `${username}, a magical explorer guide` }),
      });
      const data = await res.json();
      setAvatarUrl(data.imageUrl);
    } catch (err) {
      setMessage({ type: "error", text: "Magic mirror is fuzzy... try again!" });
    } finally {
      setGenLoading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Add avatarUrl to formData
    if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl);
    }

    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully! ✨" });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100" : "bg-red-50 text-red-600 border-2 border-red-100"
        }`}>
          {message.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* Identity Section - Moved to Top */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-sky-400 uppercase tracking-widest ml-1">1. Choose Your Guide Name</label>
          <div className="relative">
            <input 
              type="text" 
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border-4 border-sky-100 focus:border-sky-300 rounded-2xl p-5 font-black text-2xl text-sky-900 outline-none transition-all pl-14 shadow-sm"
              placeholder="e.g. Captain Adventure"
              required
            />
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-sky-300" />
          </div>
          <p className="text-xs text-sky-400 font-bold ml-1 italic">This name will be used to generate your magical avatar!</p>
        </div>

        {/* Avatar Section - Now below the username */}
        <div className="bg-sky-50 rounded-[40px] p-8 border-4 border-white shadow-inner flex flex-col md:flex-row items-center gap-8 transition-all">
          <div className="w-40 h-40 rounded-[48px] bg-white border-4 border-white overflow-hidden relative shadow-2xl shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover animate-in fade-in zoom-in" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sky-100 bg-sky-50">
                <UserIcon className="w-20 h-20" />
              </div>
            )}
            {genLoading && (
              <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
              </div>
            )}
          </div>
          
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div>
              <h4 className="text-xl font-black text-sky-900 font-comic">2. Magic Avatar</h4>
              <p className="text-sky-600 font-bold">Generate a unique Pixar-style character based on your name!</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                type="button"
                onClick={generateAvatar}
                disabled={genLoading}
                className="flex items-center gap-2 px-8 py-3 bg-purple-500 text-white font-black rounded-2xl hover:bg-purple-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 border-b-4 border-purple-700"
              >
                <Wand2 className="w-5 h-5" />
                {avatarUrl ? "Remix Avatar ✨" : "Create My Avatar ✨"}
              </button>
            </div>
          </div>
        </div>

        {/* Read Only Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-2 opacity-60">
            <label className="text-sm font-black text-sky-400 uppercase tracking-widest ml-1">Login Email</label>
            <div className="relative">
              <input 
                type="email" 
                readOnly
                defaultValue={userEmail}
                className="w-full bg-gray-50 border-4 border-transparent rounded-2xl p-4 font-bold text-gray-500 outline-none pl-12 shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading || genLoading}
          className="px-12 py-5 bg-sky-500 text-white font-black text-2xl rounded-2xl hover:bg-sky-600 transition-all shadow-xl border-b-8 border-sky-700 active:translate-y-2 active:border-b-0 disabled:opacity-50"
        >
          {loading ? "Saving Your Quest..." : "Save My Profile ✨"}
        </button>
      </div>
    </form>
  );
}
