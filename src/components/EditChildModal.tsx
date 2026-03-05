import { useState } from "react";
import { X, UserPlus, Sparkles, Wand2, Loader2, Trash2, CheckCircle2, AlertTriangle, Settings, ShieldCheck } from "lucide-react";
import { updateChild, deleteChild } from "@/app/dashboard/actions";

interface Child {
  id: string;
  name: string;
  interests: string[];
  avatar_url?: string;
  reading_level?: number;
}

interface EditChildModalProps {
  child: Child;
  onClose: () => void;
  role?: "parent" | "teacher" | "student";
}

export default function EditChildModal({ 
  child, 
  onClose,
  role = "parent"
}: EditChildModalProps) {
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(child.avatar_url || null);
  const [name, setName] = useState(child.name);
  const [interests, setInterests] = useState(child.interests.join(", "));
  const [readingLevel, setReadingLevel] = useState(child.reading_level || 1);

  const label = (role === "teacher" || role === "student") ? "Student" : "Explorer";
  const brandColor = (role === "teacher" || role === "student") ? "bg-orange-500" : "bg-sky-500";
  const brandBorder = (role === "teacher" || role === "student") ? "border-orange-700" : "border-sky-700";

  async function generateAvatar() {
    setGenLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-avatar", {
        method: "POST",
        body: JSON.stringify({ description: `${name} who likes ${interests}` }),
      });
      const data = await res.json();
      setAvatarUrl(data.imageUrl);
    } catch {
      setError("Magic mirror is fuzzy...");
    } finally {
      setGenLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const result = await deleteChild(child.id);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      setShowDeleteConfirm(false);
    } else {
      setSuccess(`${label} removed from your team.`);
      setTimeout(onClose, 1500);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    if (avatarUrl) formData.append("avatarUrl", avatarUrl);
    formData.append("readingLevel", readingLevel.toString());

    const result = await updateChild(child.id, formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess("Changes saved successfully! ✨");
      setTimeout(onClose, 1500);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sky-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className={`${brandColor} p-8 flex justify-between items-center text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Settings className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-comic tracking-tight">Edit {label}</h2>
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Update the Magic</p>
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
          ) : showDeleteConfirm ? (
            <div className="py-8 text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 shadow-inner ring-[16px] ring-red-50">
                  <AlertTriangle className="w-16 h-16 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-red-100">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-5xl font-black text-sky-950 font-comic tracking-tight">Wait!</h3>
                <p className="text-2xl text-sky-600 font-bold px-12 leading-tight">
                  Are you sure you want to remove <span className="text-red-500 underline decoration-red-200 underline-offset-4">{name}</span>? 
                </p>
                <div className="bg-orange-50 mx-8 p-4 rounded-2xl border-2 border-orange-100 text-orange-700 font-black text-sm uppercase tracking-widest">
                  This will delete all their stories forever
                </div>
              </div>

              <div className="flex flex-col gap-4 px-8">
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full py-6 bg-red-500 text-white font-black text-2xl rounded-[32px] shadow-2xl border-b-[10px] border-red-700 hover:bg-red-600 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Trash2 className="w-8 h-8 group-hover:rotate-12 transition-transform" />}
                  Yes, Delete {label}
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="w-full py-6 bg-sky-500 text-white font-black text-2xl rounded-[32px] shadow-xl border-b-[10px] border-sky-700 hover:bg-sky-600 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                >
                  <ShieldCheck className="w-8 h-8" />
                  No, Keep {label}!
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-6 bg-red-50 border-4 border-red-100 text-red-600 font-black rounded-[32px] text-center shadow-sm">
                  {error}
                </div>
              )}

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-6 mb-4">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[48px] bg-sky-50 border-4 border-sky-100 overflow-hidden relative shadow-inner ring-8 ring-sky-50/50">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sky-200">
                        {genLoading ? <Loader2 className="w-12 h-12 animate-spin" /> : <Sparkles className="w-12 h-12" />}
                      </div>
                    )}
                  </div>
                  {genLoading && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-[48px] flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={generateAvatar}
                  disabled={genLoading}
                  className="flex items-center gap-3 px-8 py-3 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl border-b-4 border-purple-800 active:translate-y-1 active:border-b-0 disabled:opacity-50 font-comic text-lg"
                >
                  <Wand2 className="w-5 h-5" />
                  Magic Remix ✨
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-4">
                    {label}'s Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-orange-400 focus:outline-none text-sky-950 font-bold text-2xl shadow-inner placeholder:text-sky-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-widest text-xs ml-4">
                    What do they love?
                  </label>
                  <input
                    name="interests"
                    type="text"
                    required
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-orange-400 focus:outline-none text-sky-950 font-bold text-xl shadow-inner placeholder:text-sky-200"
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
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="p-6 bg-red-100 text-red-600 rounded-[32px] hover:bg-red-200 transition-all active:scale-95 border-4 border-transparent hover:border-red-200 group" 
                  title="Remove Explorer"
                >
                  <Trash2 className="w-8 h-8 group-hover:rotate-6 transition-transform" />
                </button>
                
                <button
                  type="submit"
                  disabled={loading || genLoading}
                  className={`flex-grow py-6 ${brandColor} text-white font-black text-3xl rounded-[32px] transition-all shadow-2xl border-b-[10px] ${brandBorder} hover:scale-[1.02] active:scale-95 active:border-b-0 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 group`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
