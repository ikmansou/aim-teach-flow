import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { classrooms, getClassroomStudents, getStudentInitials } from "@/data/mockData";
import { ArrowRight, Sun, Palmtree, Bird, Waves } from "lucide-react";

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

const avatarColors = [
  "bg-yusr-coral text-white",
  "bg-yusr-teal text-white",
  "bg-yusr-amber text-white",
  "bg-yusr-indigo text-white",
  "bg-yusr-emerald text-white",
  "bg-yusr-purple text-white",
  "bg-yusr-sky text-white",
  "bg-rose-400 text-white",
];

const ClassroomsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8">
        <Breadcrumbs items={[{ label: "Classrooms" }]} />

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Your Classrooms</h1>
          <p className="text-muted-foreground mt-1">Select a classroom to view its dashboard.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {classrooms.map((classroom, i) => {
            const students = getClassroomStudents(classroom.id);
            const theme = classroomThemes[classroom.id] || classroomThemes.c1;

            return (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
              >
                <div
                  className="cursor-pointer group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(`/classroom/${classroom.id}`)}
                >
                  {/* Colorful top band */}
                  <div className={`h-28 bg-gradient-to-br ${theme.gradient} relative flex items-center justify-center`}>
                    <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-lg`}>
                      {theme.icon}
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{classroom.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{classroom.year}</p>
                    </div>

                    {/* Avatar stack */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {students.slice(0, 6).map((student, j) => (
                          <div
                            key={student.id}
                            className={`w-8 h-8 rounded-full ${avatarColors[j % avatarColors.length]} flex items-center justify-center text-[10px] font-bold ring-2 ring-card`}
                            title={student.name}
                          >
                            {getStudentInitials(student.name)}
                          </div>
                        ))}
                        {students.length > 6 && (
                          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold ring-2 ring-card">
                            +{students.length - 6}
                          </div>
                        )}
                      </div>
                      <span className="ml-3 text-xs text-muted-foreground font-medium">
                        {students.length} students
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ClassroomsPage;
