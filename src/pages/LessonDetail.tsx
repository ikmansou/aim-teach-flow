import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  classrooms,
  lessons,
  students,
  getStudentInitials,
  getAetBgClass,
  getClassroomStudents,
} from "@/data/mockData";
import {
  Pencil,
  Target,
  Activity,
  FileText,
  Brain,
  BookOpen,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const LessonDetail = () => {
  const { classroomId, subjectId, lessonId } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string; imageUrl?: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const classroom = classrooms.find(c => c.id === classroomId);
  const lesson = lessons.find(l => l.id === lessonId);
  const classStudents = classroom ? getClassroomStudents(classroom.id) : [];

  const [aetTargets, setAetTargets] = useState<string[]>(() => lesson?.aetTargets || []);
  const [currObjectives, setCurrObjectives] = useState<string[]>(() => lesson?.curriculumObjectives || []);
  const [editingAetIdx, setEditingAetIdx] = useState<number | null>(null);
  const [editingCurrIdx, setEditingCurrIdx] = useState<number | null>(null);
  const [newAet, setNewAet] = useState("");
  const [newCurr, setNewCurr] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildLessonContext = useCallback(() => {
    // Gather previous lessons for this classroom+subject to get goal achievement history
    const classroomLessons = lessons.filter(
      l => l.classroomId === classroomId && l.subjectId === subjectId && l.status === "completed"
    );
    const studentHistory = classStudents.map(s => {
      const pastResults = classroomLessons.map(pl => {
        const fb = pl.studentFeedback[s.id];
        if (!fb) return null;
        return { lesson: pl.title, goalMet: fb.met, notes: fb.notes };
      }).filter(Boolean);
      return {
        name: s.name,
        aetLevel: s.aetLevel,
        britishCurriculumLevel: s.britishCurriculumLevel,
        strengths: s.strengths,
        supportNeeds: s.supportNeeds,
        aetSkills: s.aetSkills,
        notes: s.notes,
        previousGoalAchievement: pastResults,
      };
    });

    return {
      lessonTitle: lesson?.title || "",
      lessonDate: lesson?.date || "",
      lessonStatus: lesson?.status || "",
      goals: lesson?.goals || [],
      activities: lesson?.activities || [],
      aetTargets,
      curriculumObjectives: currObjectives,
      uploadedFiles: uploadedFiles.map(f => f.name),
      students: studentHistory,
    };
  }, [lesson, aetTargets, currObjectives, uploadedFiles, classStudents, classroomId, subjectId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4 text-yusr-sky" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return <FileSpreadsheet className="h-4 w-4 text-yusr-emerald" />;
    if (type.includes("video")) return <FileVideo className="h-4 w-4 text-yusr-coral" />;
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-destructive" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!classroom || !lesson) return <div className="p-8">Lesson not found.</div>;

  const EditIcon = () => (
    <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors inline-block ml-1" />
  );

  const handleSendChat = async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg = chatInput.trim();
    const userMessage = { role: "user" as const, content: userMsg };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsStreaming(true);

    let assistantSoFar = "";
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lesson-ai`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
          lessonContext: buildLessonContext(),
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: snapshot } : m);
                }
                return [...prev, { role: "assistant", content: snapshot }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast.error(e.message || "Failed to get AI response");
      setChatMessages(prev => prev.filter(m => !(m.role === "assistant" && m.content === "")));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleGenerateImageDirect = async (directPrompt: string) => {
    if (!directPrompt.trim() || isStreaming || isGeneratingImage) return;
    const prompt = directPrompt.trim();
    setChatMessages(prev => [...prev, { role: "user", content: `🖼️ Generate image: ${prompt}` }]);
    setChatInput("");
    setIsGeneratingImage(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: data.text || "Here's your generated image:",
        imageUrl: data.imageUrl || undefined,
      }]);
    } catch (e: any) {
      console.error("Image generation error:", e);
      toast.error(e.message || "Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!chatInput.trim() || isStreaming || isGeneratingImage) return;
    const prompt = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: `🖼️ Generate image: ${prompt}` }]);
    setChatInput("");
    setIsGeneratingImage(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: data.text || "Here's your generated image:",
        imageUrl: data.imageUrl || undefined,
      }]);
    } catch (e: any) {
      console.error("Image generation error:", e);
      toast.error(e.message || "Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Classrooms", href: "/classrooms" },
            { label: classroom.name, href: `/classroom/${classroom.id}` },
            { label: "English", href: `/classroom/${classroom.id}/subject/${subjectId}` },
            { label: lesson.title },
          ]}
        />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{lesson.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span>{new Date(lesson.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  <Badge variant={lesson.status === "completed" ? "default" : lesson.status === "ongoing" ? "secondary" : "outline"} className="capitalize">
                    {lesson.status}
                  </Badge>
                </div>
              </div>
              <EditIcon />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Goals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-yusr-sky" /> Goals <EditIcon /></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.goals.map((g, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-yusr-teal" /> Activities <EditIcon /></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.activities.map((a, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                      {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-yusr-amber" /> Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 group">
                        {getFileIcon(f.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{f.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatSize(f.size)}</p>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload files</span>
                </button>
              </CardContent>
            </Card>

            {/* Curriculum Mapping */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">Curriculum Mapping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Brain className="h-3 w-3" /> AET Targets</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aetTargets.map((t, i) => (
                      editingAetIdx === i ? (
                        <div key={i} className="flex items-center gap-1">
                          <Input
                            defaultValue={t}
                            className="h-6 text-[10px] w-48"
                            autoFocus
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val) { setAetTargets(prev => prev.map((x, j) => j === i ? val : x)); }
                              setEditingAetIdx(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); }
                              if (e.key === "Escape") { setEditingAetIdx(null); }
                            }}
                          />
                        </div>
                      ) : (
                        <Badge
                          key={i}
                          className="bg-yusr-indigo/15 text-yusr-indigo border-0 text-[10px] cursor-pointer group gap-1"
                          onClick={() => setEditingAetIdx(i)}
                        >
                          {t}
                          <Trash2
                            className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setAetTargets(prev => prev.filter((_, j) => j !== i)); }}
                          />
                        </Badge>
                      )
                    ))}
                    {newAet !== "" ? (
                      <Input
                        value={newAet}
                        onChange={(e) => setNewAet(e.target.value)}
                        className="h-6 text-[10px] w-48"
                        autoFocus
                        placeholder="New AET target..."
                        onBlur={() => { if (newAet.trim()) { setAetTargets(prev => [...prev, newAet.trim()]); } setNewAet(""); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newAet.trim()) { setAetTargets(prev => [...prev, newAet.trim()]); setNewAet(""); }
                          if (e.key === "Escape") { setNewAet(""); }
                        }}
                      />
                    ) : (
                      <button onClick={() => setNewAet(" ")} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 rounded-full border border-dashed border-border">
                        <Plus className="h-2.5 w-2.5" /> Add
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><BookOpen className="h-3 w-3" /> British Curriculum</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currObjectives.map((o, i) => (
                      editingCurrIdx === i ? (
                        <div key={i} className="flex items-center gap-1">
                          <Input
                            defaultValue={o}
                            className="h-6 text-[10px] w-48"
                            autoFocus
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val) { setCurrObjectives(prev => prev.map((x, j) => j === i ? val : x)); }
                              setEditingCurrIdx(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); }
                              if (e.key === "Escape") { setEditingCurrIdx(null); }
                            }}
                          />
                        </div>
                      ) : (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] cursor-pointer group gap-1"
                          onClick={() => setEditingCurrIdx(i)}
                        >
                          {o}
                          <Trash2
                            className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                            onClick={(e) => { e.stopPropagation(); setCurrObjectives(prev => prev.filter((_, j) => j !== i)); }}
                          />
                        </Badge>
                      )
                    ))}
                    {newCurr !== "" ? (
                      <Input
                        value={newCurr}
                        onChange={(e) => setNewCurr(e.target.value)}
                        className="h-6 text-[10px] w-48"
                        autoFocus
                        placeholder="New objective..."
                        onBlur={() => { if (newCurr.trim()) { setCurrObjectives(prev => [...prev, newCurr.trim()]); } setNewCurr(""); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newCurr.trim()) { setCurrObjectives(prev => [...prev, newCurr.trim()]); setNewCurr(""); }
                          if (e.key === "Escape") { setNewCurr(""); }
                        }}
                      />
                    ) : (
                      <button onClick={() => setNewCurr(" ")} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 rounded-full border border-dashed border-border">
                        <Plus className="h-2.5 w-2.5" /> Add
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Feedback */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Student Progress — Goal Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(lesson.studentFeedback).length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No feedback recorded yet — lesson is upcoming.</p>
              ) : (
                <div className="space-y-3">
                  {classStudents.map(student => {
                    const fb = lesson.studentFeedback[student.id];
                    if (!fb) return null;
                    return (
                      <div key={student.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getStudentInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{student.name}</span>
                            <Badge className={`${getAetBgClass(student.aetLevel)} text-primary-foreground text-[9px] px-1.5`}>
                              {student.aetLevel}
                            </Badge>
                            {fb.met ? (
                              <CheckCircle2 className="h-4 w-4 text-yusr-emerald" />
                            ) : (
                              <XCircle className="h-4 w-4 text-yusr-coral" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{fb.notes}</p>
                        </div>
                        <EditIcon />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* AI Pedagogical Partner FAB */}
      <>
          <motion.button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            aria-label="AI Pedagogical Partner"
          >
            <Sparkles className="h-6 w-6" />
          </motion.button>

          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 right-6 w-[560px] max-h-[75vh] bg-card border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">AI Pedagogical Partner</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setChatOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[350px]">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/40" />
                      <p>Ask me to generate resources, differentiate materials, or suggest activities for your students.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => {
                    // Extract image prompts from assistant messages
                    const extractImagePrompts = (content: string): { cleanContent: string; prompts: string[] } => {
                      const prompts: string[] = [];
                      const lines = content.split("\n");
                      const cleanLines: string[] = [];
                      let inResourceSection = false;
                      for (const line of lines) {
                        if (line.includes("📸 Visual Resources You Can Generate")) {
                          inResourceSection = true;
                          continue;
                        }
                        if (inResourceSection && line.trim().startsWith("- 🖼️")) {
                          prompts.push(line.trim().replace(/^-\s*🖼️\s*/, ""));
                        } else if (inResourceSection && line.trim() === "") {
                          continue;
                        } else {
                          if (inResourceSection && !line.trim().startsWith("- 🖼️")) inResourceSection = false;
                          cleanLines.push(line);
                        }
                      }
                      return { cleanContent: cleanLines.join("\n").trim(), prompts };
                    };

                    const isAssistant = msg.role === "assistant";
                    const { cleanContent, prompts: imagePrompts } = isAssistant ? extractImagePrompts(msg.content) : { cleanContent: msg.content, prompts: [] };

                    return (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                            : "bg-muted text-foreground prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 max-w-none"
                        }`}>
                          {msg.role === "user" ? msg.content : (
                            <>
                              <ReactMarkdown>{cleanContent}</ReactMarkdown>
                              {imagePrompts.length > 0 && (
                                <div className="mt-3 space-y-1.5 not-prose">
                                  <p className="text-[11px] font-semibold text-muted-foreground">📸 Generate a visual:</p>
                                  {imagePrompts.map((prompt, pi) => (
                                    <button
                                      key={pi}
                                      onClick={() => {
                                        setChatInput(prompt);
                                        handleGenerateImageDirect(prompt);
                                      }}
                                      disabled={isGeneratingImage || isStreaming}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 text-[11px] text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                      <Image className="h-3.5 w-3.5 text-primary shrink-0" />
                                      {prompt}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {msg.imageUrl && (
                                <img src={msg.imageUrl} alt="Generated visual aid" className="mt-2 rounded-lg max-w-full" />
                              )}
                              {cleanContent && cleanContent.length > 50 && (
                                <button
                                  onClick={() => downloadMarkdownAsPdf(msg.content, `resource-${Date.now()}.pdf`)}
                                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                                  title="Download as PDF"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Download PDF
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isGeneratingImage && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] px-3 py-2 rounded-xl text-sm bg-muted text-foreground">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 animate-pulse text-primary" />
                          <span className="text-muted-foreground">Generating image...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t p-3 flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Generate resources for this lesson..."
                    className="min-h-[40px] max-h-[80px] text-sm resize-none"
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleGenerateImage}
                    disabled={!chatInput.trim() || isStreaming || isGeneratingImage}
                    title="Generate image"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={handleSendChat} disabled={!chatInput.trim() || isStreaming || isGeneratingImage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </>

    </div>
  );
};

export default LessonDetail;
