import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { eventType, path, metadata } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Log the activity
    await supabaseAdmin.from("activity_logs").insert({
      user_id: user.id,
      event_type: eventType, // 'page_view' or 'heartbeat'
      path: path,
      metadata: metadata || {}
    });

    // 2. If it's a heartbeat, update the last_seen_at on profile
    if (eventType === 'heartbeat' || eventType === 'page_view') {
      await supabaseAdmin
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ACTIVITY LOG ERROR:", error);
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 });
  }
}
