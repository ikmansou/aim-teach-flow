import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { classrooms, getClassroomLessons, getStatusColor } from "@/data/mockData";
import { BookOpen, Calendar, ChevronRight, Target } from "lucide-react";

const SubjectDetail = () => {
  const { classroomId, subjectId } = useParams();
  const navigate = useNavigate();
  const classroom = classrooms.find(c => c.id === classroomId);

  if (!classroom) return <div className="p-8">Classroom not found.</div>;

  const lessons = getClassroomLessons(classroom.id, subjectId);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-8 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Classrooms", href: "/classrooms" },
            { label: classroom.name, href: `/classroom/${classroom.id}` },
            { label: "English" },
          ]}
        />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">English</h1>
              <p className="text-muted-foreground text-sm">{classroom.name} · Lesson Timeline</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-6">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative pl-12"
              >
                <div className={`absolute left-2.5 top-5 h-3.5 w-3.5 rounded-full border-2 border-card ${getStatusColor(lesson.status)}`} />

                <Card
                  className="cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
                  onClick={() => navigate(`/classroom/${classroom.id}/subject/${subjectId}/lesson/${lesson.id}`)}
                >
                  <CardContent className="py-4 px-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(lesson.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={lesson.status === "completed" ? "default" : lesson.status === "ongoing" ? "secondary" : "outline"} className="text-[10px] capitalize">
                          {lesson.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {lesson.goals.length} goals</span>
                      <span>{lesson.activities.length} activities</span>
                      <span>{lesson.resources.length} resources</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectDetail;
