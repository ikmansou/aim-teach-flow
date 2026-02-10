export interface Student {
  id: string;
  name: string;
  age: number;
  photo: string;
  gender: "male" | "female";
  dateOfBirth: string;
  guardianName: string;
  guardianContact: string;
  aetLevel: "Exploring" | "Developing" | "Applying" | "Extending";
  aetScore: number;
  britishCurriculumLevel: string;
  britishCurriculumScore: number;
  notes: string;
  strengths: string[];
  supportNeeds: string[];
}

export interface Classroom {
  id: string;
  name: string;
  studentIds: string[];
  readiness: number;
  year: string;
}

export interface Lesson {
  id: string;
  classroomId: string;
  subjectId: string;
  title: string;
  date: string;
  status: "completed" | "ongoing" | "upcoming";
  goals: string[];
  activities: string[];
  resources: string[];
  aetTargets: string[];
  curriculumObjectives: string[];
  studentFeedback: Record<string, { met: boolean; notes: string }>;
}

export interface Subject {
  id: string;
  name: string;
  active: boolean;
  icon: string;
}

export const subjects: Subject[] = [
  { id: "english", name: "English", active: true, icon: "BookOpen" },
  { id: "maths", name: "Mathematics", active: false, icon: "Calculator" },
  { id: "science", name: "Science", active: false, icon: "Flask" },
  { id: "art", name: "Art & Design", active: false, icon: "Palette" },
  { id: "pe", name: "Physical Education", active: false, icon: "Dumbbell" },
  { id: "pse", name: "Personal & Social", active: false, icon: "Heart" },
];

export const students: Record<string, Student> = {
  "s1": {
    id: "s1",
    name: "Omar Al-Rashid",
    age: 9,
    photo: "omar",
    gender: "male",
    dateOfBirth: "2017-03-14",
    guardianName: "Fatima Al-Rashid",
    guardianContact: "+971 50 123 4567",
    aetLevel: "Developing",
    aetScore: 45,
    britishCurriculumLevel: "Year 3 Working Towards",
    britishCurriculumScore: 38,
    notes: "Responds well to visual schedules. Prefers quiet reading corner for independent work.",
    strengths: ["Visual learning", "Pattern recognition", "Reading comprehension"],
    supportNeeds: ["Social interaction prompts", "Transition support", "Sensory breaks"],
  },
  "s2": {
    id: "s2",
    name: "Layla Haddad",
    age: 8,
    photo: "layla",
    gender: "female",
    dateOfBirth: "2018-07-22",
    guardianName: "Ahmad Haddad",
    guardianContact: "+971 55 234 5678",
    aetLevel: "Exploring",
    aetScore: 28,
    britishCurriculumLevel: "Year 2 Expected",
    britishCurriculumScore: 52,
    notes: "Benefits from one-to-one instruction. Strong interest in storytelling.",
    strengths: ["Creative expression", "Verbal storytelling", "Memory recall"],
    supportNeeds: ["Group work facilitation", "Emotional regulation support", "Clear instructions"],
  },
  "s3": {
    id: "s3",
    name: "Khalid Nasser",
    age: 10,
    photo: "",
    gender: "male",
    dateOfBirth: "2016-11-05",
    guardianName: "Nora Nasser",
    guardianContact: "+971 56 345 6789",
    aetLevel: "Applying",
    aetScore: 68,
    britishCurriculumLevel: "Year 4 Expected",
    britishCurriculumScore: 65,
    notes: "Making strong progress. Enjoys collaborative learning with structured roles.",
    strengths: ["Logical thinking", "Following routines", "Written expression"],
    supportNeeds: ["Flexibility in tasks", "Peer interaction coaching"],
  },
  "s4": {
    id: "s4",
    name: "Mariam Zahrani",
    age: 9,
    photo: "",
    gender: "female",
    dateOfBirth: "2017-01-30",
    guardianName: "Hassan Zahrani",
    guardianContact: "+971 50 456 7890",
    aetLevel: "Developing",
    aetScore: 40,
    britishCurriculumLevel: "Year 3 Working Towards",
    britishCurriculumScore: 35,
    notes: "Uses AAC device for communication. Excellent with technology-based learning.",
    strengths: ["Technology skills", "Visual processing", "Determination"],
    supportNeeds: ["AAC support", "Extended processing time", "Modified worksheets"],
  },
  "s5": {
    id: "s5",
    name: "Yusuf Ibrahim",
    age: 8,
    photo: "",
    gender: "male",
    dateOfBirth: "2018-05-18",
    guardianName: "Amina Ibrahim",
    guardianContact: "+971 55 567 8901",
    aetLevel: "Extending",
    aetScore: 82,
    britishCurriculumLevel: "Year 3 Greater Depth",
    britishCurriculumScore: 78,
    notes: "High-functioning. Benefits from challenge activities and leadership roles.",
    strengths: ["Advanced reading", "Self-regulation", "Mentoring peers"],
    supportNeeds: ["Social nuance guidance", "Anxiety management"],
  },
  "s6": {
    id: "s6",
    name: "Sara Al-Mansoori",
    age: 10,
    photo: "",
    gender: "female",
    dateOfBirth: "2016-09-12",
    guardianName: "Mohammed Al-Mansoori",
    guardianContact: "+971 56 678 9012",
    aetLevel: "Developing",
    aetScore: 42,
    britishCurriculumLevel: "Year 4 Working Towards",
    britishCurriculumScore: 40,
    notes: "Enjoys art-based activities. Responds well to positive reinforcement.",
    strengths: ["Artistic expression", "Fine motor skills", "Empathy"],
    supportNeeds: ["Verbal communication prompts", "Structured choices", "Calm-down strategies"],
  },
  "s7": {
    id: "s7",
    name: "Rashid Al-Blooshi",
    age: 9,
    photo: "",
    gender: "male",
    dateOfBirth: "2017-06-08",
    guardianName: "Khaled Al-Blooshi",
    guardianContact: "+971 50 789 0123",
    aetLevel: "Applying",
    aetScore: 60,
    britishCurriculumLevel: "Year 3 Expected",
    britishCurriculumScore: 58,
    notes: "Enthusiastic learner. Benefits from movement breaks between tasks.",
    strengths: ["Numeracy", "Hands-on learning", "Collaboration"],
    supportNeeds: ["Focus strategies", "Movement breaks", "Task chunking"],
  },
  "s8": {
    id: "s8",
    name: "Noura Al-Ketbi",
    age: 8,
    photo: "",
    gender: "female",
    dateOfBirth: "2018-02-25",
    guardianName: "Salem Al-Ketbi",
    guardianContact: "+971 55 890 1234",
    aetLevel: "Developing",
    aetScore: 38,
    britishCurriculumLevel: "Year 2 Greater Depth",
    britishCurriculumScore: 48,
    notes: "Quiet but observant. Excels when given time to process before responding.",
    strengths: ["Observation skills", "Written expression", "Following instructions"],
    supportNeeds: ["Processing time", "Small group settings", "Visual cues"],
  },
};

