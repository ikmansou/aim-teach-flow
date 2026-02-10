import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  MessageCircle,
  X,
  Send,
  Sparkles,
} from "lucide-react";

const LessonDetail = () => {
  const { classroomId, subjectId, lessonId } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  const classroom = classrooms.find(c => c.id === classroomId);
  const lesson = lessons.find(l => l.id === lessonId);

  if (!classroom || !lesson) return <div className="p-8">Lesson not found.</div>;

  const classStudents = getClassroomStudents(classroom.id);

  const EditIcon = () => (
    <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors inline-block ml-1" />
  );

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: `Based on the AET levels and curriculum progress of your ${classStudents.length} students in ${classroom.name}, here are personalized recommendations for "${lesson.title}":\n\n${classStudents.slice(0, 3).map(s => 
          `**${s.name}** (${s.aetLevel}):\n- Differentiated worksheet at ${s.britishCurriculumLevel} level\n- Focus on: ${s.supportNeeds[0]}\n- Build on strength: ${s.strengths[0]}`
        ).join("\n\n")}\n\nWould you like me to generate specific worksheets or activity cards for any student?`,
      };
      setChatMessages(prev => [...prev, { role: "ai", content: responses.default }]);
    }, 1200);
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
                <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-yusr-amber" /> Resources <EditIcon /></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.resources.map((r, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{r}</li>
                  ))}
                </ul>
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
                    {lesson.aetTargets.map(t => (
                      <Badge key={t} className="bg-yusr-indigo/15 text-yusr-indigo border-0 text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><BookOpen className="h-3 w-3" /> British Curriculum</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.curriculumObjectives.map(o => (
                      <Badge key={o} variant="outline" className="text-[10px]">{o}</Badge>
                    ))}
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

      {/* AI Chatbot FAB — only for ongoing lessons */}
      {lesson.status === "ongoing" && (
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
                className="fixed bottom-24 right-6 w-96 max-h-[500px] bg-card border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
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

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px]">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/40" />
                      <p>Ask me to generate resources, differentiate materials, or suggest activities for your students.</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-3 flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Generate resources for this lesson..."
                    className="min-h-[40px] max-h-[80px] text-sm resize-none"
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                  />
                  <Button size="icon" onClick={handleSendChat} disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default LessonDetail;
