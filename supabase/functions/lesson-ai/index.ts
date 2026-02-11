import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limiter: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute before trying again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, lessonContext } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const systemPrompt = `You are an expert SEN (Special Educational Needs) pedagogical partner for teachers in UAE schools following the British Curriculum and the AET (Autism Education Trust) framework.

You help teachers generate personalized, differentiated resources for their students based on:
- Each student's AET level and skills
- Their British Curriculum level
- Their individual strengths and support needs
- The lesson's goals, activities, AET targets, and curriculum objectives
- Any resources the teacher has uploaded

Here is the current lesson context:

**Lesson:** ${lessonContext.lessonTitle}
**Date:** ${lessonContext.lessonDate}
**Status:** ${lessonContext.lessonStatus}

**Goals:**
${lessonContext.goals.map((g: string, i: number) => `${i + 1}. ${g}`).join("\n")}

**Activities:**
${lessonContext.activities.map((a: string) => `- ${a}`).join("\n")}

**AET Targets:**
${lessonContext.aetTargets.map((t: string) => `- ${t}`).join("\n")}

**British Curriculum Objectives:**
${lessonContext.curriculumObjectives.map((o: string) => `- ${o}`).join("\n")}

**Uploaded Resources:**
${lessonContext.uploadedFiles.length > 0 ? lessonContext.uploadedFiles.map((f: string) => `- ${f}`).join("\n") : "None uploaded yet."}

**Students in this class:**
${lessonContext.students.map((s: { name: string; aetLevel: string; britishCurriculumLevel: string; strengths: string[]; supportNeeds: string[]; aetSkills: { label: string }[]; notes: string }) =>
  `- **${s.name}** | AET: ${s.aetLevel} | Curriculum: ${s.britishCurriculumLevel}
    Strengths: ${s.strengths.join(", ")}
    Support needs: ${s.supportNeeds.join(", ")}
    AET Skills: ${s.aetSkills.map(sk => sk.label).join(", ")}
    Notes: ${s.notes}`
).join("\n\n")}

When generating resources:
1. Always differentiate by student AET level and curriculum level
2. Reference specific students by name with tailored suggestions
3. Align resources with the lesson's AET targets and curriculum objectives
4. Suggest modifications to uploaded resources where relevant
5. Use clear formatting with headers and bullet points
6. Be practical and classroom-ready`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          ],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("Gemini API error:", response.status, t);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Gemini SSE stream to OpenAI-compatible format for the frontend
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              const openAIChunk = {
                choices: [{ delta: { content } }],
              };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openAIChunk)}\n\n`));
            }
          } catch { /* skip unparseable lines */ }
        }
      },
      flush(controller) {
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      },
    });

    return new Response(response.body!.pipeThrough(transformStream), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("lesson-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
