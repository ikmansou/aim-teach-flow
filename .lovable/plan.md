

# YUSR Platform Prototype

**"Because your time belongs to students, not spreadsheets."**

A SEN teacher workflow platform for Al Karamah School — designed to be inspection-safe, credible, and production-ready.

---

## Page 1: Login Page
- Clean, clinical login with email + password fields
- YUSR branding with tagline
- CTA button: **"Access your classrooms"**
- Teacher-only access feel — no social logins, no distractions
- Subtle school-appropriate color palette established here

## Page 2: Classrooms List
- Grid of classroom cards assigned to the logged-in teacher
- Each card shows: classroom name, student count, and a readiness snapshot (color-coded progress indicator)
- Clicking a card navigates to that classroom's dashboard
- Sample data: 3-4 classrooms with realistic names

## Page 3: Classroom Dashboard
- **Top section**: Overall classroom readiness level (visual gauge/progress bar)
- **Subjects panel**: List of subjects — only **English** is clickable/active; others shown but greyed out
- **Student grid**: Cards with photo, name, and AET status indicator (color dot or badge)
- Click a student → Student Profile page
- Click English → Subject Detail page
- Bright, colorful, high-density dashboard layout with clear visual hierarchy

## Page 4: Student Profile
- Student photo, full name, age, key personal info
- **AET Framework level** displayed with clear indicator
- **British Curriculum level** with progress visualization
- All fields appear editable (inline edit icons, editable form feel)
- Sample data that feels authentic (realistic SEN student context)
- Back navigation to classroom dashboard

## Page 5: Subject Detail — English
- **Lesson tracking timeline** (vertical timeline or card-based chronology)
- Each lesson entry shows: date, initial goals, activities conducted, resources used

## Page 6: lesson Detail — [lesson'sname]
- Visual mapping tags linking each lesson to **AET targets** and **British Curriculum objectives**
- All lesson data appears editable
- feedback on if each student has met the goals of the lesson 
- for ongoing lessons **AI chatbot icon** — a floating, non-intrusive button in the corner labeled "AI Pedagogical Partner"
  - Clicking opens a chat panel for generating/refining lesson resources depending on level of the class students and generate personalized resource for each student depending on his academic/AET level. 
  - Clearly optional, assistant-not-replacement positioning
  - the ai bot should generate resources for each student based on his needs

## Design System
- **Tone**: Bright, colorful, dynamic yet professional — school-approved
- **Colors**: A vibrant but structured palette (blues, teals, warm accents) — not corporate grey
- **Typography**: Accessible, clear hierarchy, readable at density
- **Layout**: Dashboard-first logic, high information density without clutter
- **Data**: All sample data realistic and authentic — real-feeling student names, AET levels, curriculum references

## Navigation & Data
- All data is hardcoded sample data (no backend needed for this prototype)
- Clear navigation hierarchy: Login → Classrooms → Dashboard → Student/Subject
- Breadcrumb navigation throughout
- Responsive and polished for demo to teachers, leadership, or inspectors

