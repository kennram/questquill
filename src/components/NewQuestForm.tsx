"use client";

import { useState } from "react";
import AdventureView from "./AdventureView";

interface Child {
  id: string;
  name: string;
  interests: string[];
}

export default function NewQuestForm({ children }: { children: Child[] }) {
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || "");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<any>(null);

  const generateStory = async () => {
    setLoading(true);
    const child = children.find((c) => c.id === selectedChildId);
    
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        body: JSON.stringify({
          name: child?.name || "Explorer",
          interests: interests.split(",").map((i) => i.trim()),
        }),
      });
      
      const data = await res.json();
      setStory(data);
    } catch (error) {
      console.error("Failed to generate story", error);
    } finally {
      setLoading(false);
    }
  };

  if (story) {
    return <AdventureView story={story} />;
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-sky-100 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black text-sky-600 mb-6">Create a New Quest</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sky-700 font-bold mb-2">Who is this adventure for?</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full p-4 bg-sky-50 border-2 border-sky-100 rounded-xl focus:border-sky-400 focus:outline-none"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
            {children.length === 0 && <option value="">No children added yet</option>}
          </select>
        </div>

        <div>
          <label className="block text-sky-700 font-bold mb-2">What are they interested in today?</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Dragons, Space, Dinosaurs"
            className="w-full p-4 bg-sky-50 border-2 border-sky-100 rounded-xl focus:border-sky-400 focus:outline-none"
          />
          <p className="mt-2 text-sm text-sky-400 font-medium">Separate interests with commas</p>
        </div>

        <button
          onClick={generateStory}
          disabled={loading || !selectedChildId}
          className="w-full py-5 bg-sky-500 text-white font-black text-2xl rounded-2xl hover:bg-sky-600 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-bounce">🎨</span> AI is painting your story...
            </span>
          ) : (
            "Generate Story ✨"
          )}
        </button>
      </div>
    </div>
  );
}
