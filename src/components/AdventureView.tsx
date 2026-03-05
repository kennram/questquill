"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Loader2, CheckCircle2, PartyPopper, Home, ImageOff, Volume2, VolumeX, Ghost, BookMarked, Trophy, Gem, ArrowRight, Crown, Star, Zap, X, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { logChallengeAttempt } from "@/app/dashboard/actions";

interface Choice {
  text: string;
  id: string;
}

interface VocabularyWord {
  word: string;
  definition: string;
}

interface CelebrationData {
  newLevel: number;
  leveledUp: boolean;
  gemsEarned: number;
}

interface StoryPage {
  text: string;
  challenge: string;
  answer: string;
  imageDescription: string;
  imageUrl?: string;
  choices?: Choice[];
  isFinal?: boolean;
  vocabulary?: VocabularyWord[];
}

interface AdventureViewProps {
  story: {
    id: string;
    child_id: string;
    title: string;
    mode: "classic" | "interactive";
    pages: StoryPage[];
    name?: string;
    level?: number;
    is_premium?: boolean;
    mission?: string | null;
  };
  classMission?: string | null;
  role?: "parent" | "teacher" | "student";
  onFinish?: (mission: string) => void;
}

export default function AdventureView({ story, classMission = null, role = "parent", onFinish }: AdventureViewProps) {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const dashboardPath = role === "student" ? "/student/dashboard" : "/dashboard";
  
  if (!story || !story.pages || !Array.isArray(story.pages) || story.pages.length === 0) {
    return (
      <div className="p-6 md:p-16 bg-white rounded-[32px] md:rounded-[56px] shadow-2xl border-4 border-white text-center max-w-2xl mx-auto mt-8 md:mt-20 animate-in zoom-in duration-500">
        <div className="w-20 h-20 md:w-32 md:h-32 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner ring-8 ring-sky-50">
          <Ghost className="w-10 h-10 md:w-16 md:h-16 text-sky-200 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-sky-950 mb-4 font-comic tracking-tight leading-none">The magic book is empty!</h2>
        <p className="text-base md:text-xl text-sky-600/70 font-bold mb-8 md:mb-10 leading-relaxed px-4 md:px-8">Something went wrong while writing this adventure. Let's try making a new one!</p>
        <button 
          onClick={() => router.push("/dashboard")} 
          className="px-8 py-4 md:px-12 md:py-6 bg-sky-500 text-white font-black text-xl md:text-2xl rounded-[20px] md:rounded-[32px] shadow-[0_6px_0_rgb(7,118,181)] md:shadow-[0_10px_0_rgb(7,118,181)] hover:translate-y-[2px] md:hover:translate-y-[5px] active:shadow-none active:translate-y-[6px] md:active:translate-y-[10px] transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [pages, setPages] = useState<StoryPage[]>(story.pages);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [claimingSticker, setClaimingSticker] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);

  const safePageIndex = Math.min(currentPage, pages.length - 1);
  const page = pages[safePageIndex] || pages[0];
  
  const isInteractive = story.mode === "interactive";
  const isLastPage = isInteractive ? (page?.isFinal || pages.length >= 10) : (safePageIndex === pages.length - 1);

  // --- NARRATION ---
  const stopSpeaking = useCallback(() => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e) {}
      audioSourceRef.current = null;
    }
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async () => {
    if (!page?.text) return;
    stopSpeaking();
    setIsSpeaking(true);

    console.log("%c[NARRATION] 🎙️ Attempting Web Audio Playback...", "color: #9333EA; font-weight: bold;");

    try {
      const res = await fetch("/api/narration", {
        method: "POST",
        body: JSON.stringify({ text: page.text }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const arrayBuffer = await res.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      audioSourceRef.current = source;
      
      console.log("%c[NARRATION] ✅ Web Audio engine is firing!", "color: #059669; font-weight: bold;");
      
      source.onended = () => {
        setIsSpeaking(false);
      };

      source.start(0);
      console.log("%c[NARRATION] 🔈 Audio should be playing now.", "color: #0EA5E9; font-weight: bold;");

    } catch (err) {
      console.warn("%c[NARRATION] 🤖 Fallback: Using browser speech engine.", "color: #F97316; font-weight: bold;", err);
      
      const utterance = new SpeechSynthesisUtterance(page.text);
      utterance.pitch = 1.1;
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [page?.text, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [stopSpeaking]);

  useEffect(() => {
    stopSpeaking();
  }, [currentPage, stopSpeaking]);

  // --- IMAGE FETCH ---
  const fetchImage = useCallback(async (index: number) => {
    if (index < 0 || index >= pages.length || pages[index]?.imageUrl) return;
    const pageToFetch = pages[index];
    if (!pageToFetch) return;

    const keywords = (pageToFetch.imageDescription || "magic adventure").replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 3).join(",");
    const placeholderUrl = `https://loremflickr.com/1024/1024/pixar,${encodeURIComponent(keywords)}?lock=${story.id}-${index}`;
    
    setPages(prev => {
      const updated = [...prev];
      if (updated[index]) updated[index] = { ...updated[index], imageUrl: placeholderUrl };
      return updated;
    });

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ prompt: pageToFetch.imageDescription || "magic", storyId: story.id, pageIndex: index }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setPages(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], imageUrl: data.imageUrl };
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Image generation background sync failed:", err);
    }
  }, [pages, story.id]);

  // --- VOCABULARY SAVE ---
  const saveVocabulary = useCallback(async (index: number) => {
    const pageToSave = pages[index];
    if (!pageToSave || !pageToSave.vocabulary || pageToSave.vocabulary.length === 0) return;

    for (const v of pageToSave.vocabulary) {
      try {
        await fetch("/api/add-vocabulary", {
          method: "POST",
          body: JSON.stringify({
            childId: story.child_id,
            word: v.word,
            definition: v.definition,
            sentenceContext: pageToSave.text,
            storyId: story.id
          }),
        });
      } catch (err) {
        console.error(`Failed to save word: ${v.word}`, err);
      }
    }
  }, [pages, story.id, story.child_id]);

  useEffect(() => {
    if (page) {
      if (!page.imageUrl) fetchImage(safePageIndex);
      saveVocabulary(safePageIndex);
    }
  }, [safePageIndex, page, fetchImage, saveVocabulary]);

  const handleChoice = async (choice: Choice) => {
    setLoadingNextPage(true);
    try {
      const res = await fetch("/api/continue-story", {
        method: "POST",
        body: JSON.stringify({
          storyId: story.id,
          choiceText: choice.text,
          previousPages: pages,
          name: story.name || "Adventurer",
          level: story.level || 1
        }),
      });
      const newPage = await res.json();
      setPages(prev => [...prev, newPage]);
      setCurrentPage(prev => prev + 1);
      setAnswer("");
      setIsCorrect(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNextPage(false);
    }
  };

  const handleFinish = async () => {
    stopSpeaking();
    setClaimingSticker(true);
    try {
      const res = await fetch("/api/claim-sticker", {
        method: "POST",
        body: JSON.stringify({ storyId: story.id, childId: story.child_id, storyTitle: story.title }),
      });
      const data = await res.json();
      
      const missionToComplete = story.mission || classMission;

      if (missionToComplete) {
        await fetch("/api/complete-mission", {
          method: "POST",
          body: JSON.stringify({ childId: story.child_id, missionText: missionToComplete }),
        });
        
        // Local state masking via callback
        if (onFinish) {
          onFinish(missionToComplete);
        }
      }

      setCelebrationData({ 
        newLevel: data.newLevel, 
        leveledUp: data.leveledUp,
        gemsEarned: data.gemsEarned || 10
      });
      setShowCelebration(true);
      router.refresh();
    } catch {
      router.push(dashboardPath);
    } finally {
      setClaimingSticker(false);
    }
  };

  const cleanString = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  const checkAnswer = (val: string) => {
    setAnswer(val);
    const expected = cleanString(page?.answer || "");
    const actual = cleanString(val);
    
    if (val.length > 0 && !isCorrect) {
      setAttempts(prev => ({ ...prev, [currentPage]: (prev[currentPage] || 0) + 1 }));
    }

    if (actual === expected || (expected.length > 2 && actual.includes(expected))) {
      setIsCorrect(true);
      const challengeType = page.challenge.toLowerCase().includes("word") || page.challenge.toLowerCase().includes("mean") ? "vocabulary" : "comprehension";
      logChallengeAttempt({ childId: story.child_id, storyId: story.id, challengeType, isSuccess: true, attempts: attempts[currentPage] || 1 });
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center pb-24 md:pb-32 px-4 selection:bg-orange-200">
      
      {/* DEV CHEAT BUTTON */}
      <button 
        onClick={() => { setCurrentPage(pages.length - 1); setIsCorrect(true); }}
        className="fixed bottom-6 left-6 z-[200] p-4 bg-orange-500 text-white rounded-full shadow-2xl border-4 border-white hover:scale-110 active:scale-95 transition-all group flex items-center gap-2"
        title="Cheat: Go to Final Page"
      >
        <Ghost className="w-6 h-6 animate-pulse" />
        <span className="font-black text-xs uppercase tracking-widest pr-2">Skip to End</span>
      </button>
      
      {/* CELEBRATION MODAL */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-sky-900/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-xl rounded-[32px] md:rounded-[64px] p-6 md:p-16 text-center shadow-2xl border-4 md:border-[12px] border-white relative overflow-hidden animate-in zoom-in-90 duration-500">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400" />
            
            <Trophy className="w-20 h-20 md:w-40 md:h-40 text-orange-500 mx-auto mb-8 animate-bounce" />
            
            <div className="space-y-4 mb-12">
              <h2 className="text-3xl md:text-6xl font-black text-sky-950 font-comic leading-tight tracking-tight uppercase">Quest Complete!</h2>
              
              <div className="flex flex-col items-center gap-4">
                <div className="bg-orange-50 px-8 py-4 rounded-[24px] border-4 border-orange-100 flex items-center gap-4 animate-in slide-in-from-bottom duration-700 delay-200">
                  <div className="bg-orange-500 p-2 rounded-xl shadow-lg">
                    <Gem className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-orange-600 font-black uppercase text-xs md:text-sm tracking-widest">Gems Earned</p>
                    <p className="text-2xl md:text-5xl font-black text-orange-700 leading-none">+{celebrationData?.gemsEarned || 10}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 animate-in slide-in-from-bottom duration-700 delay-400">
                  <div className="bg-sky-50 px-8 py-4 rounded-[24px] border-4 border-sky-100 flex items-center gap-4">
                    <div className="bg-sky-500 p-2 rounded-xl shadow-lg">
                      <Star className="w-6 h-6 md:w-10 md:h-10 text-white fill-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sky-600 font-black uppercase text-xs md:text-sm tracking-widest">Explorer Level</p>
                      <p className="text-2xl md:text-5xl font-black text-sky-700 leading-none">{celebrationData?.newLevel || 1}</p>
                    </div>
                  </div>
                </div>

                {celebrationData?.leveledUp && (
                  <div className="bg-emerald-500 text-white px-8 py-4 rounded-full font-black text-xl md:text-2xl shadow-xl animate-bounce mt-4 border-4 border-white uppercase tracking-widest flex items-center gap-3">
                    <Crown className="w-8 h-8" />
                    Level Up!
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => { router.push(`${dashboardPath}?childId=${story.child_id}`); router.refresh(); }}
              className="w-full py-4 md:py-8 bg-sky-500 text-white font-black text-lg md:text-4xl rounded-2xl md:rounded-[40px] shadow-xl hover:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-4 group border-b-[8px] md:border-b-[12px] border-sky-700 active:border-b-0 active:translate-y-4"
            >
              Back to Map
              <ArrowRight className="w-5 h-5 md:w-10 md:h-10 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADVENTURE BOOK */}
      <div className="w-full bg-white rounded-[32px] md:rounded-[56px] shadow-2xl overflow-hidden border-2 md:border-4 border-white relative animate-in slide-in-from-bottom-8 duration-700">
        
        {loadingNextPage && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-12 text-center animate-in fade-in duration-500">
            <Loader2 className="w-16 h-16 md:w-32 md:h-32 text-sky-500 animate-spin mb-4" />
            <h2 className="text-2xl md:text-4xl font-black text-sky-950 font-comic tracking-tight leading-none">The story is growing...</h2>
          </div>
        )}

        {/* ILLUSTRATION AREA */}
        <div className="aspect-[16/9] bg-sky-50 relative flex items-center justify-center overflow-hidden">
          {page?.imageUrl ? (
            <img key={page.imageUrl} src={page.imageUrl} alt="scene" className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
          ) : (
            <div className="flex flex-col items-center text-sky-300 p-6 md:p-12 text-center">
              <Loader2 className="w-10 h-10 md:w-20 md:h-20 animate-spin mb-4 md:mb-6 text-sky-200" />
              <p className="font-black font-comic text-lg md:text-3xl animate-pulse">Painting the Magic...</p>
            </div>
          )}
          
          {/* Narration Button */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-3 z-10">
            <button 
              onClick={isSpeaking ? stopSpeaking : speak} 
              className={`p-3 md:p-6 rounded-xl md:rounded-[32px] shadow-2xl border-2 md:border-4 transition-all hover:scale-110 active:scale-95 flex items-center gap-2
                ${isSpeaking ? 'bg-orange-500 text-white border-orange-200 animate-pulse' : 'bg-white/90 text-sky-500 border-white'}`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
              <span className="font-black uppercase tracking-widest text-xs hidden sm:block">{isSpeaking ? 'Listening...' : 'Read to Me'}</span>
            </button>
          </div>

          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-black/20 backdrop-blur-md px-4 py-1 rounded-full text-white font-black text-sm md:text-lg">
            {currentPage + 1} / {pages.length}
          </div>
        </div>

        {/* STORY CONTENT AREA */}
        <div className="p-6 md:p-12 space-y-8 bg-gradient-to-b from-white to-sky-50">
          <p className="text-2xl md:text-4xl leading-[1.4] text-sky-950 font-bold font-sans selection:bg-purple-100">{page?.text}</p>
          
          {/* READING GATE */}
          <div className={`p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-4 md:border-8 transition-all duration-500
            ${isCorrect ? 'bg-emerald-50 border-emerald-400 shadow-2xl scale-[1.01]' : 'bg-white border-sky-100 shadow-inner'}`}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-4 md:mb-8">
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="flex items-center gap-2 md:gap-3 text-sky-500">
                  <div className={`p-1.5 md:p-3 rounded-lg md:rounded-2xl ${isCorrect ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-orange-100 text-orange-500 shadow-orange-100'} shadow-lg border md:border-2 border-white transition-colors duration-500`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8" /> : <Sparkles className={`w-4 h-4 md:w-8 md:h-8 ${!isCorrect && 'animate-pulse'}`} />}
                  </div>
                  <h3 className="font-black text-sm md:text-2xl uppercase tracking-tighter text-sky-900">{isLastPage ? "Final Challenge!" : "Reading Gate"}</h3>
                </div>
                <p className="text-lg md:text-3xl font-black text-sky-950 font-comic leading-tight mt-1 md:mt-2">{page?.challenge || "What happened here?"}</p>
              </div>
              
              {isCorrect && (
                <div className="flex items-center gap-1.5 md:gap-3 text-emerald-600 font-black animate-in zoom-in spin-in-3 duration-500 text-lg md:text-3xl shrink-0 bg-emerald-100 px-3 py-1.5 md:px-6 md:py-3 rounded-full border md:border-2 border-emerald-200 shadow-sm">
                  <Sparkles className="w-5 h-5 md:w-8 md:h-8 animate-pulse text-orange-400" />
                  MAGICAL! ✨
                </div>
              )}
            </div>
            
            <div className="relative group">
              <input
                type="text"
                autoFocus
                value={answer}
                onChange={(e) => checkAnswer(e.target.value)}
                placeholder="Type the answer..."
                className={`w-full p-4 md:p-8 text-xl md:text-4xl border-[3px] md:border-[6px] rounded-xl md:rounded-[36px] focus:outline-none transition-all font-black shadow-xl appearance-none
                  ${isCorrect ? 'bg-white border-emerald-500 text-emerald-700' : 'bg-sky-50 border-sky-100 focus:border-orange-400 text-sky-950 placeholder:text-sky-200'}`}
              />
              {!isCorrect && (
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Wand2 className="w-6 h-6 md:w-10 md:h-10 text-orange-400" />
                </div>
              )}
              {isCorrect && (
                <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 animate-bounce">
                  <div className="bg-orange-500 text-white p-3 md:p-5 rounded-2xl shadow-2xl rotate-12 border-4 border-white">
                    <Star className="w-6 h-6 md:w-10 md:h-10 fill-white" />
                  </div>
                </div>
              )}
            </div>
            
            {/* choices for Interactive mode */}
            {isCorrect && !isLastPage && isInteractive && page?.choices && (
              <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500">
                {page.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    className="p-6 md:p-8 bg-orange-500 text-white rounded-xl md:rounded-[32px] font-black text-xl md:text-2xl shadow-xl hover:translate-y-1 transition-all"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}

            {isLastPage && isCorrect && (
              <button 
                onClick={handleFinish} 
                disabled={claimingSticker} 
                className="mt-8 w-full py-6 md:py-10 bg-emerald-500 text-white rounded-[32px] md:rounded-[40px] shadow-2xl font-black text-2xl md:text-5xl group flex items-center justify-center gap-4"
              >
                {claimingSticker ? <Loader2 className="animate-spin" /> : <Trophy />}
                {claimingSticker ? 'CLAIMING...' : 'FINISH QUEST'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="mt-8 flex items-center gap-6">
        <button 
          onClick={() => { setCurrentPage(prev => Math.max(0, prev - 1)); setIsCorrect(true); }} 
          disabled={currentPage === 0} 
          className="p-4 md:p-6 bg-white text-sky-400 rounded-full disabled:opacity-20 shadow-xl border-4 border-white hover:scale-110 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 stroke-[4px]" />
        </button>
        
        {!isInteractive && !isLastPage && (
          <button 
            onClick={() => { if (isCorrect) { setCurrentPage(p => p + 1); setAnswer(""); setIsCorrect(false); } }} 
            disabled={!isCorrect} 
            className={`p-4 md:p-8 rounded-full shadow-xl transition-all border-b-8
              ${isCorrect ? "bg-orange-500 text-white border-orange-700 scale-110 active:border-b-0 active:translate-y-2" 
                         : "bg-slate-200 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed"}`}
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12 stroke-[5px]" />
          </button>
        )}
      </div>
    </div>
  );
}
