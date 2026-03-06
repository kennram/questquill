import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { childId, biomeId } = await req.json();

    if (!childId || !biomeId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Check Authentication (Standard or Student Session)
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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Get child's current gems (Using Admin to bypass RLS)
    const { data: child, error: childError } = await supabaseAdmin
      .from("children")
      .select("gems")
      .eq("id", childId)
      .single();

    if (childError || !child) {
      return NextResponse.json({ error: "Explorer not found" }, { status: 404 });
    }

    const COST = 10;
    if (child.gems < COST) {
      return NextResponse.json({ error: "Not enough gems! Read more stories to earn more." }, { status: 400 });
    }

    // 3. Define treasures per biome
    const treasures: Record<string, { name: string, type: string }[]> = {
      woods: [
        { name: "Ancient Leaf", type: "artifact" },
        { name: "Glowing Mushroom", type: "artifact" },
        { name: "Magic Acorn", type: "artifact" }
      ],
      caverns: [
        { name: "Purple Crystal", type: "gem" },
        { name: "Gold Nugget", type: "gem" },
        { name: "Diamond Shard", type: "gem" }
      ],
      dino: [
        { name: "T-Rex Tooth", type: "fossil" },
        { name: "Raptor Claw", type: "fossil" },
        { name: "Amber Stone", type: "fossil" }
      ],
      shore: [
        { name: "Pearl of the Sea", type: "gem" },
        { name: "Magic Shell", type: "artifact" },
        { name: "Sunken Coin", type: "artifact" }
      ]
    };

    const biomeTreasures = treasures[biomeId] || treasures.woods;
    const randomTreasure = biomeTreasures[Math.floor(Math.random() * biomeTreasures.length)];

    // 4. Deduct gems
    const { error: updateError } = await supabaseAdmin
      .from("children")
      .update({ gems: child.gems - COST })
      .eq("id", childId);

    if (updateError) throw updateError;

    // 5. Save discovery
    const seed = Math.floor(Math.random() * 10000);
    // Use LoremFlickr (proxies high-quality Unsplash images) for 100% reliability
    const keywords = `${randomTreasure.name.split(' ').join(',')},magic,treasure`;
    const imageUrl = `https://loremflickr.com/512/512/${encodeURIComponent(keywords)}?lock=${seed}`;

    const { data: discovery, error: discoveryError } = await supabaseAdmin
      .from("map_discoveries")
      .insert({
        child_id: childId,
        biome_id: biomeId,
        discovery_type: randomTreasure.type,
        name: randomTreasure.name,
        image_url: imageUrl
      })
      .select()
      .single();

    if (discoveryError && discoveryError.code === '23505') {
       const { data: existing } = await supabaseAdmin
        .from("map_discoveries")
        .select("*")
        .eq("child_id", childId)
        .eq("biome_id", biomeId)
        .single();
       return NextResponse.json({ success: true, discovery: existing, message: "Re-discovered!" });
    }

    if (discoveryError) throw discoveryError;

    return NextResponse.json({ 
      success: true, 
      discovery,
      message: `You found a ${randomTreasure.name}!` 
    });
  } catch (error: any) {
    console.error("EXCAVATION ERROR:", error);
    return NextResponse.json({ error: error.message || "Digging failed" }, { status: 500 });
  }
}
