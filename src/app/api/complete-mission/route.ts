import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { childId, missionText } = await req.json();

    if (!childId || !missionText) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    // 2. Fetch existing completed missions
    const { data: child } = await supabaseAdmin
      .from("children")
      .select("completed_missions")
      .eq("id", childId)
      .single();

    const currentCompletions = child?.completed_missions || [];
    const trimmedMission = missionText.trim();
    const normalizedMission = trimmedMission.toLowerCase();

    // 3. Update the child's completed missions array (Case-insensitive check)
    const alreadyCompleted = currentCompletions.some((m: string) => m.trim().toLowerCase() === normalizedMission);

    if (!alreadyCompleted) {
      console.log(`[MISSION API] Adding "${trimmedMission}" to completion history for child ${childId}`);
      const { error } = await supabaseAdmin
        .from("children")
        .update({ 
          last_completed_mission: trimmedMission, // Keep for backward compat
          completed_missions: [...currentCompletions, trimmedMission] 
        })
        .eq("id", childId);

      if (error) {
        console.error("COMPLETE MISSION DB ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/student/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("COMPLETE MISSION API ERROR:", error);
    return NextResponse.json({ error: "Magic failed" }, { status: 500 });
  }
}
