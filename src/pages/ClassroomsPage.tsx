import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { classrooms, getClassroomStudents } from "@/data/mockData";
import { Users, ArrowRight } from "lucide-react";

const ClassroomsPage = () => {
  const navigate = useNavigate();

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 70) return "bg-yusr-emerald";
    if (readiness >= 50) return "bg-yusr-amber";
    return "bg-yusr-coral";
  };

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
            const studentCount = getClassroomStudents(classroom.id).length;
            return (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
                  onClick={() => navigate(`/classroom/${classroom.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">{classroom.name}</CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground">{classroom.year}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{studentCount} students</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Readiness</span>
                        <span className="font-semibold text-foreground">{classroom.readiness}%</span>
                      </div>
                      <Progress value={classroom.readiness} className={`h-2 [&>div]:${getReadinessColor(classroom.readiness)}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ClassroomsPage;
