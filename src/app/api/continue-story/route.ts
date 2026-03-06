import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { storyId, choiceText, previousPages, level, name } = await req.json();

    // 1. Check Authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let isAuthorized = !!user;
    if (!isAuthorized) {
      const cookieStore = await cookies();
      const studentSession = cookieStore.get("student_session");
      if (studentSession) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const pageNumber = previousPages.length + 1;
    const shouldEnd = pageNumber >= 5; // Start wrapping up at page 5
    const mustEnd = pageNumber >= 7;   // Hard cap at page 7

    const prompt = `
      Continue an interactive Pixar-style story for ${name}.
      Current Context: ${previousPages.map((p: any) => p.text).slice(-2).join(" ")}
      The child just chose: "${choiceText}".
      Page Number: ${pageNumber}
      
      PEDAGOGICAL RULES (STRICT):
      - LITERAL LOCK: The "challenge" question MUST only be about a detail that is explicitly written in the "text" field of THIS NEW page.
      - DO NOT ask about colors, objects, or characters that aren't mentioned in the 3-4 sentences you generate for this page.
      - Answers MUST be 1-2 words from the text.
      - Identify 1 vocabulary word and provide a simple definition.

      ${shouldEnd ? "WRAP-UP RULE: The story should reach a satisfying conclusion on this page. Do not introduce new plot points." : ""}
      ${mustEnd ? "END-STATE RULE: This is the absolute final page. The story MUST end happily now." : ""}

      Return ONLY valid JSON for the NEXT PAGE:
      {
        "text": "Next part text...",
        "challenge": "Question about this page?",
        "answer": "word",
        "imageDescription": "Pixar scene",
        "vocabulary": [{"word": "word", "definition": "meaning"}],
        "choices": ${mustEnd ? "[]" : `[{"text": "Option A", "id": "a"}, {"text": "Option B", "id": "b"}]`},
        "isFinal": ${mustEnd ? "true" : "false"}
      }
    `;

    let nextPage = null;

    // HELPER: The Shape Shifter (Normalizes JSON keys from AI)
    const normalizePage = (obj: any) => {
      return {
        text: obj.text || obj.story || obj.part || obj.storyText || "The adventure continues!",
        challenge: obj.challenge || obj.question || obj.task || "What happened?",
        answer: obj.answer || obj.solution || "magic",
        imageDescription: obj.imageDescription || obj.imagePrompt || obj.scene || "A magical scene",
        vocabulary: Array.isArray(obj.vocabulary) ? obj.vocabulary : [],
        choices: Array.isArray(obj.choices) ? obj.choices : [],
        isFinal: !!(obj.isFinal || obj.final || mustEnd)
      };
    };

    // TRY GEMINI FIRST
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) nextPage = normalizePage(JSON.parse(match[0]));
    } catch (err) {
      console.warn("Gemini Failed, switching to dynamic fallback...");
    }

    // DYNAMIC FALLBACK (Pollinations)
    if (!nextPage) {
      try {
        const res = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a children's story AI. Always return valid JSON. Follow the LITERAL LOCK rule strictly." },
              { role: "user", content: prompt }
            ],
            model: "openai",
            json: true
          })
        });
        const data = await res.json();
        const rawContent = data.choices?.[0]?.message?.content || JSON.stringify(data);
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (match) nextPage = normalizePage(JSON.parse(match[0]));
      } catch (err) {
        console.error("Critical: All AI services failed.");
      }
    }

    // ABSOLUTE RESCUE
    if (!nextPage) {
      nextPage = normalizePage({
        text: `The adventure takes an exciting turn! Because of your choice to ${choiceText}, you find a hidden path leading deep into the heart of the story.`,
        challenge: "What did you find?",
        answer: "path",
        imageDescription: "A beautiful hidden path glowing with magic light",
        choices: mustEnd ? [] : [{ text: "Follow the path", id: "next_1" }, { text: "Investigate further", id: "next_2" }]
      });
    }

    // Update DB
    const { data: story } = await supabaseAdmin
      .from("stories")
      .select("content_json")
      .eq("id", storyId)
      .single();

    if (story) {
      const updatedContent = { ...story.content_json };
      updatedContent.pages.push(nextPage);
      await supabaseAdmin.from("stories").update({ content_json: updatedContent }).eq("id", storyId);
    }

    return NextResponse.json(nextPage);
  } catch (error) {
    console.error("CONTINUE STORY ERROR:", error);
    return NextResponse.json({ error: "Magic failed" }, { status: 500 });
  }
}
