import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { childId, word, definition, sentenceContext, storyId } = await req.json();

    if (!childId || !word) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Try standard Auth first
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. If no user, check for student session cookie
    let isAuthorized = !!user;
    if (!isAuthorized) {
      const cookieStore = await cookies();
      const studentSession = cookieStore.get("student_session");
      if (studentSession) {
        const sessionData = JSON.parse(studentSession.value);
        if (sessionData.studentId === childId) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Perform Upsert (using Admin if it was a student session to bypass RLS)
    const { error } = await supabaseAdmin
      .from("vocabulary")
      .upsert({
        child_id: childId,
        word: word.toLowerCase().trim(),
        definition,
        sentence_context: sentenceContext,
        story_id: storyId
      }, {
        onConflict: 'child_id,word'
      });

    if (error) {
      console.error("VOCAB SAVE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VOCAB API ERROR:", error);
    return NextResponse.json({ error: "Magic failed" }, { status: 500 });
  }
}
