"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Loader2, CheckCircle2, PartyPopper, Home, ImageOff, Volume2, VolumeX, Ghost, BookMarked, Trophy, Gem, ArrowRight, Crown, Star, Zap, X, Wand2, Lightbulb } from "lucide-react";
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
      <div className="p-6 md:p-16 bg-white rounded-[32px] md:rounded-[56px] shadow-2xl border-4 border-white text-center max-w-2xl mx-auto mt-8 md:mt-20 animate-in zoom-in duration-500 mx-4">
        <div className="w-20 h-20 md:w-32 md:h-32 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner ring-8 ring-sky-50">
          <Ghost className="w-10 h-10 md:w-16 md:h-16 text-sky-200 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-sky-950 mb-4 font-comic tracking-tight leading-none">The magic book is empty!</h2>
        <p className="text-base md:text-xl text-sky-600/70 font-bold mb-8 md:mb-10 leading-relaxed px-2 md:px-8">Something went wrong while writing this adventure. Let's try making a new one!</p>
        <button 
          onClick={() => router.push("/dashboard")} 
          className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-6 bg-sky-500 text-white font-black text-xl md:text-2xl rounded-[20px] md:rounded-[32px] shadow-[0_6px_0_rgb(7,118,181)] md:shadow-[0_10px_0_rgb(7,118,181)] hover:translate-y-[2px] md:hover:translate-y-[5px] active:shadow-none active:translate-y-[6px] md:active:translate-y-[10px] transition-all"
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
  const [showClue, setShowClue] = useState(false);
  
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
    setIsSpeaking(false);
  }, []);

  const speak = async () => {
    if (!page?.text) return;
    
    stopSpeaking();
    setIsSpeaking(true);

    try {
      const res = await fetch("/api/narration", {
        method: "POST",
        body: JSON.stringify({ text: page.text }),
      });

      if (!res.ok) throw new Error("Failed to get audio");

      const audioData = await res.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const buffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      audioSourceRef.current = source;
      source.start();
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, [stopSpeaking]);

  const handleNext = () => {
    stopSpeaking();
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      setAnswer("");
      setIsCorrect(false);
      setShowClue(false);
    }
  };

  const handleBack = () => {
    stopSpeaking();
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setAnswer("");
      setIsCorrect(true);
      setShowClue(false);
    }
  };

  const handleInteractiveChoice = async (choiceId: string, choiceText: string) => {
    stopSpeaking();
    setLoadingNextPage(true);
    try {
      const res = await fetch("/api/continue-story", {
        method: "POST",
        body: JSON.stringify({ 
          storyId: story.id, 
          choiceText,
          previousPages: pages,
          level: story.level || 1,
          name: story.name || "Explorer"
        }),
      });
      const newPage = await res.json();
      
      // Trigger image generation if missing
      if (newPage.imageDescription && !newPage.imageUrl) {
        fetch("/api/generate-image", {
          method: "POST",
          body: JSON.stringify({
            prompt: newPage.imageDescription,
            storyId: story.id,
            pageIndex: pages.length
          })
        }).then(res => res.json()).then(imgData => {
          if (imgData.imageUrl) {
            setPages(prev => prev.map((p, i) => i === prev.length - 1 ? { ...p, imageUrl: imgData.imageUrl } : p));
          }
        });
      }

      // ENSURE PAGE STATE UPDATES BEFORE NAVIGATING
      setPages(prev => {
        const nextPages = [...prev, newPage];
        // Move to the new page ONLY after adding it to state
        setTimeout(() => {
          setCurrentPage(nextPages.length - 1);
          setAnswer("");
          setIsCorrect(false);
          setShowClue(false);
        }, 10);
        return nextPages;
      });
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
        console.log(`[FINISH] Marking mission as complete: "${missionToComplete}"`);
        const mRes = await fetch("/api/complete-mission", {
          method: "POST",
          body: JSON.stringify({ childId: story.child_id, missionText: missionToComplete }),
        });

        if (!mRes.ok) {
          const mErr = await mRes.json().catch(() => ({ error: "Unknown error" }));
          console.error("[FINISH] Mission completion failed:", mErr.error);
        }

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
    } catch (err) {
      console.error("[FINISH] Error finishing adventure:", err);
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
      setAttempts(prev => {
        const newCount = (prev[currentPage] || 0) + 1;
        return { ...prev, [currentPage]: newCount };
      });
    }

    // FUZZY MATCH: Accept if actual contains expected OR expected contains actual (if long enough)
    const isFuzzyMatch = actual === expected || 
                        (expected.length > 2 && actual.includes(expected)) ||
                        (actual.length > 2 && expected.includes(actual));

    if (isFuzzyMatch) {
      setIsCorrect(true);
      const challengeType = page.challenge.toLowerCase().includes("word") || page.challenge.toLowerCase().includes("mean") ? "vocabulary" : "comprehension";
      logChallengeAttempt({ childId: story.child_id, storyId: story.id, challengeType, isSuccess: true, attempts: attempts[currentPage] || 1 }).catch(() => {});
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center pb-24 md:pb-32 px-2 sm:px-4 selection:bg-orange-200">

      {/* CELEBRATION MODAL */}      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-sky-900/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-xl h-full md:h-auto md:max-h-[90vh] rounded-[24px] md:rounded-[64px] p-6 md:p-16 text-center shadow-2xl border-4 md:border-[12px] border-white relative overflow-hidden animate-in zoom-in-90 duration-500 flex flex-col items-center justify-center">
            
            <div className="absolute top-0 left-0 w-full h-2 md:h-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400" />
            
            <Trophy className="w-16 h-16 md:w-40 md:h-40 text-orange-500 mx-auto mb-4 md:mb-8 animate-bounce shrink-0" />
            
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
              <h2 className="text-2xl md:text-6xl font-black text-sky-950 font-comic leading-tight tracking-tight uppercase">Quest Complete!</h2>
              
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <div className="bg-orange-50 px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-[24px] border-2 md:border-4 border-orange-100 flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom duration-700 delay-200">
                  <div className="bg-orange-500 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg shrink-0">
                    <Gem className="w-5 h-5 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-orange-600 font-black uppercase text-[10px] md:text-sm tracking-widest">Gems Earned</p>
                    <p className="text-xl md:text-5xl font-black text-orange-700 leading-none">+{celebrationData?.gemsEarned || 10}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom duration-700 delay-400">
                  <div className="bg-sky-50 px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-[24px] border-2 md:border-4 border-sky-100 flex items-center gap-3 md:gap-4">
                    <div className="bg-sky-500 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg shrink-0">
                      <Star className="w-5 h-5 md:w-10 md:h-10 text-white fill-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sky-600 font-black uppercase text-[10px] md:text-sm tracking-widest">Explorer Level</p>
                      <p className="text-xl md:text-5xl font-black text-sky-700 leading-none">{celebrationData?.newLevel || 1}</p>
                    </div>
                  </div>
                </div>

                {celebrationData?.leveledUp && (
                  <div className="bg-emerald-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-lg md:text-2xl shadow-xl animate-bounce mt-2 md:mt-4 border-2 md:border-4 border-white uppercase tracking-widest flex items-center gap-2 md:gap-3 shrink-0">
                    <Crown className="w-6 h-6 md:w-8 md:h-8" />
                    Level Up!
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => { router.push(`${dashboardPath}?childId=${story.child_id}`); router.refresh(); }}
              className="w-full py-4 md:py-8 bg-sky-500 text-white font-black text-lg md:text-4xl rounded-2xl md:rounded-[40px] shadow-xl hover:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-4 group border-b-[6px] md:border-b-[12px] border-sky-700 active:border-b-0 active:translate-y-2 md:active:translate-y-4 shrink-0"
            >
              Back to Map
              <ArrowRight className="w-5 h-5 md:w-10 md:h-10 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADVENTURE BOOK */}
      <div key={currentPage} className="w-full bg-white rounded-[24px] md:rounded-[56px] shadow-2xl overflow-hidden border-2 md:border-4 border-white relative animate-in slide-in-from-bottom-8 duration-700 flex flex-col">
        
        {loadingNextPage && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-12 text-center animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 md:w-32 md:h-32 text-sky-500 animate-spin mb-4" />
            <h2 className="text-xl md:text-4xl font-black text-sky-950 font-comic tracking-tight leading-none">The story is growing...</h2>
          </div>
        )}

        {/* ILLUSTRATION AREA */}
        <div className="aspect-[4/3] sm:aspect-[16/9] bg-sky-50 relative flex items-center justify-center overflow-hidden shrink-0">
          {page?.imageUrl ? (
            <img key={page.imageUrl} src={page.imageUrl} alt="scene" className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
          ) : (
            <div className="flex flex-col items-center text-sky-300 p-6 md:p-12 text-center">
              <Loader2 className="w-10 h-10 md:w-20 md:h-20 animate-spin mb-4 md:mb-6 text-sky-200" />
              <p className="font-black font-comic text-lg md:text-3xl animate-pulse">Painting the Magic...</p>
            </div>
          )}
          
          {/* Narration Button */}
          <div className="absolute top-3 right-3 md:top-8 md:right-8 flex flex-col items-end gap-3 z-10">
            <button 
              onClick={isSpeaking ? stopSpeaking : speak} 
              className={`p-2.5 md:p-6 rounded-xl md:rounded-[32px] shadow-2xl border-2 md:border-4 transition-all hover:scale-110 active:scale-95 flex items-center gap-2
                ${isSpeaking ? 'bg-orange-500 text-white border-orange-200 animate-pulse' : 'bg-white/90 text-sky-500 border-white'}`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 md:w-8 md:h-8" /> : <Volume2 className="w-4 h-4 md:w-8 md:h-8" />}
              <span className="font-black uppercase tracking-widest text-[10px] md:text-xs hidden sm:block">{isSpeaking ? 'Listening...' : 'Read to Me'}</span>
            </button>
          </div>

          <div className="absolute bottom-3 right-3 md:bottom-8 md:right-8 bg-black/20 backdrop-blur-md px-3 py-0.5 md:px-4 md:py-1 rounded-full text-white font-black text-xs md:text-lg">
            {currentPage + 1} / {pages.length}
          </div>
        </div>

        {/* STORY CONTENT AREA */}
        <div className="p-5 md:p-12 space-y-6 md:space-y-8 bg-gradient-to-b from-white to-sky-50 flex-grow">
          <p className="text-xl md:text-4xl leading-[1.4] text-sky-950 font-bold font-sans selection:bg-purple-100">{page?.text}</p>
          
          {/* READING GATE */}
          <div className={`p-5 md:p-10 rounded-[24px] md:rounded-[48px] border-2 md:border-8 transition-all duration-500
            ${isCorrect ? 'bg-emerald-50 border-emerald-400 shadow-2xl md:scale-[1.01]' : 'bg-white border-sky-100 shadow-inner'}`}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 mb-4 md:mb-8">
              <div className="flex flex-col gap-1 md:gap-2">
                <div className="flex items-center gap-2 md:gap-3 text-sky-500">
                  <div className={`p-1.5 md:p-3 rounded-lg md:rounded-2xl ${isCorrect ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-orange-100 text-orange-500 shadow-orange-100'} shadow-lg border md:border-2 border-white transition-colors duration-500 shrink-0`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8" /> : <Sparkles className={`w-4 h-4 md:w-8 md:h-8 ${!isCorrect && 'animate-pulse'}`} />}
                  </div>
                  <h3 className="font-black text-xs md:text-2xl uppercase tracking-tighter text-sky-900">{isLastPage ? "Final Challenge!" : "Reading Gate"}</h3>
                </div>
                <p className="text-base md:text-3xl font-black text-sky-950 font-comic leading-tight mt-1 md:mt-2">{page?.challenge || "What happened here?"}</p>
              </div>
              
              {isCorrect && (
                <div className="flex items-center gap-1.5 md:gap-3 text-emerald-600 font-black animate-in zoom-in spin-in-3 duration-500 text-base md:text-3xl shrink-0 bg-emerald-100 px-3 py-1.5 md:px-6 md:py-3 rounded-full border md:border-2 border-emerald-200 shadow-sm self-start md:self-auto">
                  <Sparkles className="w-4 h-4 md:w-8 md:h-8 animate-pulse text-orange-400" />
                  MAGICAL! ✨
                </div>
              )}
            </div>

            {!isCorrect ? (
              <div className="space-y-4 md:space-y-6">
                <div className="relative group overflow-hidden rounded-xl md:rounded-3xl border-2 md:border-4 border-sky-100 bg-sky-50/50 shadow-inner">
                  <input 
                    type="text" 
                    value={answer}
                    onChange={(e) => checkAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 md:p-8 bg-transparent outline-none font-bold text-lg md:text-4xl text-sky-900 placeholder:text-sky-200 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-1 md:h-2 bg-sky-400 transition-all duration-1000 w-0 group-focus-within:w-full" />
                </div>

                {/* SAFETY VALVE: CLUE BUTTON */}
                {(attempts[currentPage] >= 2) && (
                  <div className="animate-in slide-in-from-top-2 duration-500">
                    {!showClue ? (
                      <button 
                        onClick={() => setShowClue(true)}
                        className="flex items-center gap-2 text-sky-400 font-black text-xs md:text-sm hover:text-sky-600 transition-colors mx-auto md:mx-0 uppercase tracking-widest"
                      >
                        <Lightbulb className="w-4 h-4 text-orange-400" /> Need a clue?
                      </button>
                    ) : (
                      <div className="bg-sky-50/50 p-4 md:p-6 rounded-2xl border-2 border-dashed border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sky-900 font-bold text-sm md:text-xl text-left">
                          <span className="text-sky-400 uppercase text-[10px] md:text-xs font-black block mb-1">Psst! The magic word is...</span>
                          &quot;{page.answer}&quot;
                        </p>
                        <button 
                          onClick={() => checkAnswer(page.answer)}
                          className="px-6 py-2 bg-sky-500 text-white font-black text-sm md:text-lg rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          Use Magic
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {isInteractive && !page.isFinal && (
                  <div className="grid grid-cols-1 gap-3 md:gap-4 animate-in slide-in-from-bottom duration-500">
                    <p className="text-xs md:text-lg font-black text-sky-400 uppercase tracking-widest ml-2 text-left">Choose your path:</p>
                    {page.choices?.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleInteractiveChoice(choice.id, choice.text)}
                        className="group p-4 md:p-8 bg-white text-sky-900 font-black text-base md:text-3xl rounded-xl md:rounded-[32px] border-2 md:border-4 border-sky-100 shadow-lg hover:border-sky-400 hover:bg-sky-50 transition-all flex items-center justify-between"
                      >
                        <span className="leading-tight">{choice.text}</span>
                        <div className="bg-sky-100 p-1 md:p-3 rounded-lg md:rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4 md:w-8 md:h-8" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 md:gap-6 shrink-0">
                  <button 
                    onClick={isLastPage ? handleFinish : handleNext}
                    disabled={claimingSticker}
                    className={`flex-grow py-4 md:py-8 text-white font-black text-lg md:text-4xl rounded-2xl md:rounded-[40px] shadow-xl hover:translate-y-1 transition-all flex items-center justify-center gap-2 md:gap-4 group border-b-[6px] md:border-b-[12px] active:border-b-0 active:translate-y-4
                      ${isLastPage ? 'bg-orange-500 border-orange-700' : 'bg-sky-500 border-sky-700'}`}
                  >
                    {claimingSticker ? (
                      <Loader2 className="w-6 h-6 md:w-10 md:h-10 animate-spin" />
                    ) : (
                      <>
                        {isLastPage ? 'Finish Quest' : 'Turn Page'}
                        {isLastPage ? <PartyPopper className="w-5 h-5 md:w-10 md:h-10 animate-bounce" /> : <ChevronRight className="w-5 h-5 md:w-10 md:h-10 group-hover:translate-x-3 transition-transform" />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VOCABULARY SECTION */}
          {page?.vocabulary && page.vocabulary.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 pt-4 md:pt-8 animate-in fade-in duration-1000">
              {page.vocabulary.map((v, i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-xl md:rounded-3xl border-2 md:border-4 border-sky-50 shadow-lg group hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 text-purple-500">
                    <BookMarked className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="font-black text-base md:text-2xl font-comic">{v.word}</span>
                  </div>
                  <p className="text-sky-600/70 font-bold text-xs md:text-lg leading-relaxed text-left">{v.definition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 md:mt-12 flex items-center justify-between w-full max-w-xl px-2 md:px-0">
        <button 
          onClick={handleBack}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 md:gap-3 text-sky-400 font-black hover:text-sky-600 disabled:opacity-20 transition-all text-xs md:text-xl group"
        >
          <div className="p-1.5 md:p-3 bg-white rounded-lg md:rounded-2xl border-2 border-sky-50 shadow-lg group-hover:-translate-x-1 transition-transform">
            <ChevronLeft className="w-4 h-4 md:w-8 md:h-8" />
          </div>
          PREVIOUS
        </button>
        
        <button 
          onClick={() => router.push(dashboardPath)}
          className="flex items-center gap-1.5 md:gap-3 text-sky-400 font-black hover:text-sky-600 transition-all text-xs md:text-xl group"
        >
          CLOSE
          <div className="p-1.5 md:p-3 bg-white rounded-lg md:rounded-2xl border-2 border-sky-50 shadow-lg group-hover:scale-110 transition-transform">
            <X className="w-4 h-4 md:w-8 md:h-8" />
          </div>
        </button>
      </div>
    </div>
  );
}
