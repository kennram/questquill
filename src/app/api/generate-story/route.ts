import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

export async function GET() {
  return NextResponse.json({ status: "Magic is active! 🪄" });
}

// ULTIMATE FALLBACK: A high-quality static story in case all AI services fail
const RESCUE_STORY = {
  title: "The Robot's Golden Battery",
  pages: [
    {
      text: "Sparky the small robot beeped sadly. His light was turning from blue to a dim orange. He was running out of energy in the middle of the desert.",
      challenge: "What color was Sparky's light turning?",
      answer: "orange",
      imageDescription: "A small cute robot in a vast desert under a setting sun, Pixar style",
      vocabulary: [{ word: "dim", definition: "not bright" }]
    },
    {
      text: "Suddenly, Sparky saw something shiny under a tall palm tree. It was a golden battery half-buried in the warm sand.",
      challenge: "Where was the golden battery?",
      answer: "sand",
      imageDescription: "A golden battery glowing in the sand near a palm tree",
      vocabulary: [{ word: "buried", definition: "covered up" }]
    },
    {
      text: "Sparky used his mechanical arms to dig up the battery. It felt warm and hummed with a magical sound.",
      challenge: "What kind of arms does Sparky have?",
      answer: "mechanical",
      imageDescription: "Sparky holding a glowing battery with his robot arms",
      vocabulary: [{ word: "hummed", definition: "made a low buzzing sound" }]
    },
    {
      text: "He plugged the golden battery into his chest. Instantly, Sparky felt a surge of magic power!",
      challenge: "Where did Sparky plug the battery?",
      answer: "chest",
      imageDescription: "Sparky glowing with bright golden light",
      vocabulary: [{ word: "surge", definition: "a sudden powerful forward movement" }]
    },
    {
      text: "Sparky's light turned a bright, happy green. He zoomed across the desert, ready for his next big adventure!",
      challenge: "What color did Sparky's light turn?",
      answer: "green",
      imageDescription: "Sparky flying happily over sand dunes",
      vocabulary: [{ word: "zoomed", definition: "moved very fast" }]
    }
  ]
};

