import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { storyId, choiceText, previousPages, level, name } = await req.json();

    // 1. Check Authentication (Standard or Student Session)
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
    const shouldEnd = pageNumber >= 7; // Target length: 7 pages
    const mustEnd = pageNumber >= 10; // Hard cap

    const prompt = `
      Continue an interactive Pixar-style story for ${name}.
      The child just chose: "${choiceText}".
      Current Page Number: ${pageNumber}
      
      Previous Context Summary: ${previousPages.map((p: any) => p.text).slice(-3).join(" ")}
      
      Reading Level ${level} Rules:
      - Level 1: 3-5 words per sentence.
      - Level 2: 5-8 words per sentence.
      - Level 3: 8-12 words per sentence.

      PEDAGOGICAL RULES FOR CHALLENGES:
      - Forbid "Circular Questions": Do not ask about the main subject of the first sentence.
      - Level 1 (Literal): Ask about colors, shapes, or specific objects (e.g., "What was the cat holding?").
      - Level 2 (Detail/Sequence): Ask about materials or the order of events (e.g., "What was the boat made of?").
      - Level 3 (Inference/Vocabulary): Ask "Why" or use a vocabulary word in the question (e.g., "Why did the hero feel 'tremendous' joy?").
      - The "answer" MUST be 1-2 words long and found explicitly in the text.
      - Identify 1-2 "vocabulary" words that are slightly challenging for Level ${level}. Provide simple definitions.

      ${shouldEnd ? "CRITICAL: The story should reach a satisfying conclusion NOW." : ""}
      ${mustEnd ? "CRITICAL: The story MUST end on this page." : ""}

      Return ONLY valid JSON for the NEXT PAGE:
      {
        "text": "Next part text...",
        "challenge": "A creative comprehension question following the pedagogical rules.",
        "answer": "Exact word from text",
        "imageDescription": "Detailed Pixar-style scene description for DALL-E",
        "vocabulary": [
          { "word": "word1", "definition": "simple meaning" }
        ],
        "choices": ${mustEnd ? "[]" : `[
          {"text": "Next choice 1", "id": "c1"},
          {"text": "Next choice 2", "id": "c2"}
        ]`},
        "isFinal": ${mustEnd ? "true" : "false"}
      }
    `;

    let nextPage;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      nextPage = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (err) {
      // Fallback
      const fallbackRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt + " Respond with JSON." }],
          model: "openai",
          json: true
        })
      });
      
      const fallbackJSON = await fallbackRes.json();
      
      let rawContent = "";
      if (fallbackJSON.choices?.[0]?.message?.content) {
        rawContent = fallbackJSON.choices[0].message.content;
      } else if (fallbackJSON.content) {
        rawContent = fallbackJSON.content;
      } else {
        rawContent = JSON.stringify(fallbackJSON);
      }

      try {
        const firstBrace = rawContent.indexOf("{");
        const lastBrace = rawContent.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
          const jsonString = rawContent.substring(firstBrace, lastBrace + 1);
          nextPage = JSON.parse(jsonString);
        } else {
          throw new Error("No JSON found in content");
        }
      } catch (parseError) {
        console.error("Continue Story Parse Failed.");
        nextPage = { text: "The magic ended unexpectedly.", challenge: "What happened?", answer: "Magic", isFinal: true, choices: [] };
      }
    }

    // Sanitize and enforce limits
    if (mustEnd || !nextPage.choices) {
      nextPage.isFinal = true;
      nextPage.choices = nextPage.choices || [];
    }

    // Update the story in the database (Using Admin to bypass RLS for students)
    const { data: story, error: fetchError } = await supabaseAdmin
      .from("stories")
      .select("content_json")
      .eq("id", storyId)
      .single();

    if (fetchError || !story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const updatedContent = { ...story.content_json };
    updatedContent.pages.push(nextPage);
    
    const { error: updateError } = await supabaseAdmin
      .from("stories")
      .update({ content_json: updatedContent })
      .eq("id", storyId);

    if (updateError) {
      console.error("DB Update Failed:", updateError.message);
      return NextResponse.json({ error: "Failed to save the next chapter" }, { status: 500 });
    }

    return NextResponse.json(nextPage);
  } catch (error) {
    console.error("CONTINUE STORY ERROR:", error);
    return NextResponse.json({ error: "Magic failed" }, { status: 500 });
  }
}
