"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Sparkles, User, BookOpen, Settings, Check, Map as MapIcon, ChevronDown, UserCircle, Crown, BarChart3, Users, ListPlus, X, ChevronRight, Scroll, LogOut, MoreHorizontal, LayoutGrid, Layout, Gem, Target, History, Home, Trash2, Loader2 } from "lucide-react";
import QuestWizard from "@/components/QuestWizard";
import AdventureView from "@/components/AdventureView";
import AddChildModal from "@/components/AddChildModal";
import EditChildModal from "@/components/EditChildModal";
import BulkAddModal from "@/components/BulkAddModal";
import StoryLibrary from "@/components/StoryLibrary";
import WordBank from "@/components/WordBank";
import AdventureMap from "@/components/AdventureMap";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import Link from "next/link";
import { addIndividualMission, deleteIndividualMission } from "@/app/dashboard/actions";

interface Child {
  id: string;
  name: string;
  interests: string[];
  avatar_url?: string;
  explorer_level?: number;
  reading_level?: number;
  gems?: number;
  last_completed_mission?: string;
  completed_missions?: string[];
  assigned_missions?: string[];
}

interface Story {
  id: string;
  child_id: string;
  title: string;
  created_at: string;
  content_json: any;
}

interface Sticker {
  id: string;
  child_id: string;
  image_url: string;
  name: string;
}

interface Vocabulary {
  id: string;
  child_id: string;
  word: string;
  definition: string;
  sentence_context: string;
  created_at: string;
}

interface Discovery {
  id: string;
  child_id: string;
  biome_id: string;
  discovery_type: string;
  name: string;
  image_url: string;
}

interface ChallengeLog {
  id: string;
  child_id: string;
  story_id: string;
  challenge_type: string;
  is_success: boolean;
  attempts: number;
  created_at: string;
}

