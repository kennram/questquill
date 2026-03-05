"use client";

import { useState } from "react";
import { X, Users, Sparkles, Loader2, AlertCircle, CheckCircle2, ListPlus } from "lucide-react";
import { bulkAddChildren } from "@/app/dashboard/actions";

interface BulkAddModalProps {
  onClose: () => void;
}

export default function BulkAddModal({ onClose }: BulkAddModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [rawNames, setRawNames] = useState("");
  const [readingLevel, setReadingLevel] = useState(1);

  const handleBulkAdd = async () => {
    const names = rawNames
      .split("\n")
      .map(n => n.trim())
      .filter(n => n !== "");

    if (names.length === 0) {
      setError("Please enter at least one student name.");
      return;
    }

    setLoading(true);
    setError(null);

    const students = names.map(name => ({
      name,
      interests: "Stories, Magic, Discovery", // Default fallback interests
      readingLevel
    }));

    try {
      const result = await bulkAddChildren(students);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessCount(result.count ?? 0);
        // Delay close to show success state
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Try a smaller list?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sky-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-purple-600 p-8 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <ListPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-comic tracking-tight">Bulk Student Add</h2>
              <p className="text-purple-100 font-bold text-sm uppercase tracking-widest">Legendary Teacher Feature</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors relative z-10">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {successCount !== null ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
              </div>
              <h3 className="text-3xl font-black text-sky-900 font-comic">Success!</h3>
              <p className="text-xl text-sky-600 font-bold">Added {successCount} new students to your classroom.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <label className="text-sky-700 font-black uppercase tracking-widest text-sm">Enter Student Names</label>
                  <span className="text-[10px] font-black text-sky-300 uppercase bg-sky-50 px-2 py-1 rounded-md">One Name Per Line</span>
                </div>
                <textarea
                  value={rawNames}
                  onChange={(e) => setRawNames(e.target.value)}
                  placeholder="e.g.&#10;Leo Messi&#10;Sarah Explorer&#10;David Space"
                  rows={6}
                  className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-purple-400 focus:outline-none text-sky-900 font-bold text-xl placeholder:text-sky-200 resize-none shadow-inner"
                />
              </div>

              {/* Reading Level Selector */}
              <div className="space-y-4">
                <label className="text-sky-700 font-black uppercase tracking-widest text-sm px-1">Class Reading Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: 1, label: "Beginner", icon: "🌱", desc: "Short sentences" },
                    { val: 2, label: "Intermediate", icon: "🌿", desc: "Story depth" },
                    { val: 3, label: "Advanced", icon: "🌳", desc: "Complex vocab" },
                  ].map((l) => (
                    <button
                      key={l.val}
                      onClick={() => setReadingLevel(l.val)}
                      className={`p-4 rounded-[24px] border-4 transition-all text-left group ${readingLevel === l.val ? 'bg-purple-600 text-white border-purple-800 shadow-lg' : 'bg-sky-50 text-sky-400 border-sky-100 hover:border-purple-200'}`}
                    >
                      <div className="text-2xl mb-1">{l.icon}</div>
                      <p className="font-black text-xs uppercase mb-1">{l.label}</p>
                      <p className={`text-[10px] font-bold opacity-60 leading-none ${readingLevel === l.val ? 'text-purple-100' : 'text-sky-300'}`}>{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-black text-purple-900">Pro Tip</h4>
                </div>
                <p className="text-purple-700 text-sm font-medium leading-relaxed">
                  Pasting a list from Excel or Google Sheets? Just copy the name column and paste it here! We'll handle the magic.
                </p>
              </div>

              <button
                onClick={handleBulkAdd}
                disabled={loading || rawNames.trim() === ""}
                className="w-full py-6 bg-purple-600 text-white font-black text-3xl rounded-[32px] transition-all shadow-xl shadow-purple-100 border-b-[10px] border-purple-800 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 active:border-b-0 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    Onboarding Classroom...
                  </>
                ) : (
                  <>
                    <Users className="w-8 h-8 group-hover:rotate-6 transition-transform" />
                    Add All Students ✨
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
