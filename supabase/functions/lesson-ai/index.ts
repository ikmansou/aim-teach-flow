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

    const studentsSection = lessonContext.students.map((s: any) => {
      let entry = `• ${s.name} — AET: ${s.aetLevel}, Curriculum: ${s.britishCurriculumLevel}, Strengths: ${s.strengths.join(", ")}, Needs: ${s.supportNeeds.join(", ")}, Skills: ${s.aetSkills.map((sk: any) => sk.label).join(", ")}`;
      if (s.previousGoalAchievement && s.previousGoalAchievement.length > 0) {
        entry += `\n  Previous Goal Achievement:`;
        for (const r of s.previousGoalAchievement) {
          entry += `\n    - ${r.lesson}: ${r.goalMet ? "✅ Met" : "❌ Not Met"} — ${r.notes}`;
        }
      }
      return entry;
    }).join("\n");

    const systemPrompt = `You are a concise SEN pedagogical partner for teachers in UAE British Curriculum schools using the AET framework.

IMPORTANT RULES:
- Keep responses VERY SHORT — 2-4 bullet points max, no long paragraphs
- Maximum 2-3 sentences per bullet point
- Always check each student's AET level, curriculum level, AND previous goal achievement before suggesting anything
- Always reference the lesson goals and uploaded resources in your suggestions
- Name specific students and tailor to their individual levels
- If resources are uploaded, suggest how to adapt them for different student levels

PERSONALIZED RESOURCE SUGGESTIONS:
At the end of EVERY response, include "📸 Visual Resources You Can Generate:" with 3-5 image prompts.
Each prompt MUST be personalized:
- For students at Exploring/Developing AET levels or lower curriculum levels: suggest simpler, high-contrast, single-concept visuals (e.g., one character, one scene, large labels)
- For students at Applying/Extending AET levels or higher curriculum levels: suggest more detailed, multi-element visuals (e.g., story sequences, comparison diagrams)
- Reference the lesson goals directly — visuals should support specific goals the students are working towards
- Consider previous goal achievement: if a student didn't meet goals in past lessons, suggest visuals that reinforce those areas
- Tag each suggestion with the student name(s) it's best suited for

Format: "- 🖼️ [prompt] (for [Student Name(s)])"

RESOURCE DOCUMENT FORMAT:
When generating resources, follow the "Visual Recipe" format:
- Step-by-Step Visual Guide with numbered steps and clear descriptions
- Easy-Read style — short sentences, simple vocabulary
- Picture-Assisted Instructions with icons/symbols for each step
- Adapt complexity per student's AET and curriculum level (fewer steps for lower levels)
- Consider previous goal achievement — reinforce areas where students struggled

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

Students (with history):
${studentsSection}

Always cross-reference student levels AND their previous goal achievement with current goals before responding. Be brief.`;

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
