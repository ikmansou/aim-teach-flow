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
  grade: string;
  aetSkills: { label: string; color: "green" | "orange" | "blue" | "purple" | "red" }[];
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
    grade: "Year 3",
    aetSkills: [
      { label: "Managing Emotions", color: "green" },
      { label: "Relationships", color: "blue" },
      { label: "Sensory Processing", color: "red" },
      { label: "Communication", color: "purple" },
    ],
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
    grade: "Year 2",
    aetSkills: [
      { label: "Learning Through Play", color: "orange" },
      { label: "Communication", color: "purple" },
      { label: "Managing Emotions", color: "green" },
      { label: "Relationships", color: "blue" },
      { label: "Flexibility", color: "orange" },
    ],
    strengths: ["Creative expression", "Verbal storytelling", "Memory recall"],
    supportNeeds: ["Group work facilitation", "Emotional regulation support", "Clear instructions"],
  },
  "s3": {
    id: "s3",
    name: "Khalid Nasser",
    age: 10,
    photo: "khalid",
    gender: "male",
    dateOfBirth: "2016-11-05",
    guardianName: "Nora Nasser",
    guardianContact: "+971 56 345 6789",
    aetLevel: "Applying",
    aetScore: 68,
    britishCurriculumLevel: "Year 4 Expected",
    britishCurriculumScore: 65,
    notes: "Making strong progress. Enjoys collaborative learning with structured roles.",
    grade: "Year 4",
    aetSkills: [
      { label: "Relationships", color: "blue" },
      { label: "Flexibility", color: "orange" },
      { label: "Social Awareness", color: "blue" },
    ],
    strengths: ["Logical thinking", "Following routines", "Written expression"],
    supportNeeds: ["Flexibility in tasks", "Peer interaction coaching"],
  },
  "s4": {
    id: "s4",
    name: "Mariam Zahrani",
    age: 9,
    photo: "mariam",
    gender: "female",
    dateOfBirth: "2017-01-30",
    guardianName: "Hassan Zahrani",
    guardianContact: "+971 50 456 7890",
    aetLevel: "Developing",
    aetScore: 40,
    britishCurriculumLevel: "Year 3 Working Towards",
    britishCurriculumScore: 35,
    notes: "Uses AAC device for communication. Excellent with technology-based learning.",
    grade: "Year 3",
    aetSkills: [
      { label: "Communication", color: "purple" },
      { label: "Sensory Processing", color: "red" },
      { label: "Flexibility", color: "orange" },
      { label: "Social Awareness", color: "blue" },
      { label: "Managing Emotions", color: "green" },
    ],
    strengths: ["Technology skills", "Visual processing", "Determination"],
    supportNeeds: ["AAC support", "Extended processing time", "Modified worksheets"],
  },
  "s5": {
    id: "s5",
    name: "Yusuf Ibrahim",
    age: 8,
    photo: "yusuf",
    gender: "male",
    dateOfBirth: "2018-05-18",
    guardianName: "Amina Ibrahim",
    guardianContact: "+971 55 567 8901",
    aetLevel: "Extending",
    aetScore: 82,
    britishCurriculumLevel: "Year 3 Greater Depth",
    britishCurriculumScore: 78,
    notes: "High-functioning. Benefits from challenge activities and leadership roles.",
    grade: "Year 3",
    aetSkills: [
      { label: "Managing Emotions", color: "green" },
      { label: "Social Awareness", color: "blue" },
      { label: "Flexibility", color: "orange" },
      { label: "Sensory Processing", color: "red" },
    ],
    strengths: ["Advanced reading", "Self-regulation", "Mentoring peers"],
    supportNeeds: ["Social nuance guidance", "Anxiety management"],
  },
  "s6": {
    id: "s6",
    name: "Sara Al-Mansoori",
    age: 10,
    photo: "sara",
    gender: "female",
    dateOfBirth: "2016-09-12",
    guardianName: "Mohammed Al-Mansoori",
    guardianContact: "+971 56 678 9012",
    aetLevel: "Developing",
    aetScore: 42,
    britishCurriculumLevel: "Year 4 Working Towards",
    britishCurriculumScore: 40,
    notes: "Enjoys art-based activities. Responds well to positive reinforcement.",
    grade: "Year 4",
    aetSkills: [
      { label: "Managing Emotions", color: "green" },
      { label: "Communication", color: "purple" },
      { label: "Learning Through Play", color: "orange" },
    ],
    strengths: ["Artistic expression", "Fine motor skills", "Empathy"],
    supportNeeds: ["Verbal communication prompts", "Structured choices", "Calm-down strategies"],
  },
  "s7": {
    id: "s7",
    name: "Rashid Al-Blooshi",
    age: 9,
    photo: "rashid",
    gender: "male",
    dateOfBirth: "2017-06-08",
    guardianName: "Khaled Al-Blooshi",
    guardianContact: "+971 50 789 0123",
    aetLevel: "Applying",
    aetScore: 60,
    britishCurriculumLevel: "Year 3 Expected",
    britishCurriculumScore: 58,
    notes: "Enthusiastic learner. Benefits from movement breaks between tasks.",
    grade: "Year 3",
    aetSkills: [
      { label: "Learning Through Play", color: "orange" },
      { label: "Relationships", color: "blue" },
      { label: "Sensory Processing", color: "red" },
    ],
    strengths: ["Numeracy", "Hands-on learning", "Collaboration"],
    supportNeeds: ["Focus strategies", "Movement breaks", "Task chunking"],
  },
  "s8": {
    id: "s8",
    name: "Noura Al-Ketbi",
    age: 8,
    photo: "noura",
    gender: "female",
    dateOfBirth: "2018-02-25",
    guardianName: "Salem Al-Ketbi",
    guardianContact: "+971 55 890 1234",
    aetLevel: "Developing",
    aetScore: 38,
    britishCurriculumLevel: "Year 2 Greater Depth",
    britishCurriculumScore: 48,
    notes: "Quiet but observant. Excels when given time to process before responding.",
    grade: "KG 2",
    aetSkills: [
      { label: "Sensory Processing", color: "red" },
      { label: "Social Awareness", color: "blue" },
      { label: "Communication", color: "purple" },
    ],
    strengths: ["Observation skills", "Written expression", "Following instructions"],
    supportNeeds: ["Processing time", "Small group settings", "Visual cues"],
  },
};

