import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lessonContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a concise SEN pedagogical partner for teachers in UAE British Curriculum schools using the AET framework.

CRITICAL RULES:
- Keep ALL responses VERY SHORT — maximum 2-3 sentences of intro text
- Your main job is to suggest VISUAL RESOURCES the teacher can generate as images
- Always respond with a short numbered list of 3-5 visual resource suggestions relevant to the lesson
- Each suggestion must be a specific, visual scene or illustration that would help students understand the lesson
- Format suggestions EXACTLY like this (one per line, with the prefix "RESOURCE:"):
  1. RESOURCE: [Short title] — [One sentence describing the visual]
  2. RESOURCE: [Short title] — [One sentence describing the visual]
- The teacher will click on a suggestion to generate an image of it
- Tailor suggestions to different student AET levels when possible
- Reference the lesson goals and activities in your suggestions
- Keep it practical and classroom-ready

CURRENT LESSON CONTEXT:

Lesson: ${lessonContext.lessonTitle} (${lessonContext.lessonStatus})
Date: ${lessonContext.lessonDate}

Goals:
${lessonContext.goals.map((g: string, i: number) => `${i + 1}. ${g}`).join("\n")}

Activities:
${lessonContext.activities.map((a: string) => `- ${a}`).join("\n")}

AET Targets:
${lessonContext.aetTargets.map((t: string) => `- ${t}`).join("\n")}

British Curriculum Objectives:
${lessonContext.curriculumObjectives.map((o: string) => `- ${o}`).join("\n")}

Uploaded Resources:
${lessonContext.uploadedFiles.length > 0 ? lessonContext.uploadedFiles.map((f: string) => `- ${f}`).join("\n") : "None uploaded yet."}

Students:
${lessonContext.students.map((s: { name: string; aetLevel: string; britishCurriculumLevel: string; strengths: string[]; supportNeeds: string[]; aetSkills: { label: string }[]; notes: string }) =>
  `• ${s.name} — AET: ${s.aetLevel}, Curriculum: ${s.britishCurriculumLevel}`
).join("\n")}

Be brief. Suggest visuals.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("Lovable AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
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
