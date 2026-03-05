"use client";

import Link from "next/link";
import { Book, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { deleteStory } from "@/app/dashboard/actions";
import { useState } from "react";

interface Story {
  id: string;
  title: string;
  created_at: string;
  content_json: any;
}

export default function StoryLibrary({ stories, name }: { stories: Story[], name: string }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, id: string, title: string) {
    e.preventDefault(); // Stop link navigation
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete the story "${title}"?`)) return;
    
    setIsDeleting(id);
    await deleteStory(id);
    setIsDeleting(null);
  }

  return (
    <div className="mt-8 md:mt-20">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="bg-orange-100 p-2 md:p-3 rounded-xl md:rounded-2xl shrink-0">
          <Book className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-sky-900 font-comic uppercase tracking-tight">{name}'s Bookshelf</h2>
          <p className="text-sky-600/60 font-bold text-sm md:text-lg">Re-read your favorite adventures!</p>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="bg-white/30 backdrop-blur-sm rounded-[32px] md:rounded-[40px] p-8 md:p-16 text-center border-2 md:border-4 border-dashed border-sky-100">
          <p className="text-sky-400 font-bold text-base md:text-xl italic text-comic">No books on the shelf yet. Start a new quest!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stories.map((story) => {
            const firstPageImage = story.content_json?.pages?.[0]?.imageUrl;
            const date = new Date(story.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });
            const deleting = isDeleting === story.id;

            return (
              <Link 
                key={story.id} 
                href={`/quest/${story.id}`}
                className={`group bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl border-4 border-white hover:border-orange-200 transition-all hover:scale-[1.02] active:scale-95 flex flex-col h-full relative ${deleting && 'opacity-50 grayscale pointer-events-none'}`}
              >
                {/* Delete Button */}
                <button 
                  onClick={(e) => handleDelete(e, story.id, story.title)}
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 md:p-3 bg-red-50 text-red-400 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Cover Image */}
                <div className="aspect-[4/3] bg-sky-50 relative overflow-hidden">
                  {firstPageImage ? (
                    <img 
                      src={firstPageImage} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-sky-200">
                      <Book className="w-12 h-12 md:w-16 md:h-16 mb-2 opacity-20" />
                      <span className="font-bold text-xs md:text-sm">No cover yet</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Story Details */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 md:gap-2 text-sky-400 font-bold text-[10px] md:text-xs mb-1 md:mb-2 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-sky-900 font-comic mb-2 md:mb-4 line-clamp-2 leading-tight">
                    {story.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between text-orange-500 font-black">
                    <span className="text-xs md:text-sm">Read Again</span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