export async function POST(req: Request) {
  console.log("[GENERATE] --- NEW REQUEST ---");
  
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "No JSON body" }, { status: 400 });

    const { interests, name, level, childId, mode, isTest, classMission } = body;
    console.log(`[GENERATE] Child: ${childId}, Name: ${name}, Level: ${level}`);

    // 1. Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let isAuthorized = !!user;
    let teacherId = user?.id;

    if (!isAuthorized) {
      const cookieStore = await cookies();
      const studentSession = cookieStore.get("student_session");
      if (studentSession) {
        try {
          const sessionData = JSON.parse(studentSession.value);
          if (sessionData.studentId === childId) {
            isAuthorized = true;
            teacherId = sessionData.teacherId;
          }
        } catch (e) {}
      }
    }

    if (!isAuthorized || !teacherId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Profile & Limit Check
    const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("id", teacherId).single();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const now = new Date();
    const lastReset = profile.last_limit_reset ? new Date(profile.last_limit_reset) : new Date(0);
    const isNewMonth = (now.getUTCMonth() !== lastReset.getUTCMonth()) || (now.getUTCFullYear() !== lastReset.getUTCFullYear());
    let storyCount = isNewMonth ? 0 : (profile.story_count_monthly || 0);

    if (!profile.is_premium && storyCount >= 3 && !isTest) {
      return NextResponse.json({ error: "Monthly limit reached", limitReached: true }, { status: 403 });
    }

    // 3. Generation
    let storyData: any = null;
    const interestsArray = Array.isArray(interests) ? interests : interests ? [interests] : ["magic", "adventure"];
    const isInteractive = mode === "interactive";
    
    const mainPrompt = `
      Create a magical reading adventure for a child named ${name}.
      Mode: ${isInteractive ? "Interactive (Branching)" : "Classic (Linear)"}.
      Reading Level: ${level} (1: Beginner, 2: Intermediate, 3: Advanced).
      Topic: ${classMission || interestsArray.join(", ")}.
      Flavor: ${interestsArray.join(", ")}.

      PEDAGOGICAL RULES (STRICT):
      - NO "CIRCULAR QUESTIONS": Do not ask about the main subject of the very first sentence.
      - LITERAL LOCK: You MUST only ask about a specific noun or adjective that is EXPLICITLY written in the "text" field.
      - If the text says "shiny blue rocket", you can ask "What color was the rocket?".
      - If the text DOES NOT mention an "antenna", you are FORBIDDEN from asking about an antenna.
      - Answers MUST be exactly 1-2 words found in the text.
      - Identify 1-2 "vocabulary" words from the text and define them simply.

      STRUCTURE:
      ${isInteractive ? `
      - Generate ONLY THE FIRST PAGE of an interactive story.
      - Provide 2-3 "choices" for what happens next.
      ` : `
      - Generate exactly 5 pages.
      `}

      JSON STRUCTURE:
      {
        "title": "Title",
        "pages": [
          {
            "text": "3-4 sentences.",
            "challenge": "Question?",
            "answer": "word",
            "imageDescription": "Pixar scene",
            "vocabulary": [{"word": "word", "definition": "meaning"}]${isInteractive ? `,
            "choices": [{"text": "Choice 1", "id": "c1"}, {"text": "Choice 2", "id": "c2"}]` : ""}
          }
        ]
      }
      IMPORTANT: RETURN ONLY THE JSON OBJECT.
    `;

    // HELPER: The JSON Hunter
    const huntForStory = (data: any): any => {
      if (!data) return null;
      
      let obj = data;
      // If it's a string, try to parse it
      if (typeof data === 'string') {
        try {
          const match = data.match(/\{[\s\S]*\}/);
          if (match) obj = JSON.parse(match[0]);
          else return null;
        } catch (e) { return null; }
      }

      // If it has pages, we found it!
      if (obj.pages && Array.isArray(obj.pages) && obj.pages.length > 0) return obj;
      
      // If it's an array, assume it's the pages
      if (Array.isArray(obj) && obj.length > 0 && obj[0].text) return { title: "Magical Adventure", pages: obj };

      // Look inside all keys
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          const found = huntForStory(obj[key]);
          if (found) return found;
        }
      }
      return null;
    };

    try {
      console.log("[GENERATE] Calling Gemini...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      // Use 'gemini-pro' as a highly compatible model name
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(mainPrompt);
      const text = result.response.text();
      console.log("[GENERATE] Gemini Response Length:", text.length);
      storyData = huntForStory(text);
    } catch (e: any) {
      console.warn("[GENERATE] Gemini Quota/Limit Hit, trying Rescue Fallback...", e.message);
      try {
        const res = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a children's book author. You MUST respond with ONLY a valid JSON object. No reasoning." },
              { role: "user", content: mainPrompt }
            ],
            model: "openai",
            json: true
          })
        });
        const fallbackJSON = await res.json();
        storyData = huntForStory(fallbackJSON);
      } catch (fallbackErr) {
        console.error("[GENERATE] Fallback API also failed.");
      }
    }

    // FINAL RESCUE: If all AI fail, use the pre-written Sparky story
    if (!storyData || !storyData.pages) {
      console.warn("[GENERATE] ALL AI SERVICES FAILED. Deploying Rescue Story.");
      storyData = RESCUE_STORY;
    }

    // 5. Save & Update
    const { data: savedStory, error: dbError } = await supabaseAdmin
      .from("stories")
      .insert({
        child_id: childId,
        title: storyData.title || "Adventure",
        content_json: { ...storyData, mode: mode || 'classic', mission: classMission }
      })
      .select().single();

    if (dbError) throw new Error(`DB Save Failed: ${dbError.message}`);

    if (!isTest) {
      await supabaseAdmin.from("profiles").update({ 
        story_count_monthly: storyCount + 1,
        last_limit_reset: now.toISOString()
      }).eq("id", teacherId);
    }

    console.log(`[GENERATE] SUCCESS! "${storyData.title}" saved.`);
    return NextResponse.json({ ...storyData, id: savedStory.id });

  } catch (error: any) {
    console.error("[GENERATE] CRITICAL:", error);
    return NextResponse.json({ error: error.message || "Magic failed" }, { status: 500 });
  }
}
