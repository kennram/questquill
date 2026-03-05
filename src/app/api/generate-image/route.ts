import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { uploadImageFromUrl } from "@/lib/storage-helper";

export async function POST(req: Request) {
  try {
    const { prompt, storyId, pageIndex } = await req.json();

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

    // Clean the prompt to get a few good keywords
    const keywords = prompt.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 3).join(",");
    const externalUrl = `https://loremflickr.com/1024/1024/pixar,${encodeURIComponent(keywords)}?lock=${storyId}-${pageIndex}`;
    
    console.log(`GENERATING IMAGE: Story ${storyId}, Page ${pageIndex}`);

    // PERSIST TO SUPABASE STORAGE
    const fileName = `${storyId}/page-${pageIndex}-${Date.now()}.jpg`;
    const supabaseUrl = await uploadImageFromUrl(externalUrl, 'stories', fileName);

    // Update DB (Using Admin to bypass RLS for students)
    try {
      const { data: story } = await supabaseAdmin
        .from("stories")
        .select("content_json")
        .eq("id", storyId)
        .single();

      if (story) {
        const updatedContent = { ...story.content_json };
        if (updatedContent.pages[pageIndex]) {
          updatedContent.pages[pageIndex].imageUrl = supabaseUrl;
          await supabaseAdmin.from("stories").update({ content_json: updatedContent }).eq("id", storyId);
        }
      }
    } catch (err) {
      console.warn("DB sync failed:", err);
    }
    
    return NextResponse.json({ imageUrl: supabaseUrl }); 
  } catch (error) {
    console.error("IMAGE ERROR:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