export const classrooms: Classroom[] = [
  {
    id: "c1",
    name: "Sunrise Room",
    studentIds: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"],
    readiness: 62,
    year: "Year 3-4",
  },
  {
    id: "c2",
    name: "Oasis Room",
    studentIds: ["s1", "s3", "s5", "s7", "s2", "s4", "s6", "s8"],
    readiness: 74,
    year: "Year 3-4",
  },
  {
    id: "c3",
    name: "Palm Room",
    studentIds: ["s2", "s4", "s6", "s8", "s1", "s3", "s5", "s7"],
    readiness: 48,
    year: "Year 2-3",
  },
  {
    id: "c4",
    name: "Falcon Room",
    studentIds: ["s1", "s2", "s5", "s6", "s3", "s4", "s7", "s8"],
    readiness: 55,
    year: "Year 3",
  },
];

export const lessons: Lesson[] = [
  {
    id: "l1",
    classroomId: "c1",
    subjectId: "english",
    title: "Descriptive Writing — My Favourite Place",
    date: "2026-02-03",
    status: "completed",
    goals: [
      "Use adjectives to describe a setting",
      "Write 3-5 sentences using a visual prompt",
      "Identify and use sensory language",
    ],
    activities: [
      "Whole-class picture prompt discussion",
      "Adjective sorting activity (visual cards)",
      "Independent writing with scaffolded worksheet",
      "Peer sharing in guided pairs",
    ],
    resources: [
      "Visual prompt cards — beach & desert scenes",
      "Adjective word bank (differentiated)",
      "Scaffolded writing frame (3 levels)",
    ],
    aetTargets: [
      "AET Social Communication: Initiating interaction with peers",
      "AET Flexibility: Accepting new activity structure",
    ],
    curriculumObjectives: [
      "EN3-2A: Compose and rehearse sentences orally",
      "EN3-7G: Use expanded noun phrases to describe",
    ],
    studentFeedback: {
      "s1": { met: true, notes: "Used 4 adjectives independently. Needed prompt for peer sharing." },
      "s2": { met: true, notes: "Excellent verbal description. Written output needed support." },
      "s3": { met: true, notes: "Completed all tasks. Extended his sentences beyond the scaffold." },
      "s4": { met: false, notes: "Engaged with visual cards. Written output limited — used AAC to express ideas." },
      "s5": { met: true, notes: "Wrote a full paragraph. Helped Layla during peer work." },
      "s6": { met: true, notes: "Drew illustrations alongside writing. Good use of colour adjectives." },
    },
  },
  {
    id: "l2",
    classroomId: "c1",
    subjectId: "english",
    title: "Reading Comprehension — The Lost Kitten",
    date: "2026-02-05",
    status: "completed",
    goals: [
      "Answer retrieval questions from a short text",
      "Identify the main character and setting",
      "Make a simple prediction about the story",
    ],
    activities: [
      "Shared reading with visual text display",
      "Character identification with picture cards",
      "Question-answer matching activity",
      "Prediction drawing activity",
    ],
    resources: [
      "Adapted text — 'The Lost Kitten' (3 reading levels)",
      "Character & setting picture cards",
      "Comprehension question strips",
    ],
    aetTargets: [
      "AET Emotional Understanding: Identifying character feelings",
      "AET Social Communication: Responding to questions",
    ],
    curriculumObjectives: [
      "EN2-1A: Read age-appropriate texts with fluency",
      "EN2-2A: Answer questions and make inferences",
    ],
    studentFeedback: {
      "s1": { met: true, notes: "Answered all retrieval questions. Made a thoughtful prediction." },
      "s2": { met: true, notes: "Identified characters with support. Drew a detailed prediction." },
      "s3": { met: true, notes: "Read independently. Answered inference questions well." },
      "s4": { met: true, notes: "Used picture cards effectively to answer. Good engagement." },
      "s5": { met: true, notes: "Read fluently. Helped others with vocabulary." },
      "s6": { met: false, notes: "Found text challenging. Engaged better with picture-based questions." },
    },
  },
  {
    id: "l3",
    classroomId: "c1",
    subjectId: "english",
    title: "Phonics & Spelling — Long Vowel Sounds",
    date: "2026-02-07",
    status: "ongoing",
    goals: [
      "Recognise and produce long vowel sounds (a_e, i_e, o_e)",
      "Sort words by vowel pattern",
      "Spell 5 words using long vowel patterns",
    ],
    activities: [
      "Sound-action warm-up",
      "Interactive whiteboard vowel sorting",
      "Word building with magnetic letters",
      "Spelling quiz with visual support",
    ],
    resources: [
      "Phonics sound mat (long vowels)",
      "Magnetic letter sets",
      "Interactive whiteboard slides",
      "Differentiated spelling lists (3 tiers)",
    ],
    aetTargets: [
      "AET Sensory Processing: Managing auditory input",
      "AET Flexibility: Transitioning between activities",
    ],
    curriculumObjectives: [
      "EN1-4A: Apply phonic knowledge for spelling",
      "EN2-3A: Read words with common spelling patterns",
    ],
    studentFeedback: {
      "s1": { met: true, notes: "Good sound recognition. Spelt 4/5 words correctly." },
      "s2": { met: false, notes: "Needs more practice with o_e pattern. Enjoyed magnetic letters." },
      "s3": { met: true, notes: "Completed all tiers. Very confident with long vowels." },
      "s4": { met: false, notes: "Participated in sorting. Spelling needs further support." },
      "s5": { met: true, notes: "Perfect spelling score. Created additional words." },
      "s6": { met: true, notes: "Improved from last session. Responded well to visual support." },
    },
  },
  {
    id: "l4",
    classroomId: "c1",
    subjectId: "english",
    title: "Speaking & Listening — Show and Tell",
    date: "2026-02-10",
    status: "upcoming",
    goals: [
      "Present a personal object to the class",
      "Speak in full sentences with support",
      "Listen and ask one question to a peer",
    ],
    activities: [
      "Teacher modelling with personal object",
      "Structured speaking frame practice",
      "Individual presentations (2 mins each)",
      "Guided question-asking practice",
    ],
    resources: [
      "Speaking frame visual cards",
      "Question starter strips",
      "Timer with visual countdown",
      "Reward stickers for participation",
    ],
    aetTargets: [
      "AET Social Communication: Speaking to a group",
      "AET Social Interaction: Listening and responding to peers",
    ],
    curriculumObjectives: [
      "EN1-1A: Listen and respond appropriately",
      "EN1-2A: Speak clearly and convey ideas confidently",
    ],
    studentFeedback: {},
  },
];

