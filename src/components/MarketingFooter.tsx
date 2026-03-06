"use client";

import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="bg-sky-950 py-16 md:py-24 px-6 md:px-16 text-white text-center md:text-left overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12 pointer-events-none hidden sm:block">
        <span className="text-[200px] md:text-[300px]">🖋️</span>
      </div>
      <div className="max-w-7xl mx-auto relative z-10 grid sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
        <div className="sm:col-span-2">
          <h3 className="text-3xl md:text-4xl font-black font-comic mb-6 uppercase">QuestQuill</h3>
          <p className="text-sky-200/60 font-bold text-lg md:text-xl max-w-sm mb-8 leading-relaxed mx-auto md:mx-0">
            Crafting magical reading journeys for the next generation of explorers and dreamers.
          </p>
          <div className="flex gap-3 justify-center md:justify-start">
            {[
              "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?auto=format&fit=crop&q=80&w=150",
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150"
            ].map((src, i) => (
              <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl overflow-hidden hover:bg-white/20 transition-all hover:scale-110 border border-white/10 shrink-0">
                <img src={src} alt="Community Member" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-black uppercase tracking-widest text-sky-400 text-xs md:text-sm mb-6">Product</h5>
          <ul className="space-y-4 font-bold text-sky-200/80 text-sm md:text-base">
            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/classroom" className="hover:text-white transition-colors">Classroom</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-black uppercase tracking-widest text-sky-400 text-xs md:text-sm mb-6">Company</h5>
          <ul className="space-y-4 font-bold text-sky-200/80 text-sm md:text-base">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 border-t border-white/10 text-sky-200/40 font-bold text-[10px] md:text-xs text-center md:text-left">
        © 2026 QuestQuill Adventure Studios. All rights reserved.
      </div>
    </footer>
  );
}