export default function DashboardClient({ 
  children, 
  stories, 
  stickers,
  vocabulary,
  discoveries,
  challengeLogs = [],
  classMission = null,
  classMissions = [],
  classCode = null,
  role = "parent",
  isPremium = false
}: { 
  children: Child[], 
  stories: Story[],
  stickers: Sticker[],
  vocabulary: Vocabulary[],
  discoveries: Discovery[],
  challengeLogs?: ChallengeLog[],
  classMission?: string | null,
  classMissions?: string[],
  classCode?: string | null,
  role?: "parent" | "teacher" | "student",
  isPremium?: boolean
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlChildId = searchParams.get("childId");
  const checkoutSuccess = searchParams.get("success");
  const checkoutCanceled = searchParams.get("canceled");

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    (role === "student" && children.length === 1) ? children[0].id : null
  );
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"world" | "words" | "stories" | "analytics" | "missions">("world");

  const [locallyCompletedMissions, setLocallyCompletedMissions] = useState<string[]>([]);
  const [familyMissionInput, setFamilyMissionInput] = useState<{ [key: string]: string }>({});
  const [isAddingFamilyMission, setIsAddingFamilyMission] = useState<{ [key: string]: boolean }>({});
  const [preSelectedMission, setPreSelectedMission] = useState<string | null>(null);

  // Auto-select child if there's only one (Student Mode)
  useEffect(() => {
    if (role === "student" && children.length === 1 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [role, children, selectedChildId]);

  // Security: Prevent students from leaving their profile
  const handleDeselectChild = () => {
    if (role === "student") return;
    setSelectedChildId(null);
    setActiveTab("world");
  };

  // Handle mission completion masking
  const handleMissionFinish = (mission: string) => {
    setLocallyCompletedMissions(prev => [...prev, mission]);
  };

  // Family Mission Handlers
  const handleAddFamilyMission = async (childId: string) => {
    const input = familyMissionInput[childId]?.trim();
    if (!childId || !input) return;
    
    setIsAddingFamilyMission(prev => ({ ...prev, [childId]: true }));
    try {
      const res = await addIndividualMission(childId, input);
      if (res.success) {
        setFamilyMissionInput(prev => ({ ...prev, [childId]: "" }));
        router.refresh();
      }
    } catch (err) {} finally {
      setIsAddingFamilyMission(prev => ({ ...prev, [childId]: false }));
    }
  };

  const handleDeleteFamilyMission = async (childId: string, text: string) => {
    if (!childId) return;
    try {
      const res = await deleteIndividualMission(childId, text);
      if (res.success) router.refresh();
    } catch (err) {}
  };

  // Sync selectedChildId with URL param if it exists
  useEffect(() => {
    if (urlChildId && children.some(c => c.id === urlChildId) && role !== "student") {
      setSelectedChildId(urlChildId);
    }
  }, [urlChildId, children, role]);

  // --- FILTERED DATA ---
  const filteredStories = useMemo(() => {
    if (!selectedChildId) return [];
    return stories.filter(s => s.child_id === selectedChildId);
  }, [stories, selectedChildId]);

  const filteredStickers = useMemo(() => {
    if (!selectedChildId) return [];
    return stickers.filter(s => s.child_id === selectedChildId);
  }, [stickers, selectedChildId]);

  const filteredVocab = useMemo(() => {
    if (!selectedChildId) return [];
    return vocabulary.filter(v => v.child_id === selectedChildId);
  }, [vocabulary, selectedChildId]);

  const filteredDiscoveries = useMemo(() => {
    if (!selectedChildId) return [];
    return (discoveries || []).filter(d => d.child_id === selectedChildId);
  }, [discoveries, selectedChildId]);

  const activeChild = useMemo(() => {
    return children.find(c => c.id === selectedChildId);
  }, [children, selectedChildId]);

  const activeChildName = activeChild?.name || "Explorer";

  // --- MISSION ANALYSIS ---
  const missionStats = useMemo(() => {
    if (!activeChild) return { active: [], mastered: [] };
    
    // 1. Gather all completions
    const dbCompleted = activeChild.completed_missions || [];
    const lastCompleted = activeChild.last_completed_mission ? [activeChild.last_completed_mission] : [];
    const allCompleted = Array.from(new Set([...dbCompleted, ...lastCompleted, ...locallyCompletedMissions])).map(m => m.trim().toLowerCase());

    // 2. Gather all available quests
    const availableClass = [...classMissions];
    if (classMission && !availableClass.includes(classMission)) availableClass.push(classMission);
    
    const availableFamily = activeChild.assigned_missions || [];

    // 3. Categorize
    const mastered: { text: string, type: 'class' | 'family' }[] = [];
    const active: { text: string, type: 'class' | 'family' }[] = [];

    availableClass.forEach(m => {
      if (allCompleted.includes(m.trim().toLowerCase())) mastered.push({ text: m, type: 'class' });
      else active.push({ text: m, type: 'class' });
    });

    availableFamily.forEach(m => {
      if (allCompleted.includes(m.trim().toLowerCase())) mastered.push({ text: m, type: 'family' });
      else active.push({ text: m, type: 'family' });
    });

    return { active, mastered };
  }, [classMissions, classMission, activeChild, locallyCompletedMissions]);

  const hasNewMissions = missionStats.active.length > 0;

  if (story) {
    return (
      <div className="min-h-screen bg-sky-50 p-4 md:p-8">
        <button 
          onClick={() => setStory(null)}
          className="mb-6 md:mb-8 text-sky-600 font-bold flex items-center gap-2 hover:underline transition-all hover:-translate-x-1"
        >
          ← Back to Map
        </button>
        <AdventureView 
          story={story} 
          classMission={classMission} 
          role={role} 
          onFinish={handleMissionFinish}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-sky-500/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="text-6xl md:text-8xl animate-bounce mb-6 text-shadow-lg">🎨</div>
          <h2 className="text-3xl md:text-4xl font-black font-comic">AI is painting your story...</h2>
        </div>
      )}

      {/* --- STATUS BANNERS --- */}
      {checkoutSuccess && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in slide-in-from-top-8 duration-500">
          <div className="bg-emerald-500 text-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-2xl border-4 border-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-white/20 p-1.5 md:p-2 rounded-xl shrink-0"><Sparkles className="w-5 h-5 md:w-8 md:h-8 animate-pulse" /></div>
              <p className="font-black text-sm md:text-lg">Legendary magic activated! ✨</p>
            </div>
            <button onClick={() => router.replace('/dashboard')} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-xl transition-colors"><X className="w-4 h-4 md:w-6 md:h-6" /></button>
          </div>
        </div>
      )}

      {/* --- MAGIC HEADER --- */}
      <div className={`transition-all duration-500 ${selectedChildId ? 'mb-6 md:mb-12' : 'py-4 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* LEFT: Contextual Identity */}
            <div className="flex items-center gap-3 md:gap-6 animate-in slide-in-from-left duration-500 w-full md:w-auto">
              {selectedChildId ? (
                <div className="flex items-center gap-3 md:gap-6">
                  {role !== "student" && (
                    <button 
                      onClick={handleDeselectChild}
                      className="p-2.5 md:p-4 bg-white text-sky-600 rounded-xl md:rounded-3xl shadow-xl hover:bg-sky-50 transition-all group border-2 md:border-4 border-white"
                    >
                      <ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  )}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[32px] bg-orange-100 border-2 md:border-4 border-white shadow-2xl overflow-hidden shrink-0">
                      {activeChild?.avatar_url ? (
                        <img src={activeChild.avatar_url} alt={activeChildName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-500"><UserCircle className="w-8 h-8 md:w-12 md:h-12" /></div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-black text-sky-950 font-comic leading-none mb-1">{activeChildName}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[7px] md:text-[10px] font-black bg-sky-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Lv {activeChild?.explorer_level || 1}</span>
                        <span className="text-[7px] md:text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
                          <Gem className="w-1.5 h-1.5 md:w-3 md:h-3" /> {activeChild?.gems || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-5xl font-black text-sky-950 font-comic tracking-tight uppercase leading-tight">
                    {role === "teacher" ? "Classroom Hub" : "Explorer Hub"}
                  </h1>
                  <p className="text-sky-600/60 font-bold text-xs md:text-lg">
                    {role === "teacher" ? "Pick a student or analyze progress! ✨" : "Who is adventure-ready? ✨"}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: Consolidated Actions */}
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
              
              {/* Quest Log Button */}
              {selectedChildId && (
                <button
                  onClick={() => setIsQuestLogOpen(true)}
                  className="relative p-3 md:p-4 bg-white text-purple-600 rounded-xl md:rounded-3xl shadow-xl hover:bg-purple-50 transition-all group border-2 md:border-4 border-white"
                  title="Quest Log"
                >
                  <Scroll className="w-5 h-5 md:w-8 md:h-8 group-hover:rotate-6 transition-transform" />
                  {hasNewMissions && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 md:w-6 md:h-6 bg-red-500 border-2 md:border-4 border-white rounded-full animate-bounce" />
                  )}
                </button>
              )}

              {/* Lobby Tools (Lobby only) */}
              {!selectedChildId && role !== "student" && (
                <div className="flex items-center gap-2 md:gap-4 bg-white/50 backdrop-blur-md p-1.5 md:p-2 rounded-2xl md:rounded-[32px] border-2 border-white shadow-xl">
                  <div className="flex items-center gap-1 bg-sky-100/50 p-1 rounded-full">
                    <button
                      onClick={() => setActiveTab("world")}
                      className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full font-black text-[10px] md:text-sm transition-all ${activeTab === 'world' ? 'bg-sky-500 text-white shadow-lg' : 'text-sky-600 hover:bg-sky-100'}`}
                    >
                      <LayoutGrid className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden xs:inline">{role === "teacher" ? "Students" : "Explorers"}</span>
                    </button>
                    {role === "parent" && (
                      <button
                        onClick={() => setActiveTab("missions")}
                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full font-black text-[10px] md:text-sm transition-all ${activeTab === 'missions' ? 'bg-orange-500 text-white shadow-lg' : 'text-orange-600 hover:bg-orange-100'}`}
                      >
                        <Target className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden xs:inline">Quests</span>
                      </button>
                    )}
                    {role === "teacher" && (
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full font-black text-[10px] md:text-sm transition-all ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-600 hover:bg-purple-100'}`}
                      >
                        <BarChart3 className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden xs:inline">Insights</span>
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsManageOpen(!isManageOpen)}
                      className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-3 bg-white text-sky-600 font-black rounded-full border-2 border-sky-100 hover:border-sky-300 transition-all text-[10px] md:text-sm ${isManageOpen ? 'bg-sky-50' : ''}`}
                    >
                      <Settings className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Manage</span>
                    </button>
                    
                    {isManageOpen && (
                      <>
                        <div className="fixed inset-0 z-[70]" onClick={() => setIsManageOpen(false)} />
                        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-2xl md:rounded-[24px] shadow-2xl border-4 border-sky-50 p-1.5 md:p-2 z-[80] animate-in slide-in-from-top-2">
                          <button
                            onClick={() => { setIsAddChildOpen(true); setIsManageOpen(false); }}
                            className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-sky-50 rounded-xl text-sky-900 font-bold transition-colors text-left text-xs md:text-base"
                          >
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-500" /> Add Student
                          </button>
                          {role === "teacher" && (
                            <button
                              onClick={() => { setIsBulkAddOpen(true); setIsManageOpen(false); }}
                              className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-sky-50 rounded-xl text-sky-900 font-bold transition-colors text-left text-xs md:text-base"
                            >
                              <ListPlus className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500" /> Bulk Import
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => { setPreSelectedMission(null); setIsWizardOpen(true); }}
                disabled={children.length === 0}
                className={`flex items-center gap-1.5 md:gap-2 font-black rounded-xl md:rounded-full shadow-lg border-b-4 transition-all disabled:opacity-50
                  ${selectedChildId 
                    ? 'px-5 md:px-8 py-3 md:py-4 bg-orange-500 text-white border-orange-700 hover:bg-orange-600 hover:scale-105 active:translate-y-1 active:border-b-0 text-sm md:text-lg whitespace-nowrap' 
                    : 'px-4 md:px-6 py-2.5 md:py-3 bg-orange-500 text-white border-orange-700 hover:bg-orange-600 active:translate-y-1 active:border-b-0 text-xs md:text-sm whitespace-nowrap'}`}
              >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                {selectedChildId ? 'New Quest' : 'Create'}
              </button>

              {role === "student" && (
                <Link
                  href="/join"
                  className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-red-100 text-red-600 font-black rounded-xl md:rounded-full shadow-lg border-b-4 border-red-300 hover:bg-red-200 active:translate-y-1 active:border-b-0 transition-all text-xs md:text-sm whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden xs:inline">Exit</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {!selectedChildId ? (
          /* --- LOBBY VIEWS (Blocked for students via logic above, but hard-gated here too) --- */
          <div className="animate-in zoom-in-95 duration-500">
            {role === "student" ? (
              <div className="text-center p-20">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-sky-500" />
              </div>
            ) : activeTab === "analytics" && role === "teacher" ? (
              <TeacherAnalytics 
                children={children} 
                stories={stories} 
                vocabulary={vocabulary} 
                challengeLogs={challengeLogs}
                classMission={classMission}
                classMissions={classMissions}
                classCode={classCode}
                onSelectStudent={(id) => setSelectedChildId(id)}
              />
            ) : activeTab === "missions" ? (
              <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mt-4 md:mt-8">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl border-4 border-white">
                  <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                    <div className="bg-orange-100 p-3 md:p-4 rounded-2xl md:rounded-3xl text-orange-500 shadow-inner shrink-0">
                      <Target className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-5xl font-black text-sky-950 font-comic tracking-tight leading-none mb-1 md:mb-2">Family Quest Hub</h2>
                      <p className="text-sky-600/60 font-bold text-xs md:text-lg">Set special goals for your explorers! ✨</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {children.map((child) => (
                      <div key={child.id} className="bg-sky-50/50 rounded-[24px] md:rounded-[32px] p-5 md:p-8 border-2 border-sky-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                          <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white border-2 border-sky-100 overflow-hidden shadow-sm shrink-0">
                            {child.avatar_url ? (
                              <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sky-200"><UserCircle className="w-6 h-6 md:w-10 md:h-10" /></div>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-sky-950 font-comic">{child.name}</h3>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                              type="text" 
                              value={familyMissionInput[child.id] || ""}
                              onChange={(e) => setFamilyMissionInput(prev => ({ ...prev, [child.id]: e.target.value }))}
                              placeholder={`e.g. Visit the Moon...`}
                              className="flex-grow p-3.5 md:p-4 bg-white border-2 border-sky-100 rounded-xl md:rounded-2xl focus:border-orange-400 outline-none font-bold text-sky-950 text-sm md:text-base"
                            />
                            <button 
                              onClick={() => handleAddFamilyMission(child.id)}
                              disabled={isAddingFamilyMission[child.id] || !(familyMissionInput[child.id]?.trim())}
                              className="px-6 md:px-8 py-3.5 md:py-4 bg-orange-500 text-white font-black rounded-xl md:rounded-2xl shadow-lg border-b-4 border-orange-700 active:translate-y-1 active:border-b-0 disabled:opacity-20 transition-all text-sm md:text-base whitespace-nowrap"
                            >
                              {isAddingFamilyMission[child.id] ? "..." : "Add Quest"}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {child.assigned_missions?.map((m, i) => (
                              <div key={i} className="flex items-center gap-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-sky-100 shadow-sm animate-in zoom-in duration-300">
                                <span className="text-xs md:text-sm font-bold text-sky-700">"{m}"</span>
                                <button onClick={() => handleDeleteFamilyMission(child.id, m)} className="text-sky-300 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                              </div>
                            ))}
                            {(!child.assigned_missions || child.assigned_missions.length === 0) && (
                              <p className="text-sky-300 font-bold text-[10px] md:text-xs italic ml-2">No active family quests for {child.name} yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 mt-4 md:mt-8">
                {children.map((child) => (
                  <div 
                    key={child.id} 
                    onClick={() => setSelectedChildId(child.id)}
                    className="bg-white rounded-[32px] md:rounded-[56px] p-6 md:p-12 shadow-2xl border-[3px] md:border-4 border-white hover:border-sky-400 hover:ring-[8px] md:hover:ring-[16px] hover:ring-sky-50 transition-all group relative cursor-pointer hover:-translate-y-2 md:hover:-translate-y-4"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingChild(child); }}
                      className="absolute top-4 right-4 md:top-10 md:right-10 p-2 md:p-4 bg-sky-50 text-sky-400 rounded-xl md:rounded-3xl hover:bg-sky-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg border-2 border-white"
                    >
                      <Settings className="w-4 h-4 md:w-8 md:h-8" />
                    </button>

                    <div className="w-20 h-20 md:w-40 md:h-40 bg-sky-50 rounded-[24px] md:rounded-[48px] flex items-center justify-center mb-4 md:mb-10 group-hover:rotate-6 transition-all relative z-10 overflow-hidden shadow-inner border-[3px] md:border-4 border-white">
                      {child.avatar_url ? (
                        <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="text-sky-200 w-10 h-10 md:w-24 md:h-24" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl md:text-5xl font-black text-sky-950 mb-2 md:mb-4 font-comic tracking-tight leading-none truncate">{child.name}</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {child.interests?.slice(0, 2).map((interest, i) => (
                        <span key={i} className="px-2 md:px-5 py-1 md:py-2 bg-sky-50 text-sky-600 rounded-full text-[7px] md:text-xs font-black uppercase tracking-widest border-2 border-sky-100 shadow-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --- EXPLORER ADVENTURE VIEW --- */
          <div className="mt-2 md:mt-4 animate-in fade-in slide-in-from-top-12 duration-700">
            
            {/* Magical Tab Bar */}
            <div className="flex flex-col items-center mb-8 md:mb-20">
              <div className="flex flex-row justify-center gap-2 md:gap-8 bg-white/60 backdrop-blur-2xl p-2 md:p-6 rounded-[24px] md:rounded-[56px] border-2 md:border-4 border-white shadow-2xl w-full max-w-6xl mx-auto ring-[4px] md:ring-[16px] ring-sky-50/50">
                <button onClick={() => setActiveTab("world")} className={`flex flex-col items-center justify-center gap-1 md:gap-3 px-3 py-3 md:px-12 md:py-10 rounded-xl md:rounded-[40px] font-black transition-all border-b-[4px] md:border-b-[12px] active:border-b-0 active:translate-y-1 md:active:translate-y-3 flex-1 min-w-0 group ${activeTab === 'world' ? 'bg-sky-500 text-white border-sky-700 shadow-2xl scale-105' : 'bg-white text-sky-400 border-sky-100 hover:bg-sky-50 hover:text-sky-600'}`}>
                  <MapIcon className={`w-5 h-5 md:w-12 md:h-12 transition-transform group-hover:scale-110 ${activeTab === 'world' ? 'text-white' : 'text-sky-400'}`} /> 
                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-4xl font-comic">Map</span>
                    <span className={`text-[6px] md:text-sm font-black uppercase tracking-widest opacity-80 hidden sm:block ${activeTab === 'world' ? 'text-sky-100' : 'text-sky-300'}`}>Kingdom</span>
                  </div>
                </button>
                <button onClick={() => setActiveTab("words")} className={`flex flex-col items-center justify-center gap-1 md:gap-3 px-3 py-3 md:px-12 md:py-10 rounded-xl md:rounded-[40px] font-black transition-all border-b-[4px] md:border-b-[12px] active:border-b-0 active:translate-y-1 md:active:translate-y-3 flex-1 min-w-0 group ${activeTab === 'words' ? 'bg-purple-500 text-white border-purple-700 shadow-2xl scale-105' : 'bg-white text-purple-400 border-purple-100 hover:bg-sky-50 hover:text-purple-600'}`}>
                  <BookOpen className={`w-5 h-5 md:w-12 md:h-12 transition-transform group-hover:scale-110 ${activeTab === 'words' ? 'text-white' : 'text-purple-400'}`} /> 
                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-4xl font-comic">Words</span>
                    <span className={`text-[6px] md:text-sm font-black uppercase tracking-widest opacity-80 hidden sm:block ${activeTab === 'words' ? 'text-purple-100' : 'text-purple-300'}`}>Mastery</span>
                  </div>
                </button>
                <button onClick={() => setActiveTab("stories")} className={`flex flex-col items-center justify-center gap-1 md:gap-3 px-3 py-3 md:px-12 md:py-10 rounded-xl md:rounded-[40px] font-black transition-all border-b-[4px] md:border-b-[12px] active:border-b-0 active:translate-y-1 md:active:translate-y-3 flex-1 min-w-0 group ${activeTab === 'stories' ? 'bg-orange-500 text-white border-orange-700 shadow-2xl scale-105' : 'bg-white text-orange-400 border-orange-100 hover:bg-orange-50 hover:text-orange-600'}`}>
                  <Sparkles className={`w-5 h-5 md:w-12 md:h-12 transition-transform group-hover:scale-110 ${activeTab === 'stories' ? 'text-white' : 'text-orange-400'}`} /> 
                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-4xl font-comic">Library</span>
                    <span className={`text-[6px] md:text-sm font-black uppercase tracking-widest opacity-80 hidden sm:block ${activeTab === 'stories' ? 'text-orange-100' : 'text-orange-300'}`}>Favorites</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-500">
              {activeTab === "world" && (
                <div className="space-y-8 md:space-y-16 animate-in zoom-in-95 duration-500">
                  <AdventureMap 
                    stickers={filteredStickers} 
                    name={activeChildName} 
                    childId={selectedChildId || undefined}
                    explorerLevel={activeChild?.explorer_level}
                    gems={activeChild?.gems}
                    initialDiscoveries={filteredDiscoveries}
                    isPremium={isPremium}
                  />
                </div>
              )}
              {activeTab === "words" && <div className="animate-in zoom-in-95 duration-500"><WordBank words={filteredVocab} name={activeChildName} /></div>}
              {activeTab === "stories" && <div className="animate-in zoom-in-95 duration-500"><StoryLibrary stories={filteredStories} name={activeChildName} /></div>}
            </div>
          </div>
        )}
      </div>

      {/* --- QUEST LOG MODAL (Multi-Mission Hub) --- */}
      {isQuestLogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-purple-900/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] rounded-[24px] md:rounded-[64px] p-6 md:p-16 shadow-2xl border-4 md:border-[12px] border-white relative overflow-hidden animate-in zoom-in-90 duration-500 flex flex-col">
            
            <div className="absolute top-0 left-0 w-full h-2 md:h-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400" />
            <button onClick={() => setIsQuestLogOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 hover:bg-sky-50 rounded-xl md:rounded-2xl transition-colors"><X className="w-6 h-6 md:w-8 md:h-8 text-sky-300" /></button>

            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12 shrink-0">
              <div className="bg-purple-100 p-3 md:p-4 rounded-2xl md:rounded-3xl"><Scroll className="w-8 h-8 md:w-10 md:h-10 text-purple-600" /></div>
              <h2 className="text-3xl md:text-6xl font-black text-sky-950 font-comic tracking-tight uppercase">Quest Log</h2>
            </div>

            <div className="space-y-6 md:space-y-8 overflow-y-auto pr-2 md:pr-4 custom-scrollbar flex-grow">
              {/* ACTIVE MISSIONS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-purple-400 uppercase tracking-widest">
                  <Target className="w-3.5 h-3.5 md:w-4 md:h-4" /> Active Quests
                </div>
                
                {missionStats.active.map((mission, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 md:p-8 rounded-[24px] md:rounded-[32px] border-4 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg
                      ${mission.type === 'class' ? 'bg-purple-50 border-purple-200' : 'bg-orange-50 border-orange-200'}`}
                    onClick={() => { setPreSelectedMission(mission.text); setIsWizardOpen(true); setIsQuestLogOpen(false); }}
                  >
                    <div className="flex justify-between items-center gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${mission.type === 'class' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                          {mission.type === 'class' ? <Scroll className="w-5 h-5 md:w-6 md:h-6" /> : <Home className="w-5 h-5 md:w-6 md:h-6" />}
                        </div>
                        <div>
                          <h3 className="text-lg md:text-2xl font-black font-comic text-sky-950 leading-tight">"{mission.text}"</h3>
                          <p className={`font-bold text-[8px] md:text-[10px] uppercase tracking-widest ${mission.type === 'class' ? 'text-purple-400' : 'text-orange-400'}`}>
                            {mission.type === 'class' ? 'Class Mission' : 'Family Quest'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:translate-x-2 shrink-0 ${mission.type === 'class' ? 'text-purple-400' : 'text-orange-400'}`} />
                    </div>
                  </div>
                ))}

                {missionStats.active.length === 0 && (
                  <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-4 border-dashed border-sky-100 bg-sky-50 text-center">
                    <p className="text-sky-400 font-black font-comic text-lg md:text-xl">You've started all active quests! ✨</p>
                  </div>
                )}
              </div>

              {/* MASTERED MISSIONS */}
              {missionStats.mastered.length > 0 && (
                <div className="space-y-4 pt-4 border-t-2 border-sky-50">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest">
                    <History className="w-3.5 h-3.5 md:w-4 md:h-4" /> Mastery History
                  </div>
                  {missionStats.mastered.map((mission, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-emerald-50 p-4 md:p-6 rounded-[20px] md:rounded-[24px] border-2 border-emerald-100 opacity-80">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-emerald-100 p-1.5 md:p-2 rounded-lg md:rounded-xl"><Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 stroke-[4px]" /></div>
                        <div className="flex flex-col">
                          <span className="font-black font-comic text-emerald-900 text-base md:text-lg leading-tight">"{mission.text}"</span>
                          <span className="text-[7px] md:text-[8px] font-black text-emerald-400 uppercase tracking-widest">Mastered!</span>
                        </div>
                      </div>
                      <div className={`p-1.5 rounded-lg shrink-0 ${mission.type === 'class' ? 'bg-purple-100 text-purple-400' : 'bg-orange-100 text-orange-400'}`}>
                        {mission.type === 'class' ? <Scroll className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Home className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setIsQuestLogOpen(false)} className="mt-6 md:mt-12 w-full py-4 md:py-6 bg-sky-500 text-white font-black text-xl md:text-2xl rounded-2xl md:rounded-3xl shadow-xl hover:bg-sky-600 transition-all border-b-4 md:border-b-8 border-sky-700 active:border-b-0 active:translate-y-1 md:active:translate-y-2 shrink-0">Keep Exploring!</button>
          </div>
        </div>
      )}

      {isWizardOpen && (
        <QuestWizard 
          children={children} 
          selectedChildId={selectedChildId}
          onClose={() => setIsWizardOpen(false)} 
          classMission={classMission}
          classMissions={classMissions}
          role={role}
          initialMission={preSelectedMission}
        />
      )}

      {isAddChildOpen && <AddChildModal role={role} onClose={() => setIsAddChildOpen(false)} />}
      {isBulkAddOpen && <BulkAddModal onClose={() => setIsBulkAddOpen(false)} />}
      {editingChild && <EditChildModal role={role} child={editingChild} onClose={() => setEditingChild(null)} />}
    </div>
  );
}
