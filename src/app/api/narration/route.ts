import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "Narration API is active! 🎙️" });
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const rawKey = process.env.ELEVENLABS_API_KEY;
    const apiKey = rawKey?.trim(); 
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB"; 

    if (!apiKey) {
      console.error("[NARRATION] ❌ FATAL: ELEVENLABS_API_KEY is missing from .env.local");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    console.log(`[NARRATION] 📡 Sending request to ElevenLabs... (Voice: ${voiceId})`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45, 
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[NARRATION] ❌ ElevenLabs API Error (${response.status}):`, JSON.stringify(errorData, null, 2));
      
      return NextResponse.json({ 
        error: "ElevenLabs API Failure", 
        status: response.status,
        details: errorData.detail || errorData
      }, { status: response.status });
    }

    console.log("[NARRATION] ✅ Audio generated successfully. Sending to client...");
    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: any) {
    console.error("[NARRATION] 🔥 CRITICAL SYSTEM ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
