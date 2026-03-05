import { NextResponse } from "next/server";
import { uploadImageFromUrl } from "@/lib/storage-helper";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    const keywords = description.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").slice(0, 3).join(",");
    
    // Use random seed for variety
    const randomSeed = Math.floor(Math.random() * 100000);
    const externalUrl = `https://loremflickr.com/512/512/${encodeURIComponent(keywords)},person,avatar?lock=${randomSeed}`;
    
    console.log("GENERATING AVATAR:", externalUrl);

    // PERSIST TO SUPABASE STORAGE
    // Generate a unique filename
    const fileName = `avatar-${Date.now()}-${randomSeed}.jpg`;
    const supabaseUrl = await uploadImageFromUrl(externalUrl, 'avatars', fileName);

    return NextResponse.json({ imageUrl: supabaseUrl });
  } catch (error) {
    console.error("AVATAR GEN ERROR:", error);
    return NextResponse.json({ error: "Failed to generate avatar" }, { status: 500 });
  }
}
