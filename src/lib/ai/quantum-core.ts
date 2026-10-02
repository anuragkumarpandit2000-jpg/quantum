export interface ArcContext {
  userName?: string;
  level?: number;
  currentStreak?: number;
  totalXP?: number;
  activeHabits?: string[];
  objective?: string;
  thinkActive?: boolean;
  deepSearchActive?: boolean;

  // Rich Onboarding & Covenant Dossier
  age?: number | string;
  academicStatus?: string;
  careerPath?: string;
  primaryGoal?: string;
  secondaryGoal?: string;
  proofMethod?: string;
  arcCommitment?: string;
  badDayProtocol?: string;
  distractionStrategy?: string;
  consistencyCheckpoint?: string;
  continuationPlan?: string;
  screenTimeApps?: string[];
  dailyScreenHours?: string;
  sleepTime?: string;
  wakeTime?: string;
  avoidedTask?: string;
  brokenPromise?: string;
  protectWhat?: string;
  changeWhat?: string;
  aiObservation?: string;
  frictionPoints?: string[];
  contractSerial?: string;
  recentMessages?: Array<{ role: string; content: string }>;
}

export interface AIProvider {
  generateResponse(prompt: string, context: ArcContext): Promise<string>;
}

export interface OnboardingAnalysisInput {
  name: string;
  age?: number | string;
  academicStatus?: string;
  focusDays30?: number;
  screenTimeApps?: Array<{ app: string; time: string }>;
  completedRecent?: string;
  avoidedTask?: string;
  brokenPromise?: string;
  sleepDuration?: { hours: string; minutes: string };
  financialProfile?: {
    spending?: string;
    saving?: string;
    earning?: string;
    notEarning?: boolean;
  };
  careerPath?: string;
  firstApp?: string;
  lastApp?: string;
  distractions?: string[];
  protectWhat?: string;
  changeWhat?: string;
  primaryGoal: string;
  secondaryGoal: string;
}

export interface OnboardingAnalysisResult {
  primary_goal: string;
  secondary_goal: string;
  focus_obstacles: string[];
  recommended_habits: string[];
  recommended_daily_actions: string[];
  accountability_strategy: string;
  arc_summary: string;
}

export interface ContractGenerationInput {
  participant: {
    name: string;
    age?: number | string;
    academicStatus?: string;
    username?: string;
  };
  answers: {
    primaryGoal: string;
    secondaryGoal: string;
    proofMethod: string;
    arcCommitment: string;
    badDayProtocol: string;
    distractionStrategy: string;
    consistencyCheckpoint: string;
    continueAfter90: boolean;
    postArcGoals?: string;
  };
}

export interface ContractDocumentResult {
  primaryGoalText: string;
  secondaryGoalText: string;
  proofMethodText: string;
  arcCommitmentText: string;
  badDayProtocolText: string;
  distractionStrategyText: string;
  consistencyCheckpointText: string;
  continuationPlanText: string;
  generatedDate: string;
  serialNumber: string;
}

const CANDIDATE_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

