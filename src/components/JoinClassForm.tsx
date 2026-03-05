"use client";

import { useState } from "react";
import { ArrowRight, Loader2, UserCircle, AlertCircle } from "lucide-react";
import { verifyClassCode, loginStudent } from "@/app/join/actions";

interface Student {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default function JoinClassForm() {
  const [step, setStep] = useState<"code" | "select">("code");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setIsLoading(true);
    setError(null);

    // Format code: Uppercase and trimmed
    const formattedCode = code.toUpperCase().trim();

    try {
      const res = await verifyClassCode(formattedCode);
      if (res.error) {
        setError(res.error);
      } else {
        setTeacherName(res.teacherName || "your Teacher");
        // We need the teacher ID to verify the student later, but `verifyClassCode` didn't return it in the public object?
        // Ah, I missed returning the ID in the action.
        // Wait, looking at my action logic:
        // `select("id, username")` -> returns `profile.id`
        // But I returned `{ success: true, teacherName: profile.username, children: children }`
        // I need to return `teacherId` too!
        // I'll fix the component logic to expect it once I fix the action, or I can just rely on the fact that `verifyClassCode` implementation *should* return it.
        // Let me check my `actions.ts` implementation again in my head... 
        // I returned: `return { success: true, teacherName: profile.username, children: children };`
        // I MISSED THE ID! I cannot proceed without the teacher ID to validate the student login securely.
        
        // Strategy: I will continue writing this component assuming `res.teacherId` exists, 
        // AND THEN IMMEDIATELY FIX `src/app/join/actions.ts`.
        
        setTeacherId(res.teacherId); 
        setStudents(res.children || []);
        setStep("select");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (studentId: string) => {
    if (!teacherId) return;
    setIsLoading(true);
    await loginStudent(teacherId, studentId);
  };

  if (step === "select") {
    return (
      <div className="animate-in fade-in slide-in-from-right duration-500">
        <h2 className="text-3xl font-black text-sky-950 font-comic mb-2">Welcome to {teacherName}'s Class!</h2>
        <p className="text-sky-600 font-bold mb-8">Tap your name to start your adventure.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto p-4">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleLogin(student.id)}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 p-6 bg-sky-50 rounded-[32px] border-4 border-transparent hover:border-sky-300 hover:bg-sky-100 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-sky-200 shadow-md group-hover:scale-110 transition-transform">
                {student.avatar_url ? (
                  <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-12 h-12 text-sky-300" />
                )}
              </div>
              <span className="font-black text-sky-900 text-lg leading-tight group-hover:text-sky-600">{student.name}</span>
            </button>
          ))}
        </div>
        
        {students.length === 0 && (
          <p className="text-orange-500 font-bold">No students found in this class yet!</p>
        )}

        <button 
          onClick={() => setStep("code")}
          className="mt-8 text-sky-400 font-bold hover:text-sky-600 hover:underline"
        >
          Entered wrong code? Go back
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="space-y-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ADJECTIVE-ANIMAL-123"
          className="w-full text-center text-2xl md:text-4xl font-black font-mono tracking-widest p-6 rounded-[32px] border-4 border-sky-100 focus:border-sky-400 focus:ring-8 focus:ring-sky-50 outline-none uppercase placeholder:text-sky-100 text-sky-900 transition-all"
          maxLength={25}
        />
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 font-black animate-in shake">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || code.length < 5}
        className="w-full py-6 bg-sky-500 text-white font-black text-2xl rounded-[32px] shadow-xl hover:bg-sky-600 hover:scale-[1.02] active:scale-95 transition-all border-b-[8px] border-sky-700 active:border-b-0 active:translate-y-2 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
      >
        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Enter Classroom <ArrowRight className="w-8 h-8" /></>}
      </button>
    </form>
  );
}
