import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function sanitize(str: unknown, max = 500): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, max).replace(/[<>&"']/g, "");
}

function getOpenAIClient(): OpenAI {
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const deviceType = sanitize(body.deviceType);
    const brandModel = sanitize(body.brandModel);
    const cameraType = sanitize(body.cameraType);
    const shootingSituation = sanitize(body.shootingSituation, 1000);
    const purpose = sanitize(body.purpose);
    const skillLevel = sanitize(body.skillLevel);

    if (!deviceType || !brandModel || !cameraType || !shootingSituation || !purpose || !skillLevel) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    const prompt = `You are a professional cinematographer and video production expert.
A ${skillLevel} videographer is shooting ${shootingSituation}
using a ${deviceType} camera (${brandModel}, ${cameraType}) for ${purpose} content.

Generate a professional shot plan. Respond ONLY with valid JSON in this exact format, no markdown:
{
  "cameraAngles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
  "shotList": ["shot1", "shot2", "shot3", "shot4", "shot5", "shot6"],
  "settings": {
    "fps": "recommended frame rate with reason",
    "iso": "recommended ISO range",
    "aperture": "recommended aperture with depth note",
    "lighting": "lighting setup recommendation"
  },
  "movementTips": ["tip1", "tip2", "tip3", "tip4"],
  "editingSuggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content:
            "You are a professional cinematographer. Always respond with valid JSON only, no markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";

    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[/api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
