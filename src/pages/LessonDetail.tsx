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

    </div>
  );
};

export default LessonDetail;