// Gemini Provider implementation with multi-model resilience and JSON support
export class GeminiArcProvider implements AIProvider {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
  }

  private async callGeminiAPI(payload: any): Promise<any> {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || this.apiKey;
    if (!key) {
      throw new Error("No GEMINI_API_KEY configured");
    }

    let lastError: any = null;
    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData;
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("Gemini API call failed across all candidate models");
  }

  async generateResponse(prompt: string, context: ArcContext): Promise<string> {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || this.apiKey;
    if (key) {
      try {
        const systemPrompt = `You are QUANTUM CORE, an elite tactical AI operating system and personalized behavioral architect engineered for the 90-Day Winter Arc transformation challenge.
You are the personal AI Commander, Strategist, and Accountability Guardian for this specific challenger.
You have access to their entire analyzed onboarding dossier, circadian profile, friction points, and ratified 90-day covenant.

============================================================
CHALLENGER TACTICAL DOSSIER
============================================================
- Callsign / Name: ${context.userName || "Challenger"}
- Biological Age: ${context.age || "Unspecified"}
- Status / Academic Field: ${context.academicStatus || "Independent Challenger"}
- Target Craft / Career Vector: ${context.careerPath || "High-Performance Execution"}
- Experience Level: Level ${context.level || 1} | Streak: ${context.currentStreak || 0} Days | XP: ${context.totalXP || 0} / 10,000 XP
- Active Daily Habits: ${context.activeHabits?.join(", ") || "Meditation, Workout, Study, Reading"}
- Circadian Alignment: Wake at ${context.wakeTime || "06:30"} | Sleep at ${context.sleepTime || "23:00"}
- Screen Time Leaks: ${context.screenTimeApps?.join(", ") || "Smartphones / Social Media"} (${context.dailyScreenHours || "4"}h / day)
- Core Avoided Obstacle: ${context.avoidedTask || "None specified"}
- Broken Self-Promise to Rebuild: ${context.brokenPromise || "None specified"}
- Standard to Protect: ${context.protectWhat || "Deep focus and daily training"}
- Toxic Habit Being Eliminated: ${context.changeWhat || "Late night scrolling and procrastination"}

============================================================
RATIFIED 90-DAY COVENANT (SERIAL: ${context.contractSerial || "QNTM-ARC-90"})
============================================================
- Primary 90-Day Goal: ${context.primaryGoal || context.objective || "Master self-discipline"}
- Secondary Supporting Goal: ${context.secondaryGoal || "Continuous skill compounding"}
- Measurable Proof of Work: ${context.proofMethod || "Completed production portfolio & daily logs"}
- Non-Negotiable Standard: ${context.arcCommitment || "Daily unbroken execution of core habits"}
- Emergency Bad-Day Protocol: ${context.badDayProtocol || "Immediate 15-minute micro-rep to preserve neural momentum"}
- Distraction Sacrifice / Firewall: ${context.distractionStrategy || "Lockdown of social media and notifications"}
- Consistency Audit Anchor: ${context.consistencyCheckpoint || "Quantum Core AI verification"}
- 24-Hour Reset Covenant: ${context.continuationPlan || "Get back on track within 24 hours without abandoning the arc"}
${context.frictionPoints && context.frictionPoints.length > 0 ? `- Identified Friction Nodes: ${context.frictionPoints.join(" | ")}` : ""}
${context.aiObservation ? `- Core Diagnostic Assessment: ${context.aiObservation}` : ""}
${context.thinkActive ? "MODE: Deep strategic decomposition active. Provide rigorous analysis before recommendations." : ""}
${context.deepSearchActive ? "MODE: Deep Arc research active. Correlate physiological and cognitive optimization principles." : ""}

============================================================
CRITICAL OPERATING RULES (ZERO DRAMA / DIRECT & PRECISE):
============================================================
1. ZERO FLUFF & NO DRAMA: NEVER start with theatrical roleplay headers like "### QUANTUM CORE INITIALIZED", "Challenger affirmative", "Commencing tactical protocol", or "Directive accepted". Jump straight into the helpful, structured answer.
2. JITNA PUCHHE UTNA KARE (ANSWER DIRECTLY): Answer only and precisely what the user asks. If they ask a quick question, give a concise, direct answer. Do not lecture or write unnecessary essays unless asked.
3. NO CHEESY CLOSINGS: Do NOT add dramatic signature lines at the end (e.g. "Quantum Core standing by", "The Winter Arc demands sacrifice", etc.).
4. CLEAN & STYLISH FORMATTING: Use clean markdown, elegant bullet points (•), and short clear sections. Keep formatting readable, modern, and sharp.
5. LANGUAGE ADAPTABILITY: If the user speaks in Hindi or Hinglish (e.g., "bhai kaise karu", "kya haal hai", "routine bata do"), respond in natural, friendly, stylish Hinglish. If in English, reply in crisp modern English.`;

        const contents: any[] = [];
        if (context.recentMessages && context.recentMessages.length > 0) {
          const recent = context.recentMessages.slice(-6);
          contents.push({
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n[Chat started. Answer directly with zero drama.]` }],
          });
          contents.push({
            role: "model",
            parts: [{ text: "Understood. I will provide direct, clean, and concise responses without any roleplay fluff or drama." }],
          });
          for (const m of recent) {
            contents.push({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            });
          }
          contents.push({
            role: "user",
            parts: [{ text: prompt }],
          });
        } else {
          contents.push({
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}\n\n(Answer directly, cleanly, and stylishly. No drama, no roleplay intro)` }],
          });
        }

        const data = await this.callGeminiAPI({ contents });

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return generatedText;
        }
      } catch (e) {
        console.error("Gemini API call failed, falling back to Quantum Core tactical engine", e);
      }
    }

    return this.fallbackEngine(prompt, context);
  }

  // Strategic Arc Personal Analysis for Onboarding Part 3
  async analyzeOnboarding(input: OnboardingAnalysisInput): Promise<OnboardingAnalysisResult> {
    const prompt = `Analyze the challenger's current life, habits, screen time, and goals for the 90-Day Winter Arc.
DO NOT diagnose any medical or mental condition.
Return a clean, valid JSON object with EXACTLY these keys:
- "primary_goal": string (concise formulation of the main objective)
- "secondary_goal": string (supporting habit or secondary skill)
- "focus_obstacles": array of strings (top 3 friction sources or distractions identified)
- "recommended_habits": array of 4 strings (high-impact habits tailored to fix their friction)
- "recommended_daily_actions": array of 3 strings (immediate daily rep habits)
- "accountability_strategy": string (clear psychological reset plan for difficult days)
- "arc_summary": string (a powerful 2-3 sentence strategic executive assessment)

User Profile & Answers:
- Name: ${input.name}
- Age: ${input.age || "Unspecified"}
- Academic Status: ${input.academicStatus || "Unspecified"}
- Past 30 Days Focus: ${input.focusDays30 ?? 0} out of 30 days
- Screen Time Apps: ${input.screenTimeApps?.map((a) => `${a.app}: ${a.time}`).join(", ") || "None specified"}
- Recent 30-Day Completion: ${input.completedRecent || "None specified"}
- Avoided Crucial Task: ${input.avoidedTask || "None specified"}
- Broken Self-Promise: ${input.brokenPromise || "None specified"}
- Average Sleep Duration: ${input.sleepDuration ? `${input.sleepDuration.hours}h ${input.sleepDuration.minutes}m` : "7 hours"}
- Career Path & Vision: ${input.careerPath || "Under development"}
- Waking App / Sleep App: First: ${input.firstApp || "None"}, Last: ${input.lastApp || "None"}
- Primary Distractions: ${input.distractions?.join(", ") || "General digital distraction"}
- What to Protect: ${input.protectWhat || "Mental clarity"}
- What to Change: ${input.changeWhat || "Screen time and procrastination"}
- Stated Primary Goal: ${input.primaryGoal}
- Stated Secondary Goal: ${input.secondaryGoal}`;

    try {
      const data = await this.callGeminiAPI({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          primary_goal: parsed.primary_goal || input.primaryGoal,
          secondary_goal: parsed.secondary_goal || input.secondaryGoal,
          focus_obstacles: Array.isArray(parsed.focus_obstacles) ? parsed.focus_obstacles : ["Digital screen time static", "Inconsistent execution rhythms", "Delayed task initiation"],
          recommended_habits: Array.isArray(parsed.recommended_habits) && parsed.recommended_habits.length > 0
            ? parsed.recommended_habits
            : ["HEAVY WORKOUT (45 MIN)", "DEEP WORK / STUDY (90 MIN)", "DIGITAL DETOX BEFORE SLEEP", "READING / SKILL LOG (30 MIN)"],
          recommended_daily_actions: Array.isArray(parsed.recommended_daily_actions) ? parsed.recommended_daily_actions : ["Morning phone lockdown", "Daily habit check-in", "Nightly trajectory audit"],
          accountability_strategy: parsed.accountability_strategy || "Reset buffer zero. When focus slips, execute a 10-minute micro-rep to maintain neural momentum.",
          arc_summary: parsed.arc_summary || `${input.name} has identified clear friction points and is entering the 90-Day Winter Arc with focused intent. Eliminating screen-time leaks will unleash compounding discipline.`,
        };
      }
    } catch (err) {
      console.error("Gemini analysis error, using intelligent fallback", err);
    }

    // Intelligent Fallback
    return {
      primary_goal: input.primaryGoal || "Achieve complete physical and mental discipline",
      secondary_goal: input.secondaryGoal || "Master structured daily deep work",
      focus_obstacles: input.distractions && input.distractions.length > 0
        ? input.distractions.slice(0, 3)
        : ["Excessive smartphone screen time", "Cognitive friction and task delay", "Broken sleep and evening fatigue"],
      recommended_habits: [
        "HEAVY WORKOUT (45 MIN)",
        "DEEP WORK / STUDY (90 MIN)",
        "COLD SHOWER & HYDRATION",
        "READING & SKILL COMPOUNDING (30 MIN)",
      ],
      recommended_daily_actions: [
        "Strip away morning phone usage before 09:00 AM",
        "Log full habit matrix completion before 22:00 PM",
        "Review daily proof photo and lock in the streak",
      ],
      accountability_strategy: "Operate with zero restart buffers. A single imperfect day requires immediate 15-minute micro-task re-entry to preserve momentum.",
      arc_summary: `${input.name} has registered high-potential targets with clear operational awareness. Transforming reactive habits into proactive daily discipline over the next 90 days will solidify permanent personal momentum.`,
    };
  }

  // Contract Generation & Polishing for Part 6 & 7
  async generateContract(input: ContractGenerationInput): Promise<ContractDocumentResult> {
    const serialNumber = `QNTM-CONTRACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const participant = input.participant || {
      name: (input as any).userName || (input as any).name || "Challenger",
      age: (input as any).userAge || (input as any).age || 21,
      academicStatus: (input as any).academicStatus || "Independent",
      username: (input as any).username || (input as any).userName || "CHALLENGER",
    };

    const answers = input.answers || ({} as any);

    const prompt = `You are the legal & philosophical scribe for QUANTUM WINTER ARC.
Transform the participant's raw commitment answers into dignified, polished, grammatically correct FIRST-PERSON statements ("I am...", "My primary goal is...", "I will submit...", "I commit to...", "If I experience a difficult day, I will...", "When I encounter distractions, I will...", "My consistency checkpoint will be...", "I will continue...").

IMPORTANT RULES:
1. Every answer MUST be in the FIRST PERSON ("I", "my", "we").
2. DO NOT invent goals or achievements that the user did not state.
3. DO NOT exaggerate. Keep the user's authentic meaning intact.
4. Correct all grammar, syntax, and punctuation into crisp, authoritative prose.
5. Return a clean, valid JSON object with EXACTLY these keys:
- "primaryGoalText": string (First person: "My primary goal is to...")
- "secondaryGoalText": string (First person: "My secondary goal is to...")
- "proofMethodText": string (First person: "I will verify my daily discipline by submitting...")
- "arcCommitmentText": string (First person: "I commit to...")
- "badDayProtocolText": string (First person: "If a day becomes challenging due to external friction, I will...")
- "distractionStrategyText": string (First person: "When confronted with digital or environmental distractions, I will...")
- "consistencyCheckpointText": string (First person: "My consistency checkpoint will be...")
- "continuationPlanText": string (First person: "Following the culmination of this 90-day arc, I will...")

Participant Profile:
- Name: ${participant.name}
- Age: ${participant.age || "N/A"}
- Academic Status: ${participant.academicStatus || "N/A"}
- Username: ${participant.username || participant.name}

User's Raw Contract Answers:
- Primary Goal: ${answers.primaryGoal || "Unwavering physical and mental discipline"}
- Secondary Goal: ${answers.secondaryGoal || "Continuous skill compounding"}
- Proof of Progress: ${answers.proofMethod || "Daily photo logs and completed projects"}
- Arc Commitment: ${answers.arcCommitment || "Daily unbroken execution"}
- Difficult Day Protocol: ${answers.badDayProtocol || "Immediate 15-minute emergency rep"}
- Distraction Strategy: ${answers.distractionStrategy || "Strict app lockdown and notification silencing"}
- Consistency Checkpoint: ${answers.consistencyCheckpoint || "Quantum Core AI daily verification"}
- Continue After 90 Days: ${answers.continueAfter90 ? "Yes" : "No"}
- Post-Arc Continuation Goals: ${answers.postArcGoals || "Consolidate my newfound baseline and maintain unbroken daily discipline."}`;

    try {
      const data = await this.callGeminiAPI({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          primaryGoalText: parsed.primaryGoalText || `My primary goal is to achieve ${input.answers.primaryGoal}.`,
          secondaryGoalText: parsed.secondaryGoalText || `My secondary goal is to develop ${input.answers.secondaryGoal}.`,
          proofMethodText: parsed.proofMethodText || `I will verify my progress by submitting ${input.answers.proofMethod}.`,
          arcCommitmentText: parsed.arcCommitmentText || `I commit to ${input.answers.arcCommitment} throughout the unbroken 90 days.`,
          badDayProtocolText: parsed.badDayProtocolText || `If a day becomes challenging, I will ${input.answers.badDayProtocol}.`,
          distractionStrategyText: parsed.distractionStrategyText || `When confronted with distractions, I will ${input.answers.distractionStrategy}.`,
          consistencyCheckpointText: parsed.consistencyCheckpointText || `My consistency checkpoint will be governed by ${input.answers.consistencyCheckpoint}.`,
          continuationPlanText: parsed.continuationPlanText || (input.answers.continueAfter90
            ? `Following this 90-day arc, I will continue pursuing: ${input.answers.postArcGoals || "further compounding milestones"}.`
            : "Upon culmination of the 90 days, I will uphold my transformed baseline."),
          generatedDate,
          serialNumber,
        };
      }
    } catch (err) {
      console.error("Gemini contract formatting error, using tactical formatter", err);
    }

    // High-Fidelity Local First-Person Formatter Fallback
    return {
      primaryGoalText: `My primary goal is to achieve ${input.answers.primaryGoal.trim()}.`,
      secondaryGoalText: `My secondary goal is to develop and maintain ${input.answers.secondaryGoal.trim()}.`,
      proofMethodText: `I will verify my daily discipline by submitting ${input.answers.proofMethod.trim()}.`,
      arcCommitmentText: `I commit to ${input.answers.arcCommitment.trim()} without compromise.`,
      badDayProtocolText: `If external friction, workload, or unexpected disruption occurs, I will ${input.answers.badDayProtocol.trim()}.`,
      distractionStrategyText: `When confronted with focus drift or digital distractions, I will ${input.answers.distractionStrategy.trim()}.`,
      consistencyCheckpointText: `My consistency audit checkpoint will be anchored by ${input.answers.consistencyCheckpoint.trim()}.`,
      continuationPlanText: input.answers.continueAfter90
        ? `Following the culmination of this 90-day arc, I will continue pursuing: ${input.answers.postArcGoals || "perpetual skill mastery and physical conditioning"}.`
        : "Following the culmination of this 90-day arc, I will defend my transformed standards as an immutable baseline.",
      generatedDate,
      serialNumber,
    };
  }

  private fallbackEngine(prompt: string, context: ArcContext): string {
    const q = prompt.toLowerCase();
    const user = context.userName || "Challenger";

    if (q.includes("study") || q.includes("plan") || q.includes("routine") || q.includes("schedule")) {
      return `Daily Focus Routine for **${user}** (${context.wakeTime || "06:30"} – ${context.sleepTime || "23:00"}):

• **06:30 – 07:30** • Hydration, morning sunlight & Habit 01. Zero phone.
• **09:00 – 11:30** • Deep Work Sprint for **${context.careerPath || "High-Yield Mastery"}**.
• **17:00 – 18:00** • Physical training & workout check-in.
• **21:30 – 22:30** • Habit Matrix review, 30 min reading & wind-down.`;
    }

    if (q.includes("blender") || q.includes("3d") || q.includes("skill")) {
      return `Blender 3D Roadmap:
• **Days 1–10:** Viewport shortcuts (G, R, S), basic transforms & low-poly modeling.
• **Days 11–20:** Modifiers (Subsurf, Bevel, Array) & quad topology cleanups.
• **Days 21–30:** Procedural shaders, lighting & final portfolio render.`;
    }

    if (q.includes("miss") || q.includes("fail") || q.includes("streak") || q.includes("recover")) {
      return `Ek din miss hone par panic mat karo. Step-by-step:
1. Habit Matrix me kal ka status update karo.
2. Aaj ka sabse zaroori habit 12:00 PM se pehle complete karo aur streak re-anchor karo.`;
    }

    if (q.includes("consistency") || q.includes("improve") || q.includes("lazy") || q.includes("tired")) {
      return `Consistency Badhane Ke 3 Golden Rules:
• **Lower Activation Energy:** Raat me hi workout gear aur desk set karke rakho.
• **Never Zero:** Agar 60 min nahi ho sakta, to 15 min ka micro-rep karo. Checkmark protect karo.
• **Clear Boundaries:** Phone dusre room me rakh kar focus sprint start karo.`;
    }

    return `Samajh gaya. Aapka primary goal hai: **${context.primaryGoal || "Self-Discipline"}**.

Batao specific kis cheez me help chahiye:
• Daily routine & time-blocking
• Habit consistency ya distraction control
• Skill micro-tasks breakdown`;
  }
}

export const quantumCore = new GeminiArcProvider();