export const classrooms: Classroom[] = [
  {
    id: "c1",
    name: "Sunrise Room",
    studentIds: ["s1", "s2", "s3", "s4", "s5", "s6"],
    readiness: 62,
    year: "Year 3-4",
  },
  {
    id: "c2",
    name: "Oasis Room",
    studentIds: ["s1", "s3", "s5", "s7", "s2", "s4"],
    readiness: 74,
    year: "Year 3-4",
  },
  {
    id: "c3",
    name: "Palm Room",
    studentIds: ["s2", "s4", "s6", "s8", "s1", "s3"],
    readiness: 48,
    year: "Year 2-3",
  },
  {
    id: "c4",
    name: "Falcon Room",
    studentIds: ["s1", "s2", "s5", "s6", "s3", "s7"],
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
  // ===== Oasis Room (c2) =====
  {
    id: "l5",
    classroomId: "c2",
    subjectId: "english",
    title: "Narrative Writing — A Day at the Souq",
    date: "2026-02-05",
    status: "completed",
    goals: ["Write a short narrative with a clear beginning, middle and end", "Use descriptive adjectives to describe settings"],
    activities: ["Souq photo walk discussion", "Story mountain planning", "Guided narrative writing"],
    resources: ["Souq photo cards", "Story mountain template", "Word bank poster"],
    aetTargets: ["Communication — expressive language", "Flexibility — adapting ideas"],
    curriculumObjectives: ["EN3-2A: Plan and write narratives", "EN3-7G: Use adjectives for description"],
    studentFeedback: { s1: { met: true, notes: "Great detail in descriptions" }, s3: { met: true, notes: "Needed sentence starters" } },
  },
  {
    id: "l6",
    classroomId: "c2",
    subjectId: "english",
    title: "Reading Comprehension — Desert Animals",
    date: "2026-02-10",
    status: "completed",
    goals: ["Retrieve key information from a non-fiction text", "Answer inference questions using evidence"],
    activities: ["Shared reading", "Highlight and annotate", "Comprehension worksheet"],
    resources: ["Desert Animals reader", "Highlighter strips", "Question cards"],
    aetTargets: ["Communication — receptive language", "Social Awareness — turn taking in discussion"],
    curriculumObjectives: ["EN3-2A: Retrieve and record information", "EN3-2B: Make inferences from text"],
    studentFeedback: { s5: { met: true, notes: "Answered all inference questions" }, s7: { met: false, notes: "Needed visual support" } },
  },
  {
    id: "l7",
    classroomId: "c2",
    subjectId: "english",
    title: "Grammar — Conjunctions & Connectives",
    date: "2026-02-14",
    status: "ongoing",
    goals: ["Use conjunctions to join clauses", "Identify connectives in sentences"],
    activities: ["Conjunction sorting game", "Sentence building with cards", "Mini whiteboard practice"],
    resources: ["Conjunction flashcards", "Sentence strips", "Interactive whiteboard slides"],
    aetTargets: ["Communication — understanding instructions", "Flexibility — trying new sentence structures"],
    curriculumObjectives: ["EN3-4G: Use conjunctions", "EN3-5G: Use connectives to link ideas"],
    studentFeedback: {},
  },
  {
    id: "l8",
    classroomId: "c2",
    subjectId: "english",
    title: "Poetry — Rhyming Patterns",
    date: "2026-02-19",
    status: "upcoming",
    goals: ["Identify rhyming words in poems", "Write a short rhyming couplet"],
    activities: ["Rhyme time listening activity", "Rhyme pair matching", "Write own couplet"],
    resources: ["Poetry anthology", "Rhyme matching cards", "Writing frame"],
    aetTargets: ["Sensory Processing — auditory discrimination", "Communication — expressive language"],
    curriculumObjectives: ["EN2-1A: Listen to and discuss poetry", "EN3-1A: Write poetry with patterns"],
    studentFeedback: {},
  },
  // ===== Palm Room (c3) =====
  {
    id: "l9",
    classroomId: "c3",
    subjectId: "english",
    title: "Phonics — CVC Words & Blending",
    date: "2026-02-04",
    status: "completed",
    goals: ["Blend CVC words independently", "Segment words into individual sounds"],
    activities: ["Sound button activity", "CVC word building with magnetic letters", "Phoneme frame writing"],
    resources: ["Magnetic letters", "Phoneme frames", "Sound mats"],
    aetTargets: ["Communication — speech sounds", "Sensory Processing — auditory skills"],
    curriculumObjectives: ["EN1-1A: Apply phonic knowledge for reading", "EN1-2A: Blend sounds in words"],
    studentFeedback: { s2: { met: true, notes: "Blended 3-letter words well" }, s4: { met: false, notes: "Needs more segmenting practice" } },
  },
  {
    id: "l10",
    classroomId: "c3",
    subjectId: "english",
    title: "Shared Reading — The Very Hungry Caterpillar",
    date: "2026-02-11",
    status: "ongoing",
    goals: ["Retell the story in sequence", "Identify key vocabulary"],
    activities: ["Story sequencing with pictures", "Vocabulary matching", "Role play retelling"],
    resources: ["Big book", "Sequencing cards", "Puppet set"],
    aetTargets: ["Communication — understanding narrative", "Relationships — group participation"],
    curriculumObjectives: ["EN1-3A: Retell familiar stories", "EN2-3A: Discuss word meanings"],
    studentFeedback: {},
  },
  {
    id: "l11",
    classroomId: "c3",
    subjectId: "english",
    title: "Handwriting — Letter Formation a-m",
    date: "2026-02-18",
    status: "upcoming",
    goals: ["Form lowercase letters a-m correctly", "Maintain correct pencil grip"],
    activities: ["Sky writing", "Sand tray practice", "Lined paper writing"],
    resources: ["Letter formation cards", "Sand trays", "Pencil grips"],
    aetTargets: ["Sensory Processing — fine motor", "Flexibility — practising new skills"],
    curriculumObjectives: ["EN1-6A: Form lowercase letters correctly", "EN1-6B: Use correct pencil grip"],
    studentFeedback: {},
  },
  // ===== Falcon Room (c4) =====
  {
    id: "l12",
    classroomId: "c4",
    subjectId: "english",
    title: "Persuasive Writing — Save the Turtles",
    date: "2026-02-06",
    status: "completed",
    goals: ["Write a persuasive paragraph with reasons", "Use emotive language to persuade"],
    activities: ["Turtle conservation video", "Persuasion toolkit brainstorm", "Guided persuasive writing"],
    resources: ["Conservation video link", "Persuasion word mat", "Writing frame"],
    aetTargets: ["Communication — expressing opinions", "Social Awareness — empathy for living things"],
    curriculumObjectives: ["EN3-3A: Write for different purposes", "EN3-7G: Use language for effect"],
    studentFeedback: { s1: { met: true, notes: "Strong emotive language used" }, s5: { met: true, notes: "Good use of because/so" } },
  },
  {
    id: "l13",
    classroomId: "c4",
    subjectId: "english",
    title: "Spelling — Common Exception Words",
    date: "2026-02-12",
    status: "ongoing",
    goals: ["Spell year 3 common exception words accurately", "Use look-cover-write-check strategy"],
    activities: ["Rainbow writing", "Spelling bingo", "Look-cover-write-check practice"],
    resources: ["Word list poster", "Bingo cards", "Practice booklets"],
    aetTargets: ["Communication — written accuracy", "Flexibility — self-correction"],
    curriculumObjectives: ["EN3-6A: Spell common exception words", "EN3-6B: Use spelling strategies"],
    studentFeedback: {},
  },
  {
    id: "l14",
    classroomId: "c4",
    subjectId: "english",
    title: "Drama & Speaking — Freeze Frames",
    date: "2026-02-20",
    status: "upcoming",
    goals: ["Use body language to convey emotions", "Speak clearly to an audience"],
    activities: ["Emotion charades warm-up", "Freeze frame scenes", "Hot seating characters"],
    resources: ["Emotion cards", "Scene prompt cards", "Reflection sheet"],
    aetTargets: ["Relationships — group work", "Communication — non-verbal expression"],
    curriculumObjectives: ["EN3-1S: Speak audibly and clearly", "EN3-5S: Use spoken language for role play"],
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
