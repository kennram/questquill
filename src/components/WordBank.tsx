"use client";

import { BookMarked, Volume2, Sparkles } from "lucide-react";
import { useCallback } from "react";

interface Word {
  id: string;
  word: string;
  definition: string;
  sentence_context: string;
}

export default function WordBank({ words, name }: { words: Word[], name: string }) {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, []);

  const hasWords = words && words.length > 0;

  return (
    <div className="mt-20 bg-white rounded-[48px] p-12 border-4 border-sky-100 shadow-xl relative overflow-hidden">
      {/* Decorative Sparkles */}
      <Sparkles className="absolute top-10 right-10 w-20 h-20 text-orange-100 animate-pulse" />
      
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="bg-purple-100 p-4 rounded-3xl">
          <BookMarked className="w-10 h-10 text-purple-500" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-sky-900 font-comic uppercase tracking-tight">{name}'s Word Bank</h2>
          <p className="text-sky-600/60 font-bold text-lg">
            {hasWords 
              ? `You are a Word Wizard! You've mastered ${words.length} magic words!` 
              : "Collect magic words from your adventures to fill your wizard bank!"}
          </p>
        </div>
      </div>

      {!hasWords ? (
        <div className="bg-sky-50/50 rounded-[32px] p-12 text-center border-2 border-dashed border-sky-100">
          <p className="text-sky-300 font-black text-xl italic">The wizard bank is waiting for its first word...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {words.map((w) => (
            <div 
              key={w.id}
              className="bg-white border-2 border-sky-50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-black text-purple-600 font-comic lowercase">{w.word}</h3>
                <button 
                  onClick={() => speak(w.word)}
                  className="p-2 bg-sky-50 text-sky-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all active:scale-90"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 font-bold text-sm mb-4 leading-relaxed italic">"{w.definition}"</p>
              <div className="pt-4 border-t border-sky-50">
                <p className="text-[10px] uppercase tracking-widest text-sky-300 font-black mb-1">Found in story:</p>
                <p className="text-xs text-sky-900/40 font-medium line-clamp-2 leading-tight">
                  {w.sentence_context}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
