"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Star, 
  ChevronRight,
  GraduationCap,
  Calendar,
  ArrowLeftRight,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  X,
  Sparkles,
  Scroll,
  Send,
  Loader2,
  Key,
  Copy,
  AlertTriangle,
  RefreshCw,
  Ghost,
  Trash2,
  Plus
} from "lucide-react";
import { addClassMission, deleteClassMission, generateClassCode, resetStudentMission } from "@/app/dashboard/actions";

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
}

interface Story {
  id: string;
  child_id: string;
  title: string;
  created_at: string;
}

interface Vocabulary {
  id: string;
  child_id: string;
  word: string;
  created_at: string;
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

interface TeacherAnalyticsProps {
  children: Child[];
  stories: Story[];
  vocabulary: Vocabulary[];
  challengeLogs?: ChallengeLog[];
  classMission?: string | null;
  classMissions?: string[];
  classCode?: string | null;
  onSelectStudent: (id: string) => void;
}

type DateRange = "7d" | "30d" | "all";

export default function TeacherAnalytics({ 
  children, 
  stories, 
  vocabulary, 
  challengeLogs = [], 
  classMission = null,
  classMissions = [],
  classCode = null,
  onSelectStudent 
}: TeacherAnalyticsProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isUpdatingMission, setIsUpdatingMission] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [missionInput, setMissionInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- MISSION HANDLER ---
  const handleAddMission = async () => {
    if (!missionInput.trim()) return;
    setIsUpdatingMission(true);
    setError(null);
    try {
      const res = await addClassMission(missionInput.trim());
      if (res.success) {
        setMissionInput("");
        setShowSuccess(true);
        router.refresh();
        setTimeout(() => setShowSuccess(false), 3000);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add mission.");
    } finally {
      setIsUpdatingMission(false);
    }
  };

  const handleDeleteMission = async (text: string) => {
    try {
      const res = await deleteClassMission(text);
      if (res.success) {
        router.refresh();
      }
    } catch (err: any) {
      setError("Failed to delete mission.");
    }
  };

  // --- CLASS CODE HANDLER ---
  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);
    setError(null);
    try {
      const res = await generateClassCode();
      if (res.success) {
        router.refresh();
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate code. Check database schema.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyCode = () => {
    if (classCode) {
      navigator.clipboard.writeText(classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- DATE FILTERING LOGIC ---
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (dateRange === "7d") cutoff.setDate(now.getDate() - 7);
    else if (dateRange === "30d") cutoff.setDate(now.getDate() - 30);
    else cutoff.setFullYear(2000); // "All time"

    return {
      stories: stories.filter(s => new Date(s.created_at) >= cutoff),
      vocabulary: vocabulary.filter(v => v.child_id === (v.child_id) && new Date(v.created_at) >= cutoff),
      logs: challengeLogs.filter(l => new Date(l.created_at) >= cutoff)
    };
  }, [stories, vocabulary, challengeLogs, dateRange]);

  // --- AGGREGATE METRICS ---
  const stats = useMemo(() => {
    const totalStudents = children.length;
    const totalStories = filteredData.stories.length;
    const totalWords = filteredData.vocabulary.length;
    
    const avgLevel = totalStudents > 0 
      ? (children.reduce((acc, c) => acc + (c.explorer_level || 1), 0) / totalStudents).toFixed(1)
      : 0;

    return {
      totalStudents,
      totalStories,
      totalWords,
      avgLevel
    };
  }, [children, filteredData]);

  // --- STUDENT PROGRESS DATA ---
  const studentData = useMemo(() => {
    return children.map(child => {
      const studentStories = filteredData.stories.filter(s => s.child_id === child.id).length;
      const studentWords = filteredData.vocabulary.filter(v => v.child_id === child.id).length;
      const studentLogs = filteredData.logs.filter(l => l.child_id === child.id);
      
      const struggles: string[] = [];
      
      const vocabLogs = studentLogs.filter(l => l.challenge_type === "vocabulary");
      const compLogs = studentLogs.filter(l => l.challenge_type === "comprehension");

      if (vocabLogs.length > 0) {
        const avgVocabAttempts = vocabLogs.reduce((acc, l) => acc + l.attempts, 0) / vocabLogs.length;
        if (avgVocabAttempts > 1.8) struggles.push("Vocabulary Context");
      }

      if (compLogs.length > 0) {
        const avgCompAttempts = compLogs.reduce((acc, l) => acc + l.attempts, 0) / compLogs.length;
        if (avgCompAttempts > 1.8) struggles.push("Comprehension");
      }
      
      return {
        ...child,
        storyCount: studentStories,
        wordCount: studentWords,
        struggles
      };
    }).sort((a, b) => (b.explorer_level || 0) - (a.explorer_level || 0));
  }, [children, filteredData]);

  // --- CLASSROOM STRATEGY ADVISOR LOGIC ---
  const classroomStrategy = useMemo(() => {
    const allStruggles = studentData.flatMap(s => s.struggles);
    const vocabStruggles = allStruggles.filter(s => s === "Vocabulary Context").length;
    const compStruggles = allStruggles.filter(s => s === "Comprehension").length;

    if (vocabStruggles > compStruggles && vocabStruggles > 0) {
      return {
        summary: "The class is showing great creative energy, but many students are taking multiple tries to master new vocabulary words.",
        activity: "Try a 'Word Hunt' game: before reading, preview 3 'Golden Words' from the next story and act out their meanings."
      };
    } else if (compStruggles > 0) {
      return {
        summary: "Your explorers are reading quickly, but showing a dip in comprehension challenge accuracy this week.",
        activity: "Introduce 'Pause & Predict': stop halfway through a story and have students draw what they think will happen next."
      };
    }

    return {
      summary: "Classroom performance is exceptional! Students are clearing challenges with high accuracy across all biomes.",
      activity: "Encourage students to try 'Interactive Mode' to further stretch their decision-making and logic skills."
    };
  }, [studentData]);

  const toggleCompare = (id: string) => {
    setSelectedForComparison(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id].slice(0, 3)
    );
  };

  if (children.length === 0) {
    return (
      <div className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-center border-4 border-dashed border-sky-100 shadow-inner mx-4">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl md:text-6xl text-sky-200">📊</div>
        <h2 className="text-2xl md:text-3xl font-black text-sky-950 mb-4 font-comic">No Classroom Data Yet</h2>
        <p className="text-sm md:text-xl text-sky-600/60 font-bold max-w-md mx-auto leading-relaxed">Add students and start adventures to see your classroom's literacy journey come to life!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 px-4 md:px-0">
      
      {/* --- ERROR REPORTING --- */}
      {error && (
        <div className="bg-red-50 border-2 md:border-4 border-red-100 p-4 md:p-6 rounded-2xl md:rounded-[32px] flex items-center gap-3 md:gap-4 text-red-600 animate-in shake duration-500">
          <div className="bg-red-500 p-1.5 md:p-2 rounded-lg md:rounded-xl text-white shadow-lg shrink-0">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-black font-comic text-sm md:text-base">Magic Glitch!</h4>
            <p className="font-bold text-xs md:text-sm opacity-80 truncate">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors shrink-0">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      )}

      {/* --- REFACTORED: CLASSROOM CONTROL STRIP --- */}
      <div className="bg-sky-900 rounded-[24px] md:rounded-[48px] p-4 md:p-6 shadow-2xl border-2 md:border-4 border-sky-800 text-white flex flex-col gap-6 lg:gap-8">
        
        <div className="flex flex-col md:flex-row lg:items-center gap-6">
          {/* Class Code Access */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 md:border-r-2 md:border-white/10 md:pr-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <Key className="w-5 h-5 md:w-6 md:h-6 text-sky-300" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-sky-300">Class Access</p>
              {classCode ? (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={copyCode}>
                  <span className="text-lg md:text-2xl font-black font-mono tracking-tight group-hover:text-sky-300 transition-colors">{classCode}</span>
                  <div className="relative shrink-0">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 group-hover:text-white" />}
                    {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap">Copied!</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleGenerateCode(); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-1" title="Regenerate Code">
                    <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 hover:text-white ${isGeneratingCode && 'animate-spin'}`} />
                  </button>
                </div>
              ) : (
                <button onClick={handleGenerateCode} disabled={isGeneratingCode} className="text-xs md:text-sm font-black text-sky-400 underline decoration-2 underline-offset-4">Generate Access Code</button>
              )}
            </div>
          </div>

          {/* Mission Control List */}
          <div className="flex-grow flex flex-col gap-4">
            <div className="flex items-center gap-2 md:gap-4 w-full">
              <div className="relative flex-grow group">
                <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors">
                  <Scroll className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <input 
                  type="text" 
                  value={missionInput}
                  onChange={(e) => setMissionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMission()}
                  placeholder="Add a new story mission..."
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/5 border-2 border-white/10 rounded-xl md:rounded-[24px] focus:bg-white focus:text-sky-950 focus:outline-none transition-all font-bold text-xs md:text-base placeholder:text-white/30"
                />
              </div>
              <button 
                onClick={handleAddMission}
                disabled={isUpdatingMission || !missionInput.trim()}
                className="p-3 md:px-8 md:py-4 bg-purple-500 hover:bg-purple-400 text-white rounded-xl md:rounded-[24px] font-black transition-all flex items-center justify-center gap-2 shrink-0 shadow-xl"
              >
                {isUpdatingMission ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span className="hidden md:block">Add Mission</span>
              </button>
            </div>

            {/* Active Missions List */}
            <div className="flex flex-wrap gap-2">
              {classMissions.map((mission, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-white/10 group">
                  <span className="text-[10px] md:text-sm font-bold truncate max-w-[120px] md:max-w-[200px]">{mission}</span>
                  <button 
                    onClick={() => handleDeleteMission(mission)}
                    className="p-1 hover:bg-red-500 text-white/40 hover:text-white rounded-lg transition-all"
                  >
                    <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              ))}
              {classMissions.length === 0 && (
                <p className="text-white/20 text-[10px] md:text-xs font-bold italic py-1">No active missions ✨</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip: Filter & Compare */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex bg-white/10 p-1 rounded-xl shrink-0">
            {(["7d", "30d", "all"] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all ${dateRange === range ? 'bg-white text-sky-950 shadow-md' : 'text-white/60 hover:text-white'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCompareMode(!compareMode); setSelectedForComparison([]); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border-2 text-[10px] md:text-xs font-black uppercase tracking-widest ${compareMode ? 'bg-orange-500 border-orange-400 text-white' : 'bg-white/10 border-transparent text-white/60 hover:text-white hover:bg-white/20'}`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            {compareMode ? 'Cancel' : 'Compare Growth'}
          </button>
        </div>
      </div>

      {/* --- COMPARISON VIEW --- */}
      {compareMode && selectedForComparison.length > 0 && (
        <div className="bg-sky-900 rounded-[32px] md:rounded-[48px] p-6 md:p-10 text-white shadow-2xl animate-in zoom-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black font-comic tracking-tight">Growth Comparison</h3>
            <p className="text-sky-300 font-bold text-sm">Comparing {selectedForComparison.length} Explorers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {selectedForComparison.map(id => {
              const student = studentData.find(s => s.id === id);
              if (!student) return null;
              return (
                <div key={id} className="bg-white/10 backdrop-md rounded-2xl md:rounded-[32px] p-6 md:p-8 border border-white/20">
                  <div className="flex items-center gap-3 md:gap-4 mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 overflow-hidden shadow-inner shrink-0">
                      {student.avatar_url ? (
                        <img src={student.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-black">{student.name[0]}</div>
                      )}
                    </div>
                    <span className="text-lg md:text-xl font-black font-comic truncate">{student.name}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sky-300 font-bold uppercase text-[8px] md:text-[10px]">Level</span>
                      <span className="text-xl md:text-2xl font-black">{student.explorer_level}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${(student.explorer_level || 1) * 10}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sky-300 font-bold uppercase text-[8px] md:text-[10px]">Stories Read</span>
                      <span className="text-xl md:text-2xl font-black">{student.storyCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TOP LEVEL OVERVIEW CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Students", value: stats.totalStudents, icon: <Users />, color: "bg-blue-500", sub: "Active Explorers" },
          { label: "Stories", value: stats.totalStories, icon: <BookOpen />, color: "bg-orange-500", sub: `This period` },
          { label: "Vocab", value: stats.totalWords, icon: <Star />, color: "bg-purple-500", sub: "Class Mastery" },
          { label: "Avg Lv.", value: stats.avgLevel, icon: <Trophy />, color: "bg-emerald-500", sub: "Class Progress" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[40px] shadow-xl border-2 md:border-4 border-white group hover:-translate-y-1 transition-all">
            <div className={`${item.color} w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-6 shadow-lg group-hover:rotate-6 transition-transform shrink-0`}>
              {item.icon}
            </div>
            <p className="text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs mb-0.5 md:mb-1">{item.label}</p>
            <h3 className="text-2xl md:text-4xl font-black text-sky-950 font-comic leading-none">{item.value}</h3>
            <p className="text-sky-600/60 font-bold text-[8px] md:text-sm mt-1 md:mt-2 truncate">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* --- STUDENT PERFORMANCE TABLE --- */}
      <div className="bg-white rounded-[24px] md:rounded-[48px] border-2 md:border-4 border-white shadow-2xl overflow-hidden">
        <div className="p-6 md:p-10 border-b-2 md:border-b-4 border-sky-50 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-purple-100 p-2.5 md:p-4 rounded-xl md:rounded-[24px] text-purple-600 shrink-0">
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black text-sky-950 font-comic tracking-tight leading-tight">Student Performance</h2>
              <p className="text-sky-600/60 font-bold text-xs md:text-base">Track individual growth and support needs</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/50">
                {compareMode && <th className="px-4 md:px-10 py-4 md:py-6 w-10 md:w-12"></th>}
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs whitespace-nowrap">Explorer</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs text-center whitespace-nowrap">Level</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs text-center whitespace-nowrap">Stories</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs min-w-[140px] md:min-w-[180px] whitespace-nowrap">Progress</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs whitespace-nowrap">Alerts</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs whitespace-nowrap">Strategy</th>
                <th className="px-4 md:px-10 py-4 md:py-6 text-sky-900/40 font-black uppercase tracking-widest text-[8px] md:text-xs"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 md:divide-y-4 divide-sky-50">
              {studentData.map((student) => {
                const isSelected = selectedForComparison.includes(student.id);
                return (
                  <tr key={student.id} className={`group transition-colors ${isSelected ? 'bg-sky-50/50' : 'hover:bg-sky-50/30'}`}>
                    {compareMode && (
                      <td className="px-4 md:px-10 py-4 md:py-8">
                        <button 
                          onClick={() => toggleCompare(student.id)}
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-lg border-2 md:border-4 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-sky-100 text-transparent hover:border-sky-300'}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5" />
                        </button>
                      </td>
                    )}
                    <td className="px-4 md:px-10 py-4 md:py-8 whitespace-nowrap">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-orange-100 border-2 border-white shadow-md overflow-hidden shrink-0 shadow-inner">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-500 font-black text-sm md:text-base">{student.name[0]}</div>
                          )}
                        </div>
                        <span className="text-sm md:text-xl font-black text-sky-950 font-comic truncate max-w-[100px] md:max-w-none">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8 text-center">
                      <span className="bg-sky-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black text-[10px] md:text-sm shadow-sm border-b-2 md:border-b-4 border-sky-700">{student.explorer_level}</span>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8 text-center">
                      <span className="text-base md:text-xl font-black text-sky-900">{student.storyCount}</span>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8">
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex justify-between text-[7px] md:text-[10px] font-black uppercase text-sky-400 tracking-widest">
                          <span>Progress</span>
                          <span>{Math.min((student.explorer_level || 1) * 10, 100)}%</span>
                        </div>
                        <div className="h-3 md:h-5 bg-sky-100/50 rounded-full overflow-hidden border md:border-2 border-white shadow-inner relative">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-300 transition-all duration-1000 ease-out rounded-full relative"
                            style={{ width: `${Math.min((student.explorer_level || 1) * 10, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8 whitespace-nowrap">
                      {student.struggles.length > 0 ? (
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {student.struggles.map(s => (
                            <span key={s} className="px-2 py-0.5 md:px-3 md:py-1 bg-red-50 text-red-600 rounded-lg text-[7px] md:text-[10px] font-black uppercase flex items-center gap-1 border border-red-100">
                              <AlertCircle className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" /> {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[10px] md:text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> <span className="hidden xs:inline">All Clear</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8 min-w-[150px] md:max-w-[250px]">
                      {student.struggles.length > 0 ? (
                        <div className="bg-orange-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-orange-100">
                          <p className="text-[8px] md:text-[10px] font-bold text-orange-700 leading-tight">
                            <Lightbulb className="w-2.5 h-2.5 md:w-3 md:h-3 inline mr-1 mb-0.5 shrink-0" />
                            {student.struggles.includes("Vocabulary Context") 
                              ? `Try 'Word Sketching' activities.`
                              : `Try 'Story Mapping' together.`}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sky-400 font-bold text-[8px] md:text-[10px] whitespace-nowrap">Steady growth...</span>
                      )}
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8 text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        {/* DEV RESET BUTTON */}
                        <button 
                          onClick={async (e) => { 
                            e.stopPropagation(); 
                            if (confirm(`Reset mission status for ${student.name}?`)) {
                              await resetStudentMission(student.id);
                              router.refresh();
                            }
                          }}
                          className="p-2 md:p-3 text-sky-200 hover:text-orange-500 transition-colors shrink-0"
                          title="Dev: Reset Mission Completion"
                        >
                          <Ghost className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        <button 
                          onClick={() => onSelectStudent(student.id)}
                          className="p-2 md:p-3 bg-white text-sky-400 rounded-lg md:rounded-xl border-2 border-sky-50 hover:bg-sky-500 hover:text-white transition-all shadow-sm group/btn shrink-0"
                        >
                          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BOTTOM GRID: INSIGHTS & ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Vocabulary Spotlight */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-2 md:border-4 border-white shadow-xl">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-purple-100 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-purple-600 shrink-0">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-sky-950 font-comic tracking-tight">Vocabulary Insights</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-5 md:p-6 bg-purple-50 rounded-2xl md:rounded-3xl border-2 border-purple-100 shadow-inner">
              <p className="text-purple-900/60 font-bold text-xs md:text-base mb-4 italic">Latest Mastered Words:</p>
              <div className="flex flex-wrap gap-2">
                {filteredData.vocabulary.slice(0, 8).map((v, i) => (
                  <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-purple-600 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm shadow-sm border-2 border-purple-100 transition-all hover:scale-105">
                    {v.word}
                  </span>
                ))}
                {filteredData.vocabulary.length === 0 && <p className="text-purple-300 italic text-xs">Waiting for explorers... ⏳</p>}
              </div>
            </div>
          </div>
        </div>

        {/* AI Learning Strategy Card */}
        <div className="bg-sky-950 p-6 md:p-10 rounded-[32px] md:rounded-[48px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[200px] md:min-h-0">
          <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 md:opacity-10 pointer-events-none">
            <Lightbulb className="w-32 h-32 md:w-48 md:h-48" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden xs:inline">Teacher AI Advisor</span><span className="xs:hidden">Advisor</span>
            </div>
            <h3 className="text-xl md:text-3xl font-black font-comic mb-2 md:mb-4 tracking-tight leading-tight">Classroom Strategy</h3>
            <p className="text-sky-200 font-bold text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
              {classroomStrategy.summary}
            </p>
            <div className="bg-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-sm shadow-inner">
              <h4 className="font-black text-orange-400 mb-1.5 md:mb-2 uppercase tracking-widest text-[8px] md:text-xs">Recommended Activity:</h4>
              <p className="font-bold text-sky-100 text-xs md:text-base leading-relaxed">{classroomStrategy.activity}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
