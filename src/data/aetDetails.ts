export interface AetLearningIntention {
  id: string;
  text: string;
  baseline: string;
  term1: string;
  term2: string;
  term3: string;
  priority: string;
}

export interface AetSubcategory {
  id: string;
  title: string;
  items: AetLearningIntention[];
}

export interface AetCategory {
  id: string;
  name: string;
  color: string; // green, orange, blue, purple, red
  subcategories: AetSubcategory[];
}

export interface StudentAetDetail {
  studentId: string;
  categories: AetCategory[];
}

const defaultGrade = "N/A";

export function createStudentAetDetails(studentId: string): StudentAetDetail {
  return {
    studentId,
    categories: [
      {
        id: "social-communication",
        name: "Social Communication",
        color: "blue",
        subcategories: [
          {
            id: "listening-understanding",
            title: "1. Listening and understanding",
            items: [
              {
                id: "sc-1-1", text: "1.1 Shows evidence of 'active listening'", ...termDefaults(),
              },
              {
                id: "sc-1-1a", text: "Looks/turns towards person who is communicating", ...termDefaults(),
              },
              {
                id: "sc-1-1b", text: "Indicates engagement through facial expression/body language", ...termDefaults(),
              },
              {
                id: "sc-1-1c", text: "Indicates interest or agreement using gesture/vocalisation", ...termDefaults(),
              },
              {
                id: "sc-1-1d", text: "Indicates when they do not understand something they have heard", ...termDefaults(),
              },
              {
                id: "sc-1-1e", text: "Makes relevant comments in response to what they have heard", ...termDefaults(),
              },
            ],
          },
          {
            id: "shares-attention",
            title: "1.2 Shares another's attention focus",
            items: [
              {
                id: "sc-1-2a", text: "Responds to adult's bid to attract their attention", ...termDefaults(),
              },
              {
                id: "sc-1-2b", text: "Follows close point of communication partner", ...termDefaults(),
              },
              {
                id: "sc-1-2c", text: "Follows distance point of communication partner", ...termDefaults(),
              },
              {
                id: "sc-1-2d", text: "Shows interest in focus of another's attention", ...termDefaults(),
              },
              {
                id: "sc-1-2e", text: "Follows another's gaze", ...termDefaults(),
              },
            ],
          },
          {
            id: "responds-greetings",
            title: "1.3 Responds to greetings/being addressed",
            items: [
              {
                id: "sc-1-3a", text: "Responds to own name", ...termDefaults(),
              },
              {
                id: "sc-1-3b", text: "Responds to greetings from familiar adults", ...termDefaults(),
              },
              {
                id: "sc-1-3c", text: "Responds to greetings from familiar peers", ...termDefaults(),
              },
            ],
          },
        ],
      },
      {
        id: "managing-emotions",
        name: "Managing Emotions & Behaviour",
        color: "green",
        subcategories: [
          {
            id: "emotional-regulation",
            title: "2.1 Emotional regulation",
            items: [
              {
                id: "me-2-1a", text: "Accepts comfort from a familiar adult when distressed", ...termDefaults(),
              },
              {
                id: "me-2-1b", text: "Uses a simple strategy to manage emotions with adult support", ...termDefaults(),
              },
              {
                id: "me-2-1c", text: "Identifies own emotional state using visual support", ...termDefaults(),
              },
              {
                id: "me-2-1d", text: "Begins to use calming strategies independently", ...termDefaults(),
              },
            ],
          },
          {
            id: "behaviour-expectations",
            title: "2.2 Behaviour expectations",
            items: [
              {
                id: "me-2-2a", text: "Follows simple classroom rules with visual reminders", ...termDefaults(),
              },
              {
                id: "me-2-2b", text: "Responds to 'stop' or 'wait' instructions", ...termDefaults(),
              },
              {
                id: "me-2-2c", text: "Transitions between activities with support", ...termDefaults(),
              },
              {
                id: "me-2-2d", text: "Manages transitions independently", ...termDefaults(),
              },
            ],
          },
        ],
      },
      {
        id: "relationships",
        name: "Relationships",
        color: "purple",
        subcategories: [
          {
            id: "peer-interaction",
            title: "3.1 Peer interaction",
            items: [
              {
                id: "rel-3-1a", text: "Tolerates proximity of peers", ...termDefaults(),
              },
              {
                id: "rel-3-1b", text: "Engages in parallel play alongside peers", ...termDefaults(),
              },
              {
                id: "rel-3-1c", text: "Shares resources with peers when prompted", ...termDefaults(),
              },
              {
                id: "rel-3-1d", text: "Initiates interaction with a peer", ...termDefaults(),
              },
              {
                id: "rel-3-1e", text: "Takes turns in a structured activity", ...termDefaults(),
              },
            ],
          },
          {
            id: "adult-relationships",
            title: "3.2 Relationships with adults",
            items: [
              {
                id: "rel-3-2a", text: "Accepts support from familiar adults", ...termDefaults(),
              },
              {
                id: "rel-3-2b", text: "Shows trust in familiar adults", ...termDefaults(),
              },
              {
                id: "rel-3-2c", text: "Seeks help from an adult when needed", ...termDefaults(),
              },
            ],
          },
        ],
      },
      {
        id: "flexibility",
        name: "Flexibility & Problem Solving",
        color: "orange",
        subcategories: [
          {
            id: "flexibility-thinking",
            title: "4.1 Flexible thinking",
            items: [
              {
                id: "flex-4-1a", text: "Tolerates small changes to routine with support", ...termDefaults(),
              },
              {
                id: "flex-4-1b", text: "Accepts alternatives when first choice is unavailable", ...termDefaults(),
              },
              {
                id: "flex-4-1c", text: "Copes with unexpected changes to the timetable", ...termDefaults(),
              },
            ],
          },
          {
            id: "problem-solving",
            title: "4.2 Problem solving",
            items: [
              {
                id: "flex-4-2a", text: "Attempts to solve a simple problem before seeking help", ...termDefaults(),
              },
              {
                id: "flex-4-2b", text: "Uses a visual support to work through a problem", ...termDefaults(),
              },
              {
                id: "flex-4-2c", text: "Generates more than one solution to a problem", ...termDefaults(),
              },
            ],
          },
        ],
      },
      {
        id: "sensory-processing",
        name: "Sensory Processing",
        color: "red",
        subcategories: [
          {
            id: "sensory-awareness",
            title: "5.1 Sensory awareness & regulation",
            items: [
              {
                id: "sens-5-1a", text: "Indicates sensory discomfort through behaviour or communication", ...termDefaults(),
              },
              {
                id: "sens-5-1b", text: "Uses a sensory tool with adult guidance", ...termDefaults(),
              },
              {
                id: "sens-5-1c", text: "Requests a sensory break when needed", ...termDefaults(),
              },
              {
                id: "sens-5-1d", text: "Self-selects appropriate sensory strategy", ...termDefaults(),
              },
            ],
          },
        ],
      },
    ],
  };
}

