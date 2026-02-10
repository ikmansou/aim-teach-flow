import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { students, classrooms, getAetBgClass } from "@/data/mockData";
import { getStudentAetDetails } from "@/data/aetDetails";
import type { StudentAetDetail } from "@/data/aetDetails";
import AetDetailTable from "@/components/AetDetailTable";
import { Calendar, Phone, User2, BookOpen, Shield, Sparkles, ArrowLeft, Pencil, Check, X } from "lucide-react";

import omarPhoto from "@/assets/students/omar.png";
import laylaPhoto from "@/assets/students/layla.png";
import khalidPhoto from "@/assets/students/khalid.png";
import mariamPhoto from "@/assets/students/mariam.png";
import yusufPhoto from "@/assets/students/yusuf.png";
import saraPhoto from "@/assets/students/sara.png";
import rashidPhoto from "@/assets/students/rashid.png";
import nouraPhoto from "@/assets/students/noura.png";

const studentPhotos: Record<string, string> = {
  omar: omarPhoto, layla: laylaPhoto, khalid: khalidPhoto, mariam: mariamPhoto,
  yusuf: yusufPhoto, sara: saraPhoto, rashid: rashidPhoto, noura: nouraPhoto,
};

const aetSkillColors: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  orange: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  red: "bg-rose-100 text-rose-700 border-rose-200",
};

const classroomGradients: Record<string, string> = {
  c1: "from-amber-400 via-orange-400 to-rose-400",
  c2: "from-cyan-400 via-teal-400 to-emerald-400",
  c3: "from-emerald-400 via-green-400 to-lime-400",
  c4: "from-indigo-400 via-purple-400 to-pink-400",
};

// Editable text field component
const EditableField = ({ value, onSave, label, type = "text" }: {
  value: string;
  onSave: (v: string) => void;
  label: string;
  type?: "text" | "textarea";
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <div className="group flex items-start gap-1 cursor-pointer" onClick={() => { setDraft(value); setEditing(true); }}>
        <span className="flex-1">{value}</span>
        <Pencil className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-1">
      {type === "textarea" ? (
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="text-sm min-h-[60px]" autoFocus />
      ) : (
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="text-sm h-8" autoFocus />
      )}
      <button onClick={() => { onSave(draft); setEditing(false); }} className="text-emerald-600 hover:text-emerald-700 p-1"><Check className="h-3.5 w-3.5" /></button>
      <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-destructive p-1"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
};

const StudentProfile = () => {
  const { classroomId, studentId } = useParams();
  const navigate = useNavigate();
  const studentData = studentId ? students[studentId] : null;
  const classroom = classrooms.find(c => c.id === classroomId);

  // Local editable state
  const [student, setStudent] = useState(() => studentData ? { ...studentData } : null);
  const [aetDetails, setAetDetails] = useState<StudentAetDetail>(() =>
    getStudentAetDetails(studentId || "s1")
  );

  if (!student || !classroom) return <div className="p-8">Student not found.</div>;

  const gradient = classroomGradients[classroom.id] || classroomGradients.c1;

  const updateField = (field: string, value: string) => {
    setStudent((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8 max-w-5xl">
        <Breadcrumbs
          items={[
            { label: "Classrooms", href: "/classrooms" },
            { label: classroom.name, href: `/classroom/${classroom.id}` },
            { label: student.name },
          ]}
        />

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} p-6 md:p-8 mb-8`}>
            <button
              onClick={() => navigate(`/classroom/${classroom.id}`)}
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-xl p-2 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-xl shrink-0">
                <img src={studentPhotos[student.photo] || ""} alt={student.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                  {student.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Age {student.age}</span>
                  <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" /> {student.grade}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge className={`${getAetBgClass(student.aetLevel)} text-primary-foreground text-xs px-3 py-0.5 shadow-md`}>
                    AET: {student.aetLevel}
                  </Badge>
                  {student.aetSkills.map((skill, idx) => (
                    <Badge key={idx} className={`${aetSkillColors[skill.color]} text-[10px] px-2 py-0.5 border font-medium`}>
                      {skill.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User2 className="h-4 w-4 text-yusr-indigo" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground shrink-0 mr-4">Guardian</span>
                  <EditableField value={student.guardianName} onSave={(v) => updateField("guardianName", v)} label="Guardian" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground shrink-0 mr-4 flex items-center gap-1"><Phone className="h-3 w-3" />Contact</span>
                  <EditableField value={student.guardianContact} onSave={(v) => updateField("guardianContact", v)} label="Contact" />
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground shrink-0 mr-4">DOB</span>
                  <EditableField value={student.dateOfBirth} onSave={(v) => updateField("dateOfBirth", v)} label="DOB" />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium">{student.gender === "male" ? "Male ♂" : "Female ♀"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-yusr-sky" /> Teacher Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableField value={student.notes} onSave={(v) => updateField("notes", v)} label="Notes" type="textarea" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yusr-amber" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.strengths.map(s => (
                    <Badge key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Needs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yusr-coral" /> Support Needs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.supportNeeds.map(s => (
                    <Badge key={s} variant="outline" className="text-xs px-2.5 py-1 rounded-lg font-medium border-border">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AET Detail Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <AetDetailTable aetDetails={aetDetails} onUpdate={setAetDetails} />
        </motion.div>
      </main>
    </div>
  );
};

export default StudentProfile;
