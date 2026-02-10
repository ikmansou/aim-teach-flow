import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClassroomsPage from "./pages/ClassroomsPage";
import ClassroomDashboard from "./pages/ClassroomDashboard";
import StudentProfile from "./pages/StudentProfile";
import SubjectDetail from "./pages/SubjectDetail";
import LessonDetail from "./pages/LessonDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/classroom/:classroomId" element={<ClassroomDashboard />} />
          <Route path="/classroom/:classroomId/student/:studentId" element={<StudentProfile />} />
          <Route path="/classroom/:classroomId/subject/:subjectId" element={<SubjectDetail />} />
          <Route path="/classroom/:classroomId/subject/:subjectId/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
