"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Sparkles, Loader2, Book, Star, Zap, Users, CheckCircle2, Target, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Child {
  id: string;
  name: string;
  interests: string[];
  avatar_url?: string;
  explorer_level?: number;
  reading_level?: number;
  gems?: number;
  completed_missions?: string[];
  last_completed_mission?: string;
  assigned_missions?: string[];
}

interface QuestWizardProps {
  children: Child[];
  onClose: () => void;
  selectedChildId?: string | null;
  classMission?: string | null;
  classMissions?: string[];
  role?: "parent" | "teacher" | "student";
  initialMission?: string | null;
}

export default function QuestWizard({ 
  children, 
  onClose, 
  selectedChildId,
  classMission,
  classMissions = [],
  role = "parent",
  initialMission = null
}: QuestWizardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string, limitReached?: boolean } | null>(null);
  
  const initialChild = useMemo(() => 
    children.find(c => c.id === selectedChildId) || children[0],
    [children, selectedChildId]
  );

  const [formData, setFormData] = useState({
    childId: initialChild?.id || "",
    interests: initialMission || "",
    level: initialChild?.reading_level || 1,
    mode: "classic" as "classic" | "interactive"
  });

  const [selectedMission, setSelectedMission] = useState<string | null>(initialMission);

  const activeChild = useMemo(() => 
    children.find(c => c.id === formData.childId), 
    [children, formData.childId]
  );

  const allCompleted = useMemo(() => {
    if (!activeChild) return [];
    return Array.from(new Set([
      ...(activeChild.completed_missions || []),
      ...(activeChild.last_completed_mission ? [activeChild.last_completed_mission] : [])
    ])).map(m => m.trim().toLowerCase());
  }, [activeChild]);

  const combinedMissions = useMemo(() => {
    const rawMissions = Array.from(new Set([
      ...classMissions, 
      ...(classMission ? [classMission] : []),
      ...(role !== "teacher" ? (activeChild?.assigned_missions || []) : [])
    ]));
    
    return rawMissions.filter(m => !allCompleted.includes(m.trim().toLowerCase()));
  }, [classMissions, classMission, role, activeChild, allCompleted]);

  // Handle child selection change - update level and auto-select mission
  // Using a single effect to handle synchronization when the child changes
  useEffect(() => {
    if (!activeChild) return;

    setFormData(prev => {
      // Only update if the values are actually different to avoid unnecessary cycles
      const newLevel = activeChild.reading_level || 1;
      const shouldUpdateLevel = prev.level !== newLevel;
      
      let nextInterests = prev.interests;
      let nextMission = selectedMission;

      // If no interests/mission selected, try to auto-select from available ones
      if (!prev.interests && combinedMissions.length > 0 && !selectedMission) {
        nextInterests = combinedMissions[0];
        nextMission = combinedMissions[0];
      }

      if (shouldUpdateLevel || nextInterests !== prev.interests) {
        if (nextMission !== selectedMission) setSelectedMission(nextMission);
        return { ...prev, level: newLevel, interests: nextInterests };
      }
      
      return prev;
    });
  }, [activeChild, combinedMissions, selectedMission]);

  const label = role === "teacher" ? "Student" : "Explorer";
  const brandColor = role === "teacher" ? "bg-purple-600" : "bg-sky-500";

  const handleMissionSelect = (mission: string) => {
    setSelectedMission(mission);
    setFormData(prev => ({ ...prev, interests: mission }));
  };

  const handleGenerate = async () => {
    if (!formData.childId) {
      setError({ message: "Please select an explorer first!" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: formData.childId,
          name: activeChild?.name || label,
          interests: formData.interests.split(",").map(i => i.trim()).filter(i => i !== ""),
          classMission: selectedMission || classMission, 
          level: formData.level,
          mode: formData.mode
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403 && errorData.limitReached) {
          setError({ message: errorData.message, limitReached: true });
        } else {
          setError({ message: errorData.error || `The magic mirror is cloudy (Error ${res.status}).` });
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.id) router.push(`/quest/${data.id}`);
    } catch (err: unknown) {
      setError({ message: "The magic failed to cast. Check your connection!" });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sky-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border-4 border-white relative animate-in zoom-in duration-300">
        
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="w-32 h-32 bg-sky-50 rounded-[48px] flex items-center justify-center shadow-inner border-4 border-white">
              <Loader2 className="w-16 h-16 text-sky-500 animate-spin" />
            </div>
            <h2 className="text-4xl font-black text-sky-950 mt-8 mb-4 font-comic">Casting Spells...</h2>
          </div>
        )}

        <div className={`${brandColor} p-8 flex justify-between items-center text-white`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-black font-comic tracking-tight">New Quest</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/10 rounded-full transition-colors"><X className="w-8 h-8" /></button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className={`p-6 rounded-[32px] border-4 ${error.limitReached ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-100"}`}>
              <p className="font-black text-red-600">{error.message}</p>
            </div>
          )}

          {/* MISSION SELECTION */}
          {combinedMissions.length > 0 && (
            <div className="space-y-4">
              <label className="text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60 flex items-center gap-2">
                <Target className="w-4 h-4" /> Active Quests
              </label>
              <div className="grid grid-cols-1 gap-2">
                {combinedMissions.map((m, i) => {
                  const isSelected = selectedMission === m;
                  const isFamily = activeChild?.assigned_missions?.includes(m);
                  return (
                    <button
                      key={i}
                      onClick={() => handleMissionSelect(m)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${isSelected ? (isFamily ? "bg-orange-100 border-orange-500 ring-4 ring-orange-50" : "bg-purple-100 border-purple-500 ring-4 ring-purple-50") : "bg-sky-50 border-sky-100 hover:border-sky-300"}`}
                    >
                      <div className="flex flex-col">
                        <span className={`font-bold ${isSelected ? (isFamily ? "text-orange-950" : "text-purple-950") : "text-sky-900"}`}>&quot;{m}&quot;</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isFamily ? "text-orange-400" : "text-purple-400"}`}>
                          {isFamily ? "Family Quest" : "Class Mission"}
                        </span>
                      </div>
                      {isSelected ? <CheckCircle2 className={`w-5 h-5 ${isFamily ? "text-orange-600" : "text-purple-600"}`} /> : <ChevronRight className="w-4 h-4 text-sky-300 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Who is exploring */}
          <div className="space-y-3">
            <label className="text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60 flex items-center gap-2">
              <Users className="w-4 h-4" /> {label}
            </label>
            <select
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
              className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-sky-400 outline-none text-sky-950 font-black text-2xl"
            >
              {children.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Step 2: Interests */}
          <div className="space-y-3">
            <label className="text-sky-700 font-black uppercase tracking-widest text-xs ml-4 opacity-60 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Quest Theme
            </label>
            <input
              type="text"
              placeholder="e.g. Astronaut cats, magic forests..."
              value={formData.interests}
              onChange={(e) => { setFormData({ ...formData, interests: e.target.value }); setSelectedMission(null); }}
              className="w-full p-6 bg-sky-50 border-4 border-sky-100 rounded-[32px] focus:border-orange-400 outline-none text-sky-950 font-bold text-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setFormData({ ...formData, mode: "classic" })} className={`p-6 rounded-[32px] border-4 transition-all flex flex-col items-center gap-2 ${formData.mode === "classic" ? "border-sky-500 bg-sky-50 text-sky-600" : "border-sky-50 bg-white text-sky-200"}`}>
              <Book className="w-8 h-8" />
              <span className="font-black text-xs uppercase">Classic</span>
            </button>
            <button onClick={() => setFormData({ ...formData, mode: "interactive" })} className={`p-6 rounded-[32px] border-4 transition-all flex flex-col items-center gap-2 ${formData.mode === "interactive" ? "border-purple-500 bg-purple-50 text-purple-600" : "border-sky-50 bg-white text-sky-200"}`}>
              <Sparkles className="w-8 h-8" />
              <span className="font-black text-xs uppercase">Interactive</span>
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !formData.childId}
            className="w-full py-6 bg-orange-500 text-white font-black text-3xl rounded-[32px] shadow-2xl border-b-[10px] border-orange-700 active:translate-y-2 active:border-b-0 disabled:opacity-50"
          >
            Create Magic!
          </button>
        </div>
      </div>
    </div>
  );
}
