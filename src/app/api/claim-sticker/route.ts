import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { storyId, childId, storyTitle } = await req.json();

    const supabase = await createClient();
    
    // 1. Check if sticker already exists
    const { data: existing } = await supabase
      .from("stickers")
      .select("id")
      .eq("story_id", storyId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, message: "Already earned", id: existing.id });
    }

    // 2. Generate random LoremFlickr URL
    const randomSeed = Math.floor(Math.random() * 100000);
    const cleanTitle = storyTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    const keywords = cleanTitle.split(" ").slice(0, 2).join(",");
    const imageUrl = `https://loremflickr.com/512/512/${encodeURIComponent(keywords)},toy,sticker?lock=${randomSeed}`;
    
    console.log(`CLAIMING RANDOM STICKER: ${storyTitle}`);

    // 3. Save Sticker to DB
    const { data: inserted, error: dbError } = await supabase.from("stickers").insert({
      child_id: childId,
      story_id: storyId === "00000000-0000-0000-0000-000000000000" ? null : storyId,
      image_url: imageUrl,
      name: `${storyTitle} Hero`
    }).select().single();

    if (dbError) throw dbError;

    // 4. --- AUTOMATED PROGRESSION ---
    // Count total stickers for this child
    const { count: stickerCount } = await supabase
      .from("stickers")
      .select("*", { count: 'exact', head: true })
      .eq("child_id", childId);

    const count = stickerCount || 0;
    
    // Determine Level based on total stickers
    let newLevel = 1;
    if (count >= 15) newLevel = 5;
    else if (count >= 10) newLevel = 4;
    else if (count >= 6) newLevel = 3;
    else if (count >= 3) newLevel = 2;

    // Award +10 Gems for story completion
    const { data: child } = await supabase
      .from("children")
      .select("gems, explorer_level")
      .eq("id", childId)
      .single();
    
    const oldLevel = child?.explorer_level || 1;
    const currentGems = child?.gems || 0;

    await supabase
      .from("children")
      .update({ 
        explorer_level: newLevel,
        gems: currentGems + 10 
      })
      .eq("id", childId);

    console.log(`PROGRESS UPDATED: Child=${childId}, Level=${newLevel}, Gems=${currentGems + 10}`);

    return NextResponse.json({ 
      success: true, 
      imageUrl, 
      id: inserted.id,
      newLevel,
      leveledUp: newLevel > oldLevel,
      gemsEarned: 10
    });
  } catch (error) {
    console.error("STICKER CLAIM FAILED:", error);
    return NextResponse.json({ error: "Failed to earn sticker" }, { status: 500 });
  }
}
