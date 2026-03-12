import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { eventType, path, metadata } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userId = user?.id || null;

    // 1. If not a standard user, check for student session
    if (!userId) {
      const cookieStore = await cookies();
      const studentSession = cookieStore.get("student_session");
      if (studentSession) {
        try {
          const sessionData = JSON.parse(studentSession.value);
          userId = sessionData.teacherId; // Attribute student activity to their teacher/class for now
        } catch (e) {}
      }
    }

    // 2. Log the activity (always, even if userId is null for landing page guests)
    await supabaseAdmin.from("activity_logs").insert({
      user_id: userId,
      event_type: eventType,
      path: path,
      metadata: metadata || {}
    });

    // 3. If it's a heartbeat/page_view AND we have a userId, update last_seen_at
    // Note: We only update profiles if we have a valid userId (Teacher/Parent)
    if (userId && (eventType === 'heartbeat' || eventType === 'page_view')) {
      await supabaseAdmin
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ACTIVITY LOG ERROR:", error);
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
