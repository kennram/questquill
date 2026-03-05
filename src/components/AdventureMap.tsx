"use client";

import { Map as MapIcon, Sparkles, LocateFixed, Lock, Gem, Landmark, Cloud, Compass, Search, Loader2, Footprints, Flag, ChevronLeft, ChevronRight, Snowflake, Flame, Mountain, Book, Crown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import DiscoveryJournal from "@/components/DiscoveryJournal";
import Link from "next/link";

interface Sticker {
  id: string;
  image_url: string;
  name: string;
}

interface Discovery {
  id: string;
  biome_id: string;
  name: string;
  image_url: string;
}

interface Biome {
  id: string;
  name: string;
  levelRequired: number;
  stickersRequired: number; // Clearer educational goal
  color: string;
  icon: any;
  description: string;
  position: { top: string, left: string };
}

interface Region {
  id: number;
  name: string;
  biomes: Biome[];
  background: string;
}

export default function AdventureMap({ 
  stickers, 
  name, 
  childId,
  explorerLevel = 1,
  gems = 0,
  initialDiscoveries = [],
  isPremium = false
}: { 
  stickers: Sticker[], 
  name: string,
  childId?: string,
  explorerLevel?: number,
  gems?: number,
  initialDiscoveries?: Discovery[],
  isPremium?: boolean
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>(initialDiscoveries);
  const [localGems, setLocalGems] = useState(gems);
  const [activeRegion, setActiveRegion] = useState(0);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  useEffect(() => { setLocalGems(gems); }, [gems]);
  useEffect(() => { setDiscoveries(initialDiscoveries); }, [initialDiscoveries]);

  // Define Regions (Continents) with sticker goals
  const regions: Region[] = useMemo(() => [
    {
      id: 0,
      name: "The Origins",
      background: "bg-sky-900/40",
      biomes: [
        { id: 'home', name: 'Explorer HQ', stickersRequired: 0, levelRequired: 1, color: 'bg-amber-400', icon: Home, description: 'Your base of operations!', position: { top: '55%', left: '15%' } },
        { id: 'woods', name: 'Whispering Woods', stickersRequired: 3, levelRequired: 2, color: 'bg-green-500', icon: Trees, description: 'Read 3 stories to reveal the ancient forest!', position: { top: '35%', left: '35%' } },
        { id: 'caverns', name: 'Crystal Caverns', stickersRequired: 6, levelRequired: 3, color: 'bg-purple-500', icon: Sparkles, description: 'Collect 6 stickers to light up the dark!', position: { top: '75%', left: '45%' } },
        { id: 'dino', name: 'Dino Delta', stickersRequired: 10, levelRequired: 4, color: 'bg-orange-600', icon: Landmark, description: 'Master 10 quests to find dinosaur bones!', position: { top: '25%', left: '65%' } },
        { id: 'shore', name: 'Starlight Shore', stickersRequired: 15, levelRequired: 5, color: 'bg-blue-400', icon: Waves, description: '15 stories will guide you to the magic sea!', position: { top: '65%', left: '85%' } }
      ]
    },
    {
      id: 1,
      name: "Frozen Frontier",
      background: "bg-blue-900/40",
      biomes: [
        { id: 'ice_peaks', name: 'Ice Peaks', stickersRequired: 20, levelRequired: 6, color: 'bg-cyan-200', icon: Mountain, description: 'Frozen heights above the clouds.', position: { top: '30%', left: '20%' } },
        { id: 'yeti_pass', name: 'Yeti Pass', stickersRequired: 25, levelRequired: 7, color: 'bg-slate-300', icon: Footprints, description: 'Big tracks lead into the snow.', position: { top: '60%', left: '40%' } },
        { id: 'aurora_lake', name: 'Aurora Lake', stickersRequired: 30, levelRequired: 8, color: 'bg-indigo-400', icon: Sparkles, description: 'Water that glows at night.', position: { top: '40%', left: '60%' } },
        { id: 'glacier_gate', name: 'Glacier Gate', stickersRequired: 40, levelRequired: 9, color: 'bg-sky-100', icon: Snowflake, description: 'The door to the frozen world.', position: { top: '70%', left: '80%' } }
      ]
    },
    {
      id: 2,
      name: "Fire Realm",
      background: "bg-red-900/40",
      biomes: [
        { id: 'magma_mtn', name: 'Magma Mountain', stickersRequired: 50, levelRequired: 10, color: 'bg-red-600', icon: Flame, description: 'Hot lava and smoky air.', position: { top: '40%', left: '30%' } },
        { id: 'ember_canyon', name: 'Ember Canyon', stickersRequired: 60, levelRequired: 11, color: 'bg-orange-700', icon: Search, description: 'Find the heart of the fire.', position: { top: '65%', left: '70%' } }
      ]
    }
  ], []);

  const handleExcavate = async (biomeId: string) => {
    if (!childId) return;
    setLoading(biomeId);
    try {
      const res = await fetch("/api/excavate", { method: "POST", body: JSON.stringify({ childId, biomeId }) });
      const data = await res.json();
      if (data.success) {
        setLocalGems(prev => prev - 10);
        if (!discoveries.find(d => d.biome_id === biomeId)) setDiscoveries(prev => [...prev, data.discovery]);
      } else alert(data.error);
    } catch (err) { console.error(err); } finally { setLoading(null); }
  };

  const currentRegion = regions[activeRegion];
  const stickersEarned = stickers.length;
  const isRegionLocked = !isPremium && activeRegion > 0;

  return (
    <div className="mt-8 md:mt-20 bg-sky-950 rounded-[32px] md:rounded-[64px] p-4 md:p-12 shadow-2xl border-4 md:border-[12px] border-white relative overflow-hidden min-h-fit md:min-h-[850px] select-none transition-colors duration-1000">
      {/* Journal Modal */}
      {isJournalOpen && (
        <DiscoveryJournal 
          stickers={stickers} 
          name={name} 
          onClose={() => setIsJournalOpen(false)} 
        />
      )}

      {/* 1. LAYER: Magical Background per Region */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${currentRegion.background} opacity-60`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.3)_0%,transparent_100%)]" />
      
      {/* Header Info */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="flex items-center gap-4 text-white text-center lg:text-left">
          <div className="bg-orange-500 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg rotate-3 ring-4 ring-orange-300/30">
            <Compass className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black font-comic tracking-tight text-white drop-shadow-md">{currentRegion.name}</h2>
            <p className="text-sky-300 text-sm md:text-base font-bold">Region {activeRegion + 1} of {regions.length} • {stickersEarned} Stories Read</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <button 
            onClick={() => setIsJournalOpen(true)}
            className="bg-white/10 hover:bg-orange-500 hover:text-white backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 text-white flex items-center gap-2 md:gap-3 transition-all group active:scale-95"
          >
            < Book className="w-5 h-5 md:w-6 md:h-6 text-orange-400 group-hover:text-white transition-colors" />
            <span className="font-black uppercase text-[10px] md:text-xs tracking-wider">My Journal</span>
          </button>

          <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 text-white flex items-center gap-2 md:gap-3">
            <div className="bg-blue-500 p-1.5 md:p-2 rounded-lg"><Sparkles className="w-4 h-4 md:w-5 md:h-5" /></div>
            <div><p className="text-[8px] md:text-[10px] font-black uppercase text-sky-300 leading-none mb-1">Level</p><p className="text-xl md:text-2xl font-black font-comic leading-none">{explorerLevel}</p></div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 text-white flex items-center gap-2 md:gap-3">
            <div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg"><Gem className="w-4 h-4 md:w-5 md:h-5" /></div>
            <div><p className="text-[8px] md:text-[10px] font-black uppercase text-emerald-300 leading-none mb-1">Gems</p><p className="text-xl md:text-2xl font-black font-comic leading-none text-emerald-400">{localGems}</p></div>
          </div>
        </div>
      </div>

      {/* 2. LAYER: Horizontal Navigation */}
      <div className="relative z-20 flex justify-between items-center mb-6 px-2 md:px-4">
        <button 
          onClick={() => setActiveRegion(prev => Math.max(0, prev - 1))}
          disabled={activeRegion === 0}
          className="p-2 md:p-4 bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-full transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        
        <div className="flex gap-2 md:gap-3">
          {regions.map((r, i) => (
            <div 
              key={i} 
              className={`h-2 md:h-3 rounded-full transition-all duration-500 ${activeRegion === i ? 'bg-orange-400 w-6 md:w-10 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-white/20 w-2 md:w-3'} ${!isPremium && i > 0 && 'ring-2 ring-orange-500/50'}`} 
            />
          ))}
        </div>

        <button 
          onClick={() => setActiveRegion(prev => Math.min(regions.length - 1, prev + 1))}
          disabled={activeRegion === regions.length - 1}
          className="p-2 md:p-4 bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-full transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* 3. LAYER: The World Map Rendering */}
      <div className="relative w-full aspect-[4/5] md:aspect-[16/9] max-h-[600px] bg-white/5 rounded-[32px] md:rounded-[48px] border-4 border-white/10 overflow-hidden shadow-inner">
        
        {/* Region Lock Overlay */}
        {isRegionLocked && (
          <div className="absolute inset-0 z-40 bg-sky-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 md:p-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-orange-500 rounded-2xl md:rounded-[32px] flex items-center justify-center mb-4 md:mb-6 shadow-2xl rotate-3">
              <Crown className="w-8 h-8 md:w-12 md:h-12 text-white animate-bounce" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white font-comic mb-2 md:mb-4">Legendary Region!</h3>
            <p className="text-sky-200 text-sm md:text-xl font-bold max-w-md mb-6 md:mb-8">
              Only Legendary Explorers can travel to the {currentRegion.name}. Upgrade to unlock the whole world!
            </p>
            <Link 
              href="/dashboard/upgrade"
              className="px-6 md:px-10 py-3 md:py-5 bg-orange-500 text-white font-black text-lg md:text-2xl rounded-xl md:rounded-2xl shadow-xl border-b-4 md:border-b-8 border-orange-700 hover:scale-105 active:scale-95 active:border-b-0 transition-all"
            >
              Become a Legend 👑
            </Link>
          </div>
        )}

        {/* Animated Trails */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path 
            d="M 150 330 Q 250 270 350 210 T 450 450 T 650 150 T 850 390" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeOpacity="0.1"
            strokeDasharray="10 10"
            strokeLinecap="round"
            className="md:stroke-[4px]"
          />
        </svg>

        {/* Render Biomes for Active Region */}
        {currentRegion.biomes.map((biome) => {
          const isUnlocked = explorerLevel >= biome.levelRequired;
          const isNext = explorerLevel + 1 === biome.levelRequired;
          const discovery = discoveries.find(d => d.biome_id === biome.id);
          
          return (
            <div 
              key={biome.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{ top: biome.position.top, left: biome.position.left }}
            >
              <div className="relative flex flex-col items-center">
                {/* Discovery Artifact Float */}
                {discovery && (
                  <div className="absolute -top-12 md:-top-20 z-20 animate-float">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white p-0.5 md:p-1 shadow-2xl border-2 md:border-4 border-emerald-400 rotate-6 overflow-hidden transform hover:scale-125 transition-all">
                      <img src={discovery.image_url} alt={discovery.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Biome Circle */}
                <div 
                  className={`
                    w-16 h-16 md:w-36 md:h-36 rounded-full border-4 md:border-[8px] transition-all duration-700 flex items-center justify-center relative
                    ${isUnlocked 
                      ? `${biome.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] md:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 cursor-pointer` 
                      : isNext 
                        ? 'bg-sky-950 border-sky-400/30 border-dashed animate-pulse cursor-help' 
                        : 'bg-slate-900 border-sky-900/50 grayscale opacity-40'
                    }
                  `}
                >
                  {isUnlocked ? (
                    <div className="text-white flex flex-col items-center animate-in zoom-in duration-500">
                      <biome.icon className="w-8 h-8 md:w-14 md:h-14" />
                    </div>
                  ) : isNext ? (
                    <div className="text-sky-400 flex flex-col items-center">
                      <Search className="w-6 h-6 md:w-10 md:h-10 opacity-50" />
                      <span className="text-[6px] md:text-[8px] font-black mt-0.5 md:mt-1">LOCKED</span>
                    </div>
                  ) : (
                    <Lock className="w-6 h-6 md:w-10 md:h-10 text-sky-900" />
                  )}

                  {!isUnlocked && <Cloud className="absolute w-full h-full text-white opacity-5 scale-150" />}
                </div>

                {/* Name Label or Sticker Progress */}
                <div className={`
                  mt-2 md:mt-4 px-3 md:px-5 py-1 md:py-2 rounded-full font-black text-[8px] md:text-xs uppercase tracking-widest transition-all shadow-lg border-2
                  ${isUnlocked ? 'bg-white text-sky-900 border-white' : 'bg-sky-950 text-sky-500 border-sky-800'}
                `}>
                  {isUnlocked 
                    ? biome.name 
                    : isNext 
                      ? `${stickersEarned}/${biome.stickersRequired}` 
                      : '???'
                  }
                </div>

                {/* Tooltip Description - Hidden on small mobile or repositioned if needed */}
                <div className="hidden md:block absolute top-full mt-12 w-48 p-4 bg-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 text-center scale-90 group-hover:scale-100 border-2 border-sky-100">
                  <p className="text-sky-900 font-black text-[10px] uppercase mb-1">{biome.name}</p>
                  <p className="text-slate-600 font-bold text-xs leading-tight">{biome.description}</p>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                </div>

                {/* Excavation Button */}
                {isUnlocked && biome.id !== 'home' && !discovery && (
                  <button 
                    onClick={() => handleExcavate(biome.id)}
                    disabled={loading !== null || localGems < 10}
                    className="mt-2 md:mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[7px] md:text-[10px] font-black flex items-center gap-1 md:gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {loading === biome.id ? <Loader2 className="w-2 h-2 md:w-3 md:h-3 animate-spin" /> : <Gem className="w-2 h-2 md:w-3 md:h-3" />}
                    <span className="hidden xs:inline">EXCAVATE</span> (10 G)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
        <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center">
          <h4 className="text-white font-black text-xs md:text-sm uppercase mb-1">Discover</h4>
          <p className="text-sky-300 text-[9px] md:text-[10px] font-bold">Read stories to reveal new zones. Every sticker counts!</p>
        </div>
        <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center">
          <h4 className="text-white font-black text-xs md:text-sm uppercase mb-1">Mastery</h4>
          <p className="text-sky-300 text-[9px] md:text-[10px] font-bold">Collect magic words to become a Legend Explorer.</p>
        </div>
        <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center">
          <h4 className="text-white font-black text-xs md:text-sm uppercase mb-1">Treasure</h4>
          <p className="text-sky-300 text-[9px] md:text-[10px] font-bold">Spend gems to dig for rare artifacts found in the story.</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-15px) rotate(10deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// Icons
function Home(props: any) { return <Landmark {...props} /> }
function Trees(props: any) { return <MapIcon {...props} /> }
function Waves(props: any) { return <LocateFixed {...props} /> }
