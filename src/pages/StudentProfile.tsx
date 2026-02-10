import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { students, classrooms, getStudentInitials, getAetBgClass } from "@/data/mockData";
import { Pencil, Calendar, Phone, User2, Brain, BookOpen } from "lucide-react";

const StudentProfile = () => {
  const { classroomId, studentId } = useParams();
  const student = studentId ? students[studentId] : null;
  const classroom = classrooms.find(c => c.id === classroomId);

  if (!student || !classroom) return <div className="p-8">Student not found.</div>;

  const EditIcon = () => (
    <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Classrooms", href: "/classrooms" },
            { label: classroom.name, href: `/classroom/${classroom.id}` },
            { label: student.name },
          ]}
        />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <Card className="mb-6">
            <CardContent className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="h-20 w-20 bg-yusr-sky text-primary-foreground text-2xl">
                <AvatarFallback className="bg-yusr-sky text-primary-foreground text-2xl font-bold">
                  {getStudentInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">{student.name}</h1>
                  <EditIcon />
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Age {student.age} · {student.dateOfBirth}</span>
                  <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" /> {student.gender === "male" ? "Male" : "Female"}</span>
                </div>
              </div>
              <Badge className={`${getAetBgClass(student.aetLevel)} text-primary-foreground text-sm px-3 py-1`}>
                {student.aetLevel}
              </Badge>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <EditIcon />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Guardian</span><span className="font-medium">{student.guardianName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-medium flex items-center gap-1"><Phone className="h-3 w-3" />{student.guardianContact}</span></div>
                <div className="pt-2"><span className="text-muted-foreground text-xs">Notes</span><p className="mt-1 text-foreground">{student.notes}</p></div>
              </CardContent>
            </Card>

            {/* AET Framework */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> AET Framework</CardTitle>
                  <EditIcon />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-bold">{student.aetLevel}</span>
                  </div>
                  <Progress value={student.aetScore} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Score: {student.aetScore}/100</p>
                </div>
              </CardContent>
            </Card>

            {/* British Curriculum */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-secondary" /> British Curriculum</CardTitle>
                  <EditIcon />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-bold">{student.britishCurriculumLevel}</span>
                  </div>
                  <Progress value={student.britishCurriculumScore} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">Score: {student.britishCurriculumScore}/100</p>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Needs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Strengths & Support Needs</CardTitle>
                  <EditIcon />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.strengths.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Support Needs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.supportNeeds.map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentProfile;