function termDefaults(): Omit<AetLearningIntention, "id" | "text"> {
  return {
    baseline: defaultGrade,
    term1: defaultGrade,
    term2: defaultGrade,
    term3: defaultGrade,
    priority: "",
  };
}

// Pre-built student AET details with some filled-in data
export function getStudentAetDetails(studentId: string): StudentAetDetail {
  const details = createStudentAetDetails(studentId);

  // Add some sample grades for demo purposes
  if (studentId === "s1") {
    const sc = details.categories[0].subcategories[0].items;
    sc[0].baseline = "Developing"; sc[0].term1 = "Developing";
    sc[1].baseline = "Developing"; sc[1].term1 = "Established";
    sc[2].baseline = "Not Yet"; sc[2].term1 = "Developing";
    sc[3].baseline = "Not Yet"; sc[3].term1 = "Not Yet";
    sc[4].baseline = "Not Yet"; sc[4].term1 = "Developing";
    sc[5].baseline = "Not Yet"; sc[5].term1 = "Not Yet";

    const me = details.categories[1].subcategories[0].items;
    me[0].baseline = "Established"; me[0].term1 = "Generalised";
    me[1].baseline = "Developing"; me[1].term1 = "Developing";
    me[2].baseline = "Not Yet"; me[2].term1 = "Developing";
  }

  if (studentId === "s2") {
    const sc = details.categories[0].subcategories[0].items;
    sc[0].baseline = "Not Yet"; sc[0].term1 = "Developing";
    sc[1].baseline = "Not Yet"; sc[1].term1 = "Not Yet";
  }

  return details;
}
