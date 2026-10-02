import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function pcmToWav(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  // RIFF identifier
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);

  // Format chunk identifier
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // Data chunk identifier
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || "Boss, kya haal? Aaj Day 17 hai. Winter Arc rukna nahi chahiye!";

    return await handleTTS(text);
  } catch (err: any) {
    console.error("TTS GET Error:", err);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body.text || "Boss, kya haal? Aaj Day 17 hai. Winter Arc rukna nahi chahiye!";

    return await handleTTS(text, body.voice);
  } catch (err: any) {
    console.error("TTS POST Error:", err);
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 });
  }
}

async function handleTTS(text: string, voice = "Puck") {
  // Check if static pre-rendered preview audio is available for the default landing prompt
  const previewPath = path.join(process.cwd(), "public", "assets", "audio", "gemini_voice_preview.wav");
  const isDefaultPrompt = text.toLowerCase().includes("kya haal") || text.toLowerCase().includes("day 17");

  if (isDefaultPrompt && fs.existsSync(previewPath)) {
    const fileBuffer = fs.readFileSync(previewPath);
    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      },
    });
  }

  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const promptText = `Speak in an authentic, brotherly Indian tone in natural conversational Hinglish: ${text}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini TTS API error:", err);
    // If dynamic call fails, fallback to pre-rendered preview if available
    if (fs.existsSync(previewPath)) {
      const fileBuffer = fs.readFileSync(previewPath);
      return new Response(new Uint8Array(fileBuffer), {
        headers: { "Content-Type": "audio/wav" },
      });
    }
    return NextResponse.json({ error: "TTS generation failed" }, { status: res.status });
  }

  const data = await res.json();
  const rawPcm = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!rawPcm) {
    if (fs.existsSync(previewPath)) {
      const fileBuffer = fs.readFileSync(previewPath);
      return new Response(new Uint8Array(fileBuffer), {
        headers: { "Content-Type": "audio/wav" },
      });
    }
    return NextResponse.json({ error: "No audio generated" }, { status: 500 });
  }

  const wavBuffer = pcmToWav(rawPcm);

  return new Response(new Uint8Array(wavBuffer), {
    headers: {
      "Content-Type": "audio/wav",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
