import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";
import type { StudentAetDetail, AetCategory, AetSubcategory, AetLearningIntention } from "@/data/aetDetails";

const categoryColors: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  blue: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", headerBg: "bg-sky-100" },
  green: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", headerBg: "bg-emerald-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", headerBg: "bg-purple-100" },
  orange: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", headerBg: "bg-amber-100" },
  red: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", headerBg: "bg-rose-100" },
};

const gradeOptions = ["N/A", "Not Yet", "Developing", "Established", "Generalised"];
const priorityOptions = ["", "N", "Y"];

const gradeColors: Record<string, string> = {
  "N/A": "text-muted-foreground",
  "Not Yet": "text-rose-600 bg-rose-50",
  "Developing": "text-amber-600 bg-amber-50",
  "Established": "text-sky-600 bg-sky-50",
  "Generalised": "text-emerald-600 bg-emerald-50",
};

interface AetDetailTableProps {
  aetDetails: StudentAetDetail;
  onUpdate: (details: StudentAetDetail) => void;
}

const GradeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-[11px] font-medium rounded-md px-1.5 py-1 border border-transparent hover:border-border focus:border-primary focus:outline-none cursor-pointer transition-colors w-full text-center ${gradeColors[value] || ""}`}
  >
    {gradeOptions.map((g) => (
      <option key={g} value={g}>{g}</option>
    ))}
  </select>
);

const PrioritySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-[11px] font-medium rounded-md px-1 py-1 border border-transparent hover:border-border focus:border-primary focus:outline-none cursor-pointer transition-colors w-full text-center"
  >
    {priorityOptions.map((p) => (
      <option key={p} value={p}>{p || "—"}</option>
    ))}
  </select>
);

const SubcategorySection = ({
  subcategory,
  onItemUpdate,
}: {
  subcategory: AetSubcategory;
  onItemUpdate: (itemId: string, field: keyof AetLearningIntention, value: string) => void;
}) => {
  return (
    <div className="mb-2">
      <div className="bg-muted/50 px-3 py-1.5 text-xs font-bold text-foreground">
        {subcategory.title}
      </div>
      {subcategory.items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_68px_68px_68px_68px_44px] items-center border-b border-border/40 hover:bg-muted/20 transition-colors"
        >
          <div className="px-3 py-1.5 text-[11px] text-foreground leading-tight">
            {item.text}
          </div>
          <GradeSelect value={item.baseline} onChange={(v) => onItemUpdate(item.id, "baseline", v)} />
          <GradeSelect value={item.term1} onChange={(v) => onItemUpdate(item.id, "term1", v)} />
          <GradeSelect value={item.term2} onChange={(v) => onItemUpdate(item.id, "term2", v)} />
          <GradeSelect value={item.term3} onChange={(v) => onItemUpdate(item.id, "term3", v)} />
          <PrioritySelect value={item.priority} onChange={(v) => onItemUpdate(item.id, "priority", v)} />
        </div>
      ))}
    </div>
  );
};

const CategorySection = ({
  category,
  onItemUpdate,
}: {
  category: AetCategory;
  onItemUpdate: (subcatId: string, itemId: string, field: keyof AetLearningIntention, value: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const colors = categoryColors[category.color] || categoryColors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${colors.border} overflow-hidden mb-4`}
    >
      {/* Category Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 ${colors.headerBg} ${colors.text} font-bold text-sm transition-colors hover:brightness-95`}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {category.name}
        <Badge className={`ml-auto ${colors.bg} ${colors.text} border ${colors.border} text-[10px] px-2`}>
          {category.subcategories.reduce((n, s) => n + s.items.length, 0)} items
        </Badge>
      </button>

      {open && (
        <div className={`${colors.bg}`}>
          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_68px_68px_68px_68px_44px] items-center border-b border-border/60 px-0">
            <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Learning Intention</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Base</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">T1</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">T2</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">T3</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Pri</div>
          </div>

          {category.subcategories.map((subcat) => (
            <SubcategorySection
              key={subcat.id}
              subcategory={subcat}
              onItemUpdate={(itemId, field, value) => onItemUpdate(subcat.id, itemId, field, value)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const AetDetailTable = ({ aetDetails, onUpdate }: AetDetailTableProps) => {
  const handleItemUpdate = (
    categoryId: string,
    subcatId: string,
    itemId: string,
    field: keyof AetLearningIntention,
    value: string
  ) => {
    const updated = {
      ...aetDetails,
      categories: aetDetails.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === subcatId
                  ? {
                      ...sub,
                      items: sub.items.map((item) =>
                        item.id === itemId ? { ...item, [field]: value } : item
                      ),
                    }
                  : sub
              ),
            }
          : cat
      ),
    };
    onUpdate(updated);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" /> AET Detailed Assessment
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Click any grade to update. Grades: Not Yet → Developing → Established → Generalised
        </p>
      </CardHeader>
      <CardContent className="space-y-2 px-3 md:px-6">
        {/* Grade Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {gradeOptions.filter(g => g !== "N/A").map((g) => (
            <span key={g} className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${gradeColors[g]}`}>
              {g}
            </span>
          ))}
        </div>

        {aetDetails.categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            onItemUpdate={(subcatId, itemId, field, value) =>
              handleItemUpdate(category.id, subcatId, itemId, field, value)
            }
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AetDetailTable;