export const teacher = {
  name: "Ms. Nadia Al-Hashemi",
  email: "nadia.alhashemi@alkaramah.ae",
  role: "SEN Class Teacher",
  school: "Al Karamah School",
};

export function getAetColor(level: Student["aetLevel"]): string {
  switch (level) {
    case "Exploring": return "hsl(var(--yusr-coral))";
    case "Developing": return "hsl(var(--yusr-amber))";
    case "Applying": return "hsl(var(--yusr-teal))";
    case "Extending": return "hsl(var(--yusr-emerald))";
  }
}

export function getAetBgClass(level: Student["aetLevel"]): string {
  switch (level) {
    case "Exploring": return "bg-yusr-coral";
    case "Developing": return "bg-yusr-amber";
    case "Applying": return "bg-yusr-teal";
    case "Extending": return "bg-yusr-emerald";
  }
}

export function getStudentInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

export function getClassroomStudents(classroomId: string): Student[] {
  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return [];
  return classroom.studentIds.map(id => students[id]).filter(Boolean);
}

export function getClassroomLessons(classroomId: string, subjectId?: string): Lesson[] {
  return lessons.filter(l => l.classroomId === classroomId && (!subjectId || l.subjectId === subjectId));
}

export function getStatusColor(status: Lesson["status"]): string {
  switch (status) {
    case "completed": return "bg-yusr-emerald";
    case "ongoing": return "bg-yusr-sky";
    case "upcoming": return "bg-muted";
  }
}
