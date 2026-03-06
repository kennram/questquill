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
    <div className="mt-8 md:mt-20 bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 border-2 md:border-4 border-sky-100 shadow-xl relative overflow-hidden">
      {/* Decorative Sparkles - Shrunk on mobile */}
      <Sparkles className="absolute top-4 right-4 md:top-10 md:right-10 w-10 h-10 md:w-20 md:h-20 text-orange-100 animate-pulse" />
      
      <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 relative z-10">
        <div className="bg-purple-100 p-2.5 md:p-4 rounded-xl md:rounded-3xl shrink-0">
          <BookMarked className="w-6 h-6 md:w-10 md:h-10 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl md:text-4xl font-black text-sky-900 font-comic uppercase tracking-tight leading-tight">{name}'s Word Bank</h2>
          <p className="text-sky-600/60 font-bold text-xs md:text-lg">
            {hasWords 
              ? `Word Wizard! ${words.length} words mastered!` 
              : "Collect magic words to fill your bank!"}
          </p>
        </div>
      </div>

      {!hasWords ? (
        <div className="bg-sky-50/50 rounded-2xl md:rounded-[32px] p-8 md:p-12 text-center border-2 border-dashed border-sky-100">
          <p className="text-sky-300 font-black text-base md:text-xl italic leading-relaxed">The wizard bank is waiting for its first word...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
          {words.map((w) => (
            <div 
              key={w.id}
              className="bg-white border-2 border-sky-50 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] group"
            >
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <h3 className="text-lg md:text-2xl font-black text-purple-600 font-comic lowercase">{w.word}</h3>
                <button 
                  onClick={() => speak(w.word)}
                  className="p-1.5 md:p-2 bg-sky-50 text-sky-400 rounded-lg md:rounded-xl hover:bg-sky-500 hover:text-white transition-all active:scale-90 shrink-0"
                >
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <p className="text-slate-600 font-bold text-xs md:text-sm mb-3 md:mb-4 leading-relaxed italic">"{w.definition}"</p>
              <div className="pt-3 md:pt-4 border-t border-sky-50">
                <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-sky-300 font-black mb-1">Context:</p>
                <p className="text-[10px] md:text-xs text-sky-900/40 font-medium line-clamp-2 leading-tight">
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
