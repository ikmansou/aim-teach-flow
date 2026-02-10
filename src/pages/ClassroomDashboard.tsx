import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  classrooms,
  subjects,
  getClassroomStudents,
  getStudentInitials,
  getAetBgClass,
} from "@/data/mockData";
import { BookOpen, Calculator, FlaskConical, Palette, Dumbbell, Heart, Lock, Users, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-4 w-4" />,
  Calculator: <Calculator className="h-4 w-4" />,
  Flask: <FlaskConical className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
  Dumbbell: <Dumbbell className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
};

const avatarColors = [
  "bg-yusr-sky text-primary-foreground",
  "bg-yusr-teal text-primary-foreground",
  "bg-yusr-amber text-accent-foreground",
  "bg-yusr-coral text-primary-foreground",
  "bg-yusr-indigo text-primary-foreground",
  "bg-yusr-purple text-primary-foreground",
];

const ClassroomDashboard = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return <div className="p-8">Classroom not found.</div>;

  const classStudents = getClassroomStudents(classroom.id);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8">
        <Breadcrumbs
          items={[
            { label: "Classrooms", href: "/classrooms" },
            { label: classroom.name },
          ]}
        />

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">{classroom.name}</h1>
          <p className="text-muted-foreground mt-1">{classroom.year} · {classStudents.length} students</p>
        </div>

        {/* Readiness Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-card to-muted/30">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground font-medium">Overall Classroom Readiness</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Progress value={classroom.readiness} className="flex-1 h-3" />
                    <span className="text-2xl font-bold text-foreground">{classroom.readiness}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Subjects Panel */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => subject.active && navigate(`/classroom/${classroom.id}/subject/${subject.id}`)}
                    disabled={!subject.active}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                      subject.active
                        ? "hover:bg-primary/10 text-foreground cursor-pointer font-medium"
                        : "text-muted-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    {iconMap[subject.icon]}
                    <span>{subject.name}</span>
                    {!subject.active && <Lock className="h-3 w-3 ml-auto" />}
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Students</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {classStudents.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
                    onClick={() => navigate(`/classroom/${classroom.id}/student/${student.id}`)}
                  >
                    <CardContent className="py-4 px-4 flex items-center gap-4">
                      <Avatar className={`h-12 w-12 ${avatarColors[i % avatarColors.length]}`}>
                        <AvatarFallback className={avatarColors[i % avatarColors.length]}>
                          {getStudentInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Age {student.age}</p>
                      </div>
                      <Badge className={`${getAetBgClass(student.aetLevel)} text-primary-foreground text-[10px] px-2`}>
                        {student.aetLevel}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassroomDashboard;
