"use client";

import { X, Book, Sparkles, Trophy, Star } from "lucide-react";

interface Sticker {
  id: string;
  image_url: string;
  name: string;
}

export default function DiscoveryJournal({ 
  stickers, 
  name, 
  onClose 
}: { 
  stickers: Sticker[], 
  name: string,
  onClose: () => void
}) {
  const stickerList = stickers || [];

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
                <Sparkles className="w-3 h-3 md:w-5 md:h-5" /> {stickerList.length} Found
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
        <div className="flex-grow overflow-y-auto p-4 md:p-12 custom-scrollbar">
          {stickerList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 opacity-40">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-sky-100 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 md:w-16 md:h-16 text-sky-300" />
              </div>
              <p className="text-lg md:text-2xl font-black text-sky-900 max-w-xs md:max-w-sm font-comic">
                Your journal is waiting for your first adventure!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
              {stickerList.map((sticker, i) => (
                <div 
                  key={sticker.id}
                  className="bg-white rounded-3xl md:rounded-[40px] p-4 md:p-8 shadow-sm border-2 border-orange-50 flex items-center gap-4 md:gap-6 relative group hover:shadow-xl hover:border-orange-200 transition-all hover:-translate-y-1"
                >
                  {/* Sticker Visual */}
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-sky-50 p-1 border-2 md:border-4 border-white shadow-md flex-shrink-0 overflow-hidden rotate-[-2deg] group-hover:rotate-3 transition-transform">
                    <img 
                      src={sticker.image_url} 
                      alt={sticker.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Discovery Text */}
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-1.5 md:gap-2 text-orange-400">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-orange-400" />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Discovery #{i+1}</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-sky-900 font-comic leading-tight">{sticker.name}</h3>
                    <p className="text-sky-600/60 text-[10px] md:text-sm font-bold italic leading-relaxed">
                      "A magical milestone!"
                    </p>
                  </div>

                  {/* Decorative tape effect */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-4 md:h-6 bg-orange-200/30 backdrop-blur-sm -rotate-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Tip */}
        <div className="p-4 md:p-8 bg-sky-50/50 border-t-2 border-white text-center">
          <p className="text-sky-400 text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
            Finish stories to add new chapters!
          </p>
        </div>
      </div>
    </div>
  );
}
