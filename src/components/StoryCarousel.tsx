"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronRight, BookOpen } from "lucide-react";

const FEATURED_STORIES = [
  {
    title: "The Dino's First Flight",
    level: "Level 2 Reading Adventure",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=800",
    color: "from-sky-900/60"
  },
  {
    title: "Robots in the Magic Forest",
    level: "Level 1 Beginner Quest",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800",
    color: "from-purple-900/60"
  },
  {
    title: "Deep Sea Discovery",
    level: "Level 3 Advanced Exploration",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800",
    color: "from-blue-900/60"
  },
  {
    title: "The Squirrel Space Program",
    level: "Level 2 Intermediate Mission",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    color: "from-indigo-900/60"
  }
];

export default function StoryCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FEATURED_STORIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = FEATURED_STORIES[index];

  return (
    <div className="relative z-10 bg-white p-4 rounded-[48px] shadow-2xl border-8 border-white rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
      <div className="aspect-[4/5] bg-sky-50 rounded-[40px] overflow-hidden relative">
        {/* Story Image with Cross-fade Effect (Simulated via simple key) */}
        <img 
          key={current.title}
          src={current.image} 
          alt={current.title} 
          className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" 
        />
        
        {/* Overlay Info */}
        <div className={`absolute inset-0 bg-gradient-to-t ${current.color} to-transparent flex flex-col justify-end p-8 text-white text-left transition-colors duration-1000`}>
          <div className="flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/30 animate-in slide-in-from-left duration-700">
            <Sparkles className="w-3 h-3 text-orange-300 fill-orange-300" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">AI Generated Story</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black font-comic mb-2 leading-none animate-in slide-in-from-bottom-4 duration-700">{current.title}</h3>
          <p className="font-bold opacity-90 text-sm md:text-lg animate-in slide-in-from-bottom-2 duration-700 delay-100">{current.level}</p>
        </div>

        {/* Progress Indicators */}
        <div className="absolute top-8 left-8 right-8 flex gap-2 z-20">
          {FEATURED_STORIES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i === index ? 'bg-white shadow-lg' : 'bg-white/30'}`} 
            />
          ))}
        </div>
      </div>

      {/* Interactive Badge */}
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-2xl shadow-xl border-4 border-white rotate-12 group-hover:rotate-0 transition-all duration-500 z-30">
        <BookOpen className="w-8 h-8" />
      </div>
    </div>
  );
}
