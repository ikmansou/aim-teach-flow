import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { teacher } from "@/data/mockData";

export function PageHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/classrooms" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-extrabold text-lg">Y</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">YUSR</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{teacher.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
