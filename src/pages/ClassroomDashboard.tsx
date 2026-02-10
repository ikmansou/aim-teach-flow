import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  classrooms,
  subjects,
  getClassroomStudents,
  getAetBgClass,
} from "@/data/mockData";
import { BookOpen, Calculator, FlaskConical, Palette, Dumbbell, Heart, Lock, Users, Sun, Waves, Palmtree, Bird } from "lucide-react";

// Student photo imports
import omarPhoto from "@/assets/students/omar.png";
import laylaPhoto from "@/assets/students/layla.png";
import khalidPhoto from "@/assets/students/khalid.png";
import mariamPhoto from "@/assets/students/mariam.png";
import yusufPhoto from "@/assets/students/yusuf.png";
import saraPhoto from "@/assets/students/sara.png";
import rashidPhoto from "@/assets/students/rashid.png";
import nouraPhoto from "@/assets/students/noura.png";

const studentPhotos: Record<string, string> = {
  omar: omarPhoto,
  layla: laylaPhoto,
  khalid: khalidPhoto,
  mariam: mariamPhoto,
  yusuf: yusufPhoto,
  sara: saraPhoto,
  rashid: rashidPhoto,
  noura: nouraPhoto,
};

const classroomThemes: Record<string, { icon: React.ReactNode; gradient: string; iconBg: string }> = {
  c1: {
    icon: <Sun className="h-8 w-8" />,
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    iconBg: "bg-amber-100 text-amber-600",
  },
  c2: {
    icon: <Waves className="h-8 w-8" />,
    gradient: "from-cyan-400 via-teal-400 to-emerald-400",
    iconBg: "bg-teal-100 text-teal-600",
  },
  c3: {
    icon: <Palmtree className="h-8 w-8" />,
    gradient: "from-emerald-400 via-green-400 to-lime-400",
    iconBg: "bg-green-100 text-green-600",
  },
  c4: {
    icon: <Bird className="h-8 w-8" />,
    gradient: "from-indigo-400 via-purple-400 to-pink-400",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
};

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-5 w-5" />,
  Calculator: <Calculator className="h-5 w-5" />,
  Flask: <FlaskConical className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Dumbbell: <Dumbbell className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
};

const aetSkillColors: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  orange: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  red: "bg-rose-100 text-rose-700 border-rose-200",
};

const ClassroomDashboard = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();

  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return <div className="p-8">Classroom not found.</div>;

  const classStudents = getClassroomStudents(classroom.id);
  const theme = classroomThemes[classroom.id] || classroomThemes.c1;

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

        {/* Classroom Banner — matches /classrooms card style */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className={`relative rounded-2xl overflow-hidden h-28 bg-gradient-to-br ${theme.gradient} flex items-center px-8 gap-5`}>
            <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-lg shrink-0`}>
              {theme.icon}
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                {classroom.name}
              </h1>
              <p className="text-white/80 mt-0.5 text-sm font-medium">
                {classroom.year} · {classStudents.length} students
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Subjects Sidebar */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Subjects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {subjects.map(subject => {
                  const subjectColors: Record<string, string> = {
                    english: "bg-yusr-sky/10 text-yusr-sky border-yusr-sky/20",
                    maths: "bg-yusr-indigo/10 text-yusr-indigo border-yusr-indigo/20",
                    science: "bg-yusr-emerald/10 text-yusr-emerald border-yusr-emerald/20",
                    art: "bg-yusr-purple/10 text-yusr-purple border-yusr-purple/20",
                    pe: "bg-yusr-coral/10 text-yusr-coral border-yusr-coral/20",
                    pse: "bg-yusr-amber/10 text-yusr-amber border-yusr-amber/20",
                  };
                  const colorClass = subjectColors[subject.id] || "";
                    <button
                      key={subject.id}
                      onClick={() => subject.active && navigate(`/classroom/${classroom.id}/subject/${subject.id}`)}
                      disabled={!subject.active}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all text-left border ${
                        subject.active
                          ? `${colorClass} hover:shadow-sm cursor-pointer font-semibold`
                          : "text-muted-foreground/40 border-transparent cursor-not-allowed"
                      }`}
                    >
                      {iconMap[subject.icon]}
                      <span>{subject.name}</span>
                      {!subject.active && <Lock className="h-3.5 w-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Student ID Cards Grid */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Students</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {classStudents.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05 }}
                >
                  <div
                    className="cursor-pointer group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                    onClick={() => navigate(`/classroom/${classroom.id}/student/${student.id}`)}
                  >
                    {/* Colored top strip based on AET level */}
                    <div className={`h-2 ${getAetBgClass(student.aetLevel)}`} />

                    <div className="flex items-start gap-4 p-4">
                      {/* Photo */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-muted shadow-sm shrink-0">
                        <img
                          src={studentPhotos[student.photo] || ""}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                        <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <p className="font-display font-bold text-foreground text-sm truncate">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">Age {student.age} · {student.grade}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                          {student.aetSkills.map((skill, idx) => (
                            <Badge key={idx} className={`${aetSkillColors[skill.color]} text-[9px] px-1.5 py-0 h-[18px] font-medium border`}>
                              {skill.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
