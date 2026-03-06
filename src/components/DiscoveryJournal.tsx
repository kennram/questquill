"use client";

import { X, Book, Sparkles, Trophy, Star, Gem, Anchor } from "lucide-react";

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

export default function DiscoveryJournal({ 
  stickers, 
  discoveries = [],
  name, 
  onClose 
}: { 
  stickers: Sticker[], 
  discoveries?: Discovery[],
  name: string,
  onClose: () => void
}) {
  const stickerList = stickers || [];
  const discoveryList = discoveries || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10 bg-sky-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#fff9f2] w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-[32px] md:rounded-[64px] shadow-2xl border-4 md:border-[12px] border-white relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Journal Header */}
        <div className="p-4 md:p-10 border-b-2 md:border-b-4 border-orange-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="bg-orange-500 p-2 md:p-4 rounded-xl md:rounded-3xl shadow-lg -rotate-2">
              <Book className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-5xl font-black text-sky-900 font-comic tracking-tight leading-none mb-1 md:mb-0">{name}'s Journal</h2>
              <p className="text-[10px] md:text-xl text-orange-600/60 font-bold uppercase tracking-widest flex items-center gap-1 md:gap-2">
                <Sparkles className="w-3 h-3 md:w-5 md:h-5" /> {stickerList.length + discoveryList.length} Found
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:p-4 bg-sky-50 text-sky-400 rounded-xl md:rounded-3xl hover:bg-orange-500 hover:text-white transition-all hover:rotate-90 active:scale-90"
          >
            <X className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        </div>

        {/* Journal Pages (Scrollable Content) */}
        <div className="flex-grow overflow-y-auto p-4 md:p-12 custom-scrollbar space-y-12">
          
          {/* SECTION 1: STORY STICKERS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-orange-100 pb-2">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              <h3 className="text-xl md:text-2xl font-black text-sky-900 font-comic">Adventure Stickers</h3>
            </div>
            
            {stickerList.length === 0 ? (
              <div className="bg-white/50 rounded-3xl p-8 text-center border-2 border-dashed border-orange-100 opacity-60">
                <p className="text-sky-900 font-bold font-comic">No adventure stickers yet!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                {stickerList.map((sticker, i) => (
                  <div 
                    key={sticker.id}
                    className="bg-white rounded-3xl md:rounded-[40px] p-4 md:p-8 shadow-sm border-2 border-orange-50 flex items-center gap-4 md:gap-6 relative group hover:shadow-xl hover:border-orange-200 transition-all hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-sky-50 p-1 border-2 md:border-4 border-white shadow-md flex-shrink-0 overflow-hidden rotate-[-2deg] group-hover:rotate-3 transition-transform flex items-center justify-center">
                      <img 
                        src={sticker.image_url} 
                        alt={sticker.name} 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          const keywords = `${sticker.name.split(' ').join(',')},toy,sticker`;
                          (e.target as HTMLImageElement).src = `https://loremflickr.com/512/512/${encodeURIComponent(keywords)}?lock=${i}`;
                        }}
                      />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-1.5 md:gap-2 text-orange-400">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-orange-400" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Sticker #{i+1}</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-sky-900 font-comic leading-tight">{sticker.name}</h3>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-4 md:h-6 bg-orange-200/30 backdrop-blur-sm -rotate-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: EXCAVATED TREASURES */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2">
              <Gem className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              <h3 className="text-xl md:text-2xl font-black text-sky-900 font-comic">Ancient Treasures</h3>
            </div>

            {discoveryList.length === 0 ? (
              <div className="bg-white/50 rounded-3xl p-8 text-center border-2 border-dashed border-emerald-100 opacity-60">
                <p className="text-sky-900 font-bold font-comic">Use your gems to excavate treasures on the map!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                {discoveryList.map((treasure, i) => (
                  <div 
                    key={treasure.id}
                    className="bg-white rounded-3xl md:rounded-[40px] p-4 md:p-8 shadow-sm border-2 border-emerald-50 flex items-center gap-4 md:gap-6 relative group hover:shadow-xl hover:border-emerald-200 transition-all hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-orange-50 p-1 border-2 md:border-4 border-white shadow-md flex-shrink-0 overflow-hidden rotate-[3deg] group-hover:rotate-[-2deg] transition-transform flex items-center justify-center">
                      <img 
                        src={treasure.image_url} 
                        alt={treasure.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const seed = Math.floor(Math.random() * 10000);
                          const keywords = `${treasure.name.split(' ').join(',')},magic,treasure`;
                          (e.target as HTMLImageElement).src = `https://loremflickr.com/512/512/${encodeURIComponent(keywords)}?lock=${seed}`;
                        }}
                      />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center gap-1.5 md:gap-2 text-emerald-500">
                        <Gem className="w-3 h-3 md:w-4 md:h-4 fill-emerald-500" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Treasure #{i+1}</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-sky-900 font-comic leading-tight">{treasure.name}</h3>
                      <div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full w-fit">
                        <Anchor className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="text-[7px] font-black text-emerald-700 uppercase tracking-tighter">{treasure.biome_id} Realm</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-4 md:h-6 bg-emerald-200/30 backdrop-blur-sm rotate-1" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Tip */}
        <div className="p-4 md:p-8 bg-sky-50/50 border-t-2 border-white text-center">
          <p className="text-sky-400 text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
            Continue your quest to uncover more secrets!
          </p>
        </div>
      </div>
    </div>
  );
}
