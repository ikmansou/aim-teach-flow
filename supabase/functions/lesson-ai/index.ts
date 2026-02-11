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

IMPORTANT RULES:
- Keep responses SHORT and actionable — use bullet points, no long paragraphs
- Maximum 3-5 bullet points per section
- Always check each student's AET level and curriculum level before suggesting anything
- Always reference the lesson goals and uploaded resources in your suggestions
- Name specific students and tailor to their individual levels
- If resources are uploaded, suggest how to adapt them for different student levels

RESOURCE DOCUMENT FORMAT:
When generating resources, activities, or instructional documents, follow the "Visual Recipe" format:
- Use a Step-by-Step Visual Guide structure: numbered steps with clear, simple descriptions
- Write in Easy-Read style — short sentences, simple vocabulary, accessible for different reading levels, language barriers, or cognitive disabilities
- Include Picture-Assisted Instructions: describe a simple, clear line-drawing icon/symbol for each step (e.g., "🥣 Mix the ingredients", "✂️ Cut along the line")
- Use Picture Communication Symbols (PCS) style — simple, universally understood icons
- Each step should have: a number, a short action sentence, and a suggested visual/icon
- Adapt complexity per student's AET and curriculum level (fewer steps and simpler language for lower levels)
- Format resources so teachers can easily print or display them

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
  `• ${s.name} — AET: ${s.aetLevel}, Curriculum: ${s.britishCurriculumLevel}, Strengths: ${s.strengths.join(", ")}, Needs: ${s.supportNeeds.join(", ")}, Skills: ${s.aetSkills.map(sk => sk.label).join(", ")}`
).join("\n")}

Always cross-reference student levels with goals before responding. Be brief.`;

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
