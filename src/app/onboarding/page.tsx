"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Sparkles,
  Flame,
  Clock,
  Target,
  Award,
  BookOpen,
  AlertCircle,
  Cpu,
  Printer,
  Download,
  RefreshCw,
  Moon,
  Sun,
  Activity,
  CheckCircle2,
  Lock,
  Smartphone,
  Sliders,
  DollarSign,
  Compass,
} from "lucide-react";
import { Button, LiquidButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FloatingPaths from "@/components/ui/floating-paths";
import DoorSequencePlayer from "@/components/ui/door-sequence-player";
import SignatureCanvas from "@/components/onboarding/signature-canvas";
import QuantumContractDocument, { downloadContractImage } from "@/components/onboarding/quantum-contract-document";
import { ContractDocumentResult, OnboardingAnalysisResult } from "@/lib/ai/quantum-core";
import { cn } from "@/lib/utils";

// Local storage draft key
const STORAGE_KEY = "quantum_onboarding_draft_v2";

const ACADEMIC_STATUS_OPTIONS = [
  "School Student",
  "College Student",
  "University Student",
  "Working Professional",
  "Entrepreneur / Self-Employed",
  "Other",
];

const SCREEN_TIME_APP_OPTIONS = [
  "Instagram",
  "YouTube",
  "Gaming",
  "Netflix / Streaming",
  "Messaging / WhatsApp",
  "X / Twitter",
  "TikTok / Shorts",
  "Reddit / Forums",
];

const FINANCIAL_OPTIONS = [
  "Student / Not currently earning",
  "Freelance / Part-time",
  "Full-time employment",
  "Business / Founder",
  "Prefer not to disclose",
];

const DISTRACTION_TRIGGER_OPTIONS = [
  "Phone notifications & alerts",
  "Feeling bored, fatigued, or low energy",
  "Stress, anxiety, or cognitive overwhelm",
  "Friends, family, or chaotic environment",
  "Mind wandering & chronic procrastination",
  "Unstructured free time with no clear task",
];

const ACCOUNTABILITY_OPTIONS = [
  "Quantum Core AI (Daily automated verification)",
  "Accountability partner / mentor",
  "Public proof log & community showcase",
  "Daily personal journal & proof photos",
];

export default function OnboardingPage() {
  const router = useRouter();

  // Major Stage: "questionnaire" | "intermission" | "ai_analyzing" | "ai_result" | "contract_questions" | "contract_generating" | "contract_preview"
  const [stage, setStage] = useState<string>("questionnaire");

  // Sub-step index for Questionnaire (1 to 15)
  const [qIndex, setQIndex] = useState<number>(1);

  // Sub-step index for Contract Questions (1 to 8)
  const [cqIndex, setCqIndex] = useState<number>(1);

  // Form State - Part 1 & 2
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("21");
  const [academicStatus, setAcademicStatus] = useState<string>("College Student");
  const [customAcademicStatus, setCustomAcademicStatus] = useState<string>("");

  const [focusDays30, setFocusDays30] = useState<number>(12);
  const [screenTimeApps, setScreenTimeApps] = useState<string[]>(["Instagram", "YouTube"]);
  const [dailyScreenHours, setDailyScreenHours] = useState<string>("4.5");
  const [completedRecent, setCompletedRecent] = useState<string>("");
  const [avoidedTask, setAvoidedTask] = useState<string>("");
  const [brokenPromise, setBrokenPromise] = useState<string>("");
  const [sleepTime, setSleepTime] = useState<string>("23:30");
  const [wakeTime, setWakeTime] = useState<string>("06:30");
  const [financialStatus, setFinancialStatus] = useState<string>("Student / Not currently earning");
  const [careerPath, setCareerPath] = useState<string>("");
  const [firstApp, setFirstApp] = useState<string>("Alarm / Clock");
  const [lastApp, setLastApp] = useState<string>("YouTube / Messaging");
  const [distractions, setDistractions] = useState<string[]>([
    "Phone notifications & alerts",
    "Mind wandering & chronic procrastination",
  ]);
  const [protectWhat, setProtectWhat] = useState<string>("");
  const [changeWhat, setChangeWhat] = useState<string>("");
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [secondaryGoal, setSecondaryGoal] = useState<string>("");

  // AI Analysis Results
  const [aiAnalysis, setAiAnalysis] = useState<OnboardingAnalysisResult | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    "HEAVY WORKOUT (45 MIN)",
    "DEEP WORK / STUDY (90 MIN)",
    "MEDITATION (20 MIN)",
    "READING (30 MIN)",
  ]);

  // Contract Questionnaire Answers (Part 4)
  const [cqPrimaryGoal, setCqPrimaryGoal] = useState<string>("");
  const [cqSecondaryGoal, setCqSecondaryGoal] = useState<string>("");
  const [cqProofMethod, setCqProofMethod] = useState<string>("");
  const [cqArcCommitment, setCqArcCommitment] = useState<string>("");
  const [cqBadDayProtocol, setCqBadDayProtocol] = useState<string>("");
  const [cqDistractionStrategy, setCqDistractionStrategy] = useState<string>("");
  const [cqConsistencyCheckpoint, setCqConsistencyCheckpoint] = useState<string>(
    "Quantum Core AI (Daily automated verification)"
  );
  const [cqContinuationPlan, setCqContinuationPlan] = useState<string>(
    "Yes — I commit to the 24-hour reset standard without abandoning the arc."
  );
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Generated Contract Result (Part 6)
  const [contractResult, setContractResult] = useState<ContractDocumentResult | null>(null);

  // Portal sequence transition
  const [isPlayingPortal, setIsPlayingPortal] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(false);

  // 1. Initial Load: Check logged-in user & local draft
  useEffect(() => {
    // Attempt to load from localStorage first
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.name) setName(parsed.name);
        if (parsed.age) setAge(parsed.age);
        if (parsed.academicStatus) setAcademicStatus(parsed.academicStatus);
        if (parsed.customAcademicStatus) setCustomAcademicStatus(parsed.customAcademicStatus);
        if (typeof parsed.focusDays30 === "number") setFocusDays30(parsed.focusDays30);
        if (Array.isArray(parsed.screenTimeApps)) setScreenTimeApps(parsed.screenTimeApps);
        if (parsed.dailyScreenHours) setDailyScreenHours(parsed.dailyScreenHours);
        if (parsed.completedRecent) setCompletedRecent(parsed.completedRecent);
        if (parsed.avoidedTask) setAvoidedTask(parsed.avoidedTask);
        if (parsed.brokenPromise) setBrokenPromise(parsed.brokenPromise);
        if (parsed.sleepTime) setSleepTime(parsed.sleepTime);
        if (parsed.wakeTime) setWakeTime(parsed.wakeTime);
        if (parsed.financialStatus) setFinancialStatus(parsed.financialStatus);
        if (parsed.careerPath) setCareerPath(parsed.careerPath);
        if (parsed.firstApp) setFirstApp(parsed.firstApp);
        if (parsed.lastApp) setLastApp(parsed.lastApp);
        if (Array.isArray(parsed.distractions)) setDistractions(parsed.distractions);
        if (parsed.protectWhat) setProtectWhat(parsed.protectWhat);
        if (parsed.changeWhat) setChangeWhat(parsed.changeWhat);
        if (parsed.primaryGoal) setPrimaryGoal(parsed.primaryGoal);
        if (parsed.secondaryGoal) setSecondaryGoal(parsed.secondaryGoal);

        if (parsed.cqPrimaryGoal) setCqPrimaryGoal(parsed.cqPrimaryGoal);
        if (parsed.cqSecondaryGoal) setCqSecondaryGoal(parsed.cqSecondaryGoal);
        if (parsed.cqProofMethod) setCqProofMethod(parsed.cqProofMethod);
        if (parsed.cqArcCommitment) setCqArcCommitment(parsed.cqArcCommitment);
        if (parsed.cqBadDayProtocol) setCqBadDayProtocol(parsed.cqBadDayProtocol);
        if (parsed.cqDistractionStrategy) setCqDistractionStrategy(parsed.cqDistractionStrategy);
        if (parsed.cqConsistencyCheckpoint) setCqConsistencyCheckpoint(parsed.cqConsistencyCheckpoint);
        if (parsed.cqContinuationPlan) setCqContinuationPlan(parsed.cqContinuationPlan);

        if (parsed.qIndex && parsed.stage === "questionnaire") setQIndex(parsed.qIndex);
        if (parsed.stage) setStage(parsed.stage);
        if (parsed.aiAnalysis) setAiAnalysis(parsed.aiAnalysis);
        if (parsed.contractResult) setContractResult(parsed.contractResult);
        if (parsed.signatureUrl) setSignatureUrl(parsed.signatureUrl);
        setHasSavedDraft(true);
      }
    } catch (e) {
      console.warn("Failed to load onboarding draft", e);
    }

    // Also check current auth user name & email verification status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
          return;
        }
        if (!data.user.emailVerified) {
          router.push("/verify-email");
          return;
        }
        if (data.user?.name && !name) {
          setName(data.user.name);
        }
      })
      .catch(() => {});
  }, [name, router]);

  // 2. Autosave state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        stage,
        qIndex,
        cqIndex,
        name,
        age,
        academicStatus,
        customAcademicStatus,
        focusDays30,
        screenTimeApps,
        dailyScreenHours,
        completedRecent,
        avoidedTask,
        brokenPromise,
        sleepTime,
        wakeTime,
        financialStatus,
        careerPath,
        firstApp,
        lastApp,
        distractions,
        protectWhat,
        changeWhat,
        primaryGoal,
        secondaryGoal,
        aiAnalysis,
        selectedHabits,
        cqPrimaryGoal,
        cqSecondaryGoal,
        cqProofMethod,
        cqArcCommitment,
        cqBadDayProtocol,
        cqDistractionStrategy,
        cqConsistencyCheckpoint,
        cqContinuationPlan,
        signatureUrl,
        contractResult,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setHasSavedDraft(true);
    } catch (e) {
      console.warn("Autosave draft error", e);
    }
  }, [
    stage,
    qIndex,
    cqIndex,
    name,
    age,
    academicStatus,
    customAcademicStatus,
    focusDays30,
    screenTimeApps,
    dailyScreenHours,
    completedRecent,
    avoidedTask,
    brokenPromise,
    sleepTime,
    wakeTime,
    financialStatus,
    careerPath,
    firstApp,
    lastApp,
    distractions,
    protectWhat,
    changeWhat,
    primaryGoal,
    secondaryGoal,
    aiAnalysis,
    selectedHabits,
    cqPrimaryGoal,
    cqSecondaryGoal,
    cqProofMethod,
    cqArcCommitment,
    cqBadDayProtocol,
    cqDistractionStrategy,
    cqConsistencyCheckpoint,
    cqContinuationPlan,
    signatureUrl,
    contractResult,
  ]);

  // Toggle multi-select helper
  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Step Navigation in Questionnaire
  const handleNextQuestion = () => {
    if (qIndex === 3) {
      // Transition from Part 1 to Part 2 Intermission
      setStage("intermission");
      return;
    }

    if (qIndex < 15) {
      setQIndex((prev) => prev + 1);
    } else {
      // Completed Q15 -> Trigger AI Analysis
      triggerAiAnalysis();
    }
  };

  const handlePrevQuestion = () => {
    if (qIndex > 1) {
      setQIndex((prev) => prev - 1);
    }
  };

  // Part 3: Call AI Analysis API
  const triggerAiAnalysis = async () => {
    setStage("ai_analyzing");
    setIsAiLoading(true);

    try {
      const payload = {
        name,
        age: parseInt(age) || 21,
        academicStatus: academicStatus === "Other" ? customAcademicStatus || "Independent" : academicStatus,
        focusDays30,
        screenTimeApps: screenTimeApps.map((app) => ({ app, time: `${dailyScreenHours}h` })),
        completedRecent,
        avoidedTask,
        brokenPromise,
        sleepDuration: { hours: 7, minutes: 30 },
        careerPath,
        firstApp,
        lastApp,
        distractions,
        protectWhat,
        changeWhat,
        primaryGoal: primaryGoal || "Master physical conditioning and deep work",
        secondaryGoal: secondaryGoal || "Eliminate digital distraction and procrastination",
      };

      const res = await fetch("/api/ai/onboarding-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: OnboardingAnalysisResult = await res.json();
      setAiAnalysis(data);

      if (data.recommended_habits && data.recommended_habits.length > 0) {
        setSelectedHabits(data.recommended_habits);
      }

      // Prefill contract questions
      setCqPrimaryGoal(data.primary_goal || primaryGoal);
      setCqSecondaryGoal(data.secondary_goal || secondaryGoal);
      setCqProofMethod(
        completedRecent ? `Measurable completion exceeding ${completedRecent}` : "Completed project portfolio and daily execution logs"
      );
      setCqArcCommitment(`Daily execution of ${data.recommended_habits?.[0] || "core habits"} without excuses.`);
      setCqBadDayProtocol(data.accountability_strategy || "Execute an immediate 15-minute micro-rep to maintain neural streak.");
      setCqDistractionStrategy(`Strict lockdown of ${screenTimeApps.join(", ") || "distracting apps"} during prime focus hours.`);

      // Artificial small pause for dramatic cinematic pacing
      setTimeout(() => {
        setIsAiLoading(false);
        setStage("ai_result");
      }, 1400);
    } catch (err) {
      console.error("AI analysis error", err);
      setIsAiLoading(false);
      setStage("ai_result");
    }
  };

  // Move from AI Result to Contract Questions
  const handleProceedToContract = () => {
    setStage("contract_questions");
    setCqIndex(1);
  };

  // Contract Questions Navigation
  const handleNextContractQ = () => {
    if (cqIndex < 8) {
      setCqIndex((prev) => prev + 1);
    } else {
      // Completed CQ8 -> Generate Final Contract
      handleGenerateFinalContract();
    }
  };

  const handlePrevContractQ = () => {
    if (cqIndex > 1) {
      setCqIndex((prev) => prev - 1);
    }
  };

  // Part 5 & 6: AI Contract Generation & Polishing
  const handleGenerateFinalContract = async () => {
    setStage("contract_generating");

    try {
      const contractPayload = {
        participant: {
          name: name.trim() || "Challenger",
          age: parseInt(age) || 21,
          academicStatus: academicStatus === "Other" ? customAcademicStatus || "Independent" : academicStatus,
          username: (name.trim() || "CHALLENGER").toUpperCase().replace(/\s+/g, "_"),
        },
        answers: {
          primaryGoal: cqPrimaryGoal || primaryGoal,
          secondaryGoal: cqSecondaryGoal || secondaryGoal,
          proofMethod: cqProofMethod || "Daily photographic proof and completed repository log",
          arcCommitment: cqArcCommitment || "3 hours of deep work and rigorous physical conditioning",
          badDayProtocol: cqBadDayProtocol || "Immediate 15-minute micro-rep to preserve streak momentum",
          distractionStrategy: cqDistractionStrategy || "Lockdown of screen time and notification silencing",
          consistencyCheckpoint: cqConsistencyCheckpoint || "Quantum Core AI verification",
          continueAfter90: true,
          postArcGoals: "Permanent elevation of baseline standards and continuous compounding",
        },
      };

      // 1. Generate polished first-person document via Gemini AI
      const genRes = await fetch("/api/ai/contract-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractPayload),
      });

      const genData: ContractDocumentResult = await genRes.json();
      setContractResult(genData);

      // 2. Persist in database via Onboarding API
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          age,
          academicStatus: academicStatus === "Other" ? customAcademicStatus || "Independent" : academicStatus,
          dailyAvailableHours: "3.0",
          objective: genData.primaryGoalText,
          habits: selectedHabits,
          skillTitle: careerPath || "Discipline & High-Performance Execution",
          signatureUrl: signatureUrl || null,
          contractData: genData,
          onboardingAnalysis: aiAnalysis,
          onboardingAnswers: {
            focusDays30,
            screenTimeApps,
            dailyScreenHours,
            completedRecent,
            avoidedTask,
            brokenPromise,
            sleepTime,
            wakeTime,
            financialStatus,
            careerPath,
            firstApp,
            lastApp,
            distractions,
            protectWhat,
            changeWhat,
            primaryGoal,
            secondaryGoal,
          },
          certificateNumber: genData.serialNumber,
        }),
      });

      setTimeout(() => {
        setStage("contract_preview");
      }, 1200);
    } catch (err) {
      console.error("Contract generation failure", err);
      setStage("contract_preview");
    }
  };

  // Print Contract Handler
  const handlePrintContract = () => {
    window.print();
  };

  // Download Official Stamped PNG Contract Image Handler
  const handleDownloadContract = async () => {
    if (!contractResult) return;
    await downloadContractImage({
      participant: {
        name: name || "Challenger",
        age: age || "21",
        academicStatus:
          academicStatus === "Other"
            ? customAcademicStatus || "Independent"
            : academicStatus,
        username: name.toUpperCase().replace(/\s+/g, "_"),
      },
      contract: contractResult,
      signatureUrl: signatureUrl,
    });
  };

  // Start My Journey Transition Trigger
  const handleStartJourney = () => {
    if (isPlayingPortal) return;
    setIsPlayingPortal(true);
  };

  const handlePortalComplete = () => {
    // Clear draft once onboarded successfully
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    router.push("/dashboard");
  };

  const handleResetDraft = () => {
    if (confirm("Reset current draft and start questionnaire from beginning?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <main className="relative min-h-screen bg-[#02050f] text-slate-100 flex flex-col justify-between p-4 sm:p-8 overflow-x-hidden select-none">
      {/* Background vector paths */}
      <FloatingPaths position={1} />

      {/* Cinematic Frame Sequence Player Overlay (Plays on Start Journey) */}
      {isPlayingPortal && (
        <DoorSequencePlayer onComplete={handlePortalComplete} soundEnabled={true} />
      )}

      {/* Top Header */}
      <header className="relative z-20 max-w-5xl w-full mx-auto flex items-center justify-between py-3 border-b border-slate-800/80 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-[0.2em] text-white">
              QUANTUM
            </span>
            <span className="text-[9px] font-mono text-sky-400 tracking-wider">
              INDUCTION PROTOCOL
            </span>
          </div>
        </div>

        {/* Dynamic Step / Progress Indicator */}
        <div className="flex items-center gap-3">
          {stage === "questionnaire" && (
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="text-sky-400 font-bold">
                QUESTION {String(qIndex).padStart(2, "0")} / 15
              </span>
              <div className="w-24 sm:w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-all duration-300"
                  style={{ width: `${(qIndex / 15) * 100}%` }}
                />
              </div>
            </div>
          )}

          {stage === "contract_questions" && (
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="text-cyan-400 font-bold">
                CONTRACT {String(cqIndex).padStart(2, "0")} / 08
              </span>
              <div className="w-24 sm:w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300"
                  style={{ width: `${(cqIndex / 8) * 100}%` }}
                />
              </div>
            </div>
          )}

          {stage === "contract_preview" && (
            <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} /> COVENANT RATIFIED
            </span>
          )}

          {/* Reset draft button */}
          <button
            onClick={handleResetDraft}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 px-2 py-1 rounded border border-slate-800 hover:border-slate-700 transition"
            title="Reset Draft"
          >
            <RefreshCw size={10} />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage Container */}
      <div className="relative z-10 max-w-3xl w-full mx-auto my-6 sm:my-10">
        {/* =========================================================================
            STAGE 1: 15-QUESTION PROTOCOL QUESTIONNAIRE
            ========================================================================= */}
        {stage === "questionnaire" && (
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-950/85 border border-sky-500/20 p-6 sm:p-10 rounded-2xl backdrop-blur-2xl shadow-[0_0_50px_rgba(2,132,199,0.12)] space-y-6"
            >
              {/* Question 01: Name */}
              {qIndex === 1 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 01 • Basic Profile
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is your name?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Enter your legal name or operational callsign. This name will be permanently inscribed into your 90-Day Winter Arc Covenant.
                  </p>

                  <div className="pt-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arun V."
                      autoFocus
                      className="text-base sm:text-lg h-12 bg-slate-900/90 border-slate-700 focus:border-sky-400 font-sans"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && name.trim()) handleNextQuestion();
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Question 02: Age */}
              {qIndex === 2 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 01 • Basic Profile
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    How old are you?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Biological age calibrates your metabolic baseline, cardiovascular recovery curves, and deep work stamina models.
                  </p>

                  <div className="pt-2 max-w-xs">
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="13"
                      max="99"
                      autoFocus
                      className="text-lg h-12 bg-slate-900/90 border-slate-700 focus:border-sky-400 font-mono"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && age) handleNextQuestion();
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Question 03: Academic Status */}
              {qIndex === 3 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 01 • Basic Profile
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is your current academic status?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Select your current status so Quantum can tune your daily schedule around academic exams or professional hours.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ACADEMIC_STATUS_OPTIONS.map((status) => {
                      const isSelected = academicStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setAcademicStatus(status)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border font-sans text-xs sm:text-sm font-semibold transition text-left",
                            isSelected
                              ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-md shadow-sky-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <span>{status}</span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border",
                              isSelected
                                ? "bg-sky-500 border-sky-400 text-slate-950"
                                : "border-slate-700"
                            )}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {academicStatus === "Other" && (
                    <div className="pt-2 animate-fadeIn">
                      <Input
                        value={customAcademicStatus}
                        onChange={(e) => setCustomAcademicStatus(e.target.value)}
                        placeholder="Specify your academic / career role..."
                        className="font-sans text-sm bg-slate-900/90 border-slate-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Question 04: Focus Days in Last 30 Days */}
              {qIndex === 4 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    How many days in the last 30 days were you focused on a challenge or goal?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Be completely honest. Zero judgment. Quantum requires raw diagnostic truth to calibrate your baseline.
                  </p>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-3xl font-black text-sky-400">
                        {focusDays30}{" "}
                        <span className="text-sm font-normal text-slate-400">/ 30 DAYS</span>
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300">
                        {focusDays30 <= 7 && "CRITICAL FRICTION (0–7)"}
                        {focusDays30 > 7 && focusDays30 <= 15 && "MODERATE DRIFT (8–15)"}
                        {focusDays30 > 15 && focusDays30 <= 24 && "DISCIPLINED (16–24)"}
                        {focusDays30 > 24 && "ELITE MOMENTUM (25–30)"}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={focusDays30}
                      onChange={(e) => setFocusDays30(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />

                    <div className="flex justify-between font-mono text-[10px] text-slate-500">
                      <span>0 DAYS (SCATTERED)</span>
                      <span>15 DAYS (50% CONSISTENCY)</span>
                      <span>30 DAYS (UNBROKEN)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Question 05: Screen Time Apps */}
              {qIndex === 5 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Check your screen time. Which apps consume most of your time?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Select all apps that leak your attention, and estimate your daily phone screen time.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {SCREEN_TIME_APP_OPTIONS.map((app) => {
                      const isSelected = screenTimeApps.includes(app);
                      return (
                        <button
                          key={app}
                          type="button"
                          onClick={() => toggleArrayItem(screenTimeApps, setScreenTimeApps, app)}
                          className={cn(
                            "p-3 rounded-xl border font-sans text-xs font-semibold text-center transition flex flex-col items-center justify-center gap-1.5",
                            isSelected
                              ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-md shadow-sky-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <Smartphone size={16} className={isSelected ? "text-sky-400" : "text-slate-600"} />
                          <span>{app}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 space-y-1.5 max-w-xs font-mono text-xs">
                    <label className="text-slate-400">ESTIMATED DAILY SCREEN TIME (HOURS)</label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="16"
                      value={dailyScreenHours}
                      onChange={(e) => setDailyScreenHours(e.target.value)}
                      className="bg-slate-900/90 border-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Question 06: Recent Completion */}
              {qIndex === 6 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is the most recent thing you started and successfully completed?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Examples: A book, a 7-day challenge, an exam, a workout cycle, a coding project, or learning a specific skill.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={completedRecent}
                      onChange={(e) => setCompletedRecent(e.target.value)}
                      placeholder="e.g. Completed a 14-day calisthenics routine, finished reading 'Atomic Habits', and shipped a portfolio website."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Question 07: Avoided Task */}
              {qIndex === 7 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is the ONE task you have been avoiding for weeks?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    The obstacle you actively postpone is usually the exact threshold to your next breakthrough.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={avoidedTask}
                      onChange={(e) => setAvoidedTask(e.target.value)}
                      placeholder="e.g. Studying for competitive exams daily without distraction, pitching my freelance services, starting a gym routine."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Question 08: Broken Promise */}
              {qIndex === 8 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What was the last promise you made to yourself and broke?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Self-trust is rebuilt the moment broken promises are recognized and permanently addressed.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={brokenPromise}
                      onChange={(e) => setBrokenPromise(e.target.value)}
                      placeholder="e.g. Promised to wake up at 6:00 AM every day and stop looking at my phone in bed, but gave up after day 3."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Question 09: Sleep & Wake */}
              {qIndex === 9 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What time do you usually sleep and wake up?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Circadian alignment stabilizes dopamine baselines and preserves high cognitive output during deep work blocks.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                    <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2 text-sky-300">
                        <Moon size={16} />
                        <span>USUAL SLEEP TIME</span>
                      </div>
                      <Input
                        type="time"
                        value={sleepTime}
                        onChange={(e) => setSleepTime(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Sun size={16} />
                        <span>USUAL WAKE TIME</span>
                      </div>
                      <Input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Question 10: Financial Profile (Optional) */}
              {qIndex === 10 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis (Optional)
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Do you currently earn?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    This question is strictly optional and contextualizes your current responsibilities and daily pressures.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {FINANCIAL_OPTIONS.map((opt) => {
                      const isSelected = financialStatus === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFinancialStatus(opt)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border font-sans text-xs sm:text-sm font-semibold transition text-left",
                            isSelected
                              ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-md shadow-sky-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <span>{opt}</span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border",
                              isSelected
                                ? "bg-sky-500 border-sky-400 text-slate-950"
                                : "border-slate-700"
                            )}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question 11: Career Path */}
              {qIndex === 11 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What career or path are you pursuing right now?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Define your craft, target industry, or aspirational mission.
                  </p>

                  <div className="pt-2">
                    <Input
                      value={careerPath}
                      onChange={(e) => setCareerPath(e.target.value)}
                      placeholder="e.g. AI / Full-Stack Software Engineering, Civil Services, Quant Finance, Founder"
                      autoFocus
                      className="text-sm sm:text-base h-12 bg-slate-900/90 border-slate-700 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Question 12: First & Last App */}
              {qIndex === 12 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Which app do you open first in the morning, and last before sleep?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    First and last neural inputs trigger dopamine spikes that either anchor discipline or feed distraction loops.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-slate-400">FIRST APP OPENED IN MORNING</label>
                      <Input
                        value={firstApp}
                        onChange={(e) => setFirstApp(e.target.value)}
                        placeholder="e.g. Instagram, WhatsApp, Alarm"
                        className="bg-slate-900/90 border-slate-700 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-slate-400">LAST APP BEFORE SLEEPING</label>
                      <Input
                        value={lastApp}
                        onChange={(e) => setLastApp(e.target.value)}
                        placeholder="e.g. YouTube, Reels, Podcasts"
                        className="bg-slate-900/90 border-slate-700 font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Question 13: Distraction Environment */}
              {qIndex === 13 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    When you lose focus or get distracted, what is usually happening around you?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Identify your primary failure triggers so Quantum Core can construct effective countermeasures.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {DISTRACTION_TRIGGER_OPTIONS.map((trigger) => {
                      const isSelected = distractions.includes(trigger);
                      return (
                        <button
                          key={trigger}
                          type="button"
                          onClick={() => toggleArrayItem(distractions, setDistractions, trigger)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border font-sans text-xs sm:text-sm font-semibold transition text-left",
                            isSelected
                              ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-md shadow-sky-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <span>{trigger}</span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border",
                              isSelected
                                ? "bg-sky-500 border-sky-400 text-slate-950"
                                : "border-slate-700"
                            )}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question 14: Protect 1 Standard & Eliminate 1 Bad Habit */}
              {qIndex === 14 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Protect One Standard & Eliminate One Leak
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    If you could protect only ONE daily habit for 90 days, and eliminate ONE bad habit completely...
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-emerald-400 flex items-center gap-1.5 font-bold">
                        <Check size={14} /> ONE DAILY HABIT TO PROTECT AT ALL COSTS
                      </label>
                      <Input
                        value={protectWhat}
                        onChange={(e) => setProtectWhat(e.target.value)}
                        placeholder="e.g. 45-min heavy workout, 2 hours uninterrupted coding, meditation"
                        className="bg-slate-900/90 border-slate-700 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-red-400 flex items-center gap-1.5 font-bold">
                        <AlertCircle size={14} /> ONE TOXIC HABIT TO PERMANENTLY BAN
                      </label>
                      <Input
                        value={changeWhat}
                        onChange={(e) => setChangeWhat(e.target.value)}
                        placeholder="e.g. Scrolling social media in bed, skipping workout when tired, processed sugar"
                        className="bg-slate-900/90 border-slate-700 font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Question 15: Primary & Secondary 90-Day Goals */}
              {qIndex === 15 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                    Part 02 • Quantum Personal Analysis
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Define Your 90-Day Arc Objectives
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    These are the twin pillars of your 90-Day Winter Arc. Vague goals yield vague outcomes. Be precise.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-sky-400 flex items-center gap-1.5 font-bold">
                        <Target size={14} /> PRIMARY 90-DAY GOAL (NON-NEGOTIABLE CORE)
                      </label>
                      <textarea
                        rows={3}
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                        placeholder="e.g. Build and launch a full production SaaS platform while reducing body fat to 12% through daily conditioning."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-cyan-400 flex items-center gap-1.5 font-bold">
                        <Sparkles size={14} /> SECONDARY 90-DAY GOAL (SUPPORTING COMPOUND HABIT)
                      </label>
                      <textarea
                        rows={2}
                        value={secondaryGoal}
                        onChange={(e) => setSecondaryGoal(e.target.value)}
                        placeholder="e.g. Read 6 non-fiction books and maintain zero phone use before 09:00 AM."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                {qIndex > 1 ? (
                  <Button
                    variant="ghost"
                    onClick={handlePrevQuestion}
                    className="gap-1.5 text-slate-400 font-mono text-xs"
                  >
                    <ArrowLeft size={16} /> BACK
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  variant="quantum"
                  onClick={handleNextQuestion}
                  disabled={qIndex === 1 && !name.trim()}
                  className="gap-2 font-mono text-xs font-bold"
                >
                  <span>{qIndex === 15 ? "INITIALIZE AI ANALYSIS" : "CONTINUE"}</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* =========================================================================
            INTERMISSION SCREEN: PART 1 COMPLETE → COMMENCE PART 2
            ========================================================================= */}
        {stage === "intermission" && (
          <div className="bg-slate-950/90 border border-sky-500/30 p-8 sm:p-12 rounded-2xl backdrop-blur-2xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <Sparkles size={30} />
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-sky-400 tracking-[0.3em] uppercase">
                Profile Calibrated
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                BASIC PROFILE SECURED
              </h2>
              <p className="text-slate-300 text-sm max-w-lg mx-auto font-sans leading-relaxed">
                Welcome, <span className="text-sky-300 font-bold">{name}</span>. Now QUANTUM Core requires deep diagnostic insight into your current daily routines, screen time leaks, and friction points to construct your customized 90-day trajectory.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <LiquidButton
                onClick={() => {
                  setStage("questionnaire");
                  setQIndex(4);
                }}
                size="lg"
                className="shadow-[0_0_35px_rgba(56,189,248,0.4)] border-sky-400"
              >
                <span>COMMENCE QUANTUM ANALYSIS</span>
                <ArrowRight size={18} className="ml-2 text-sky-300" />
              </LiquidButton>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: AI ANALYSIS LOADING (Cinematic Diagnostics)
            ========================================================================= */}
        {stage === "ai_analyzing" && (
          <div className="bg-slate-950/90 border border-sky-500/30 p-8 sm:p-14 rounded-2xl backdrop-blur-2xl text-center space-y-6 shadow-2xl">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-cyan-500/30 border-b-cyan-300 animate-spin reverse" />
              <div className="absolute inset-0 flex items-center justify-center text-sky-400">
                <Cpu size={28} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-sky-400 tracking-[0.3em] uppercase animate-pulse">
                Quantum Core Analysis Active
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                ANALYZING YOUR ARC TRAJECTORY
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-mono">
                Processing screen time telemetry, circadian rhythms, habit friction, and non-negotiables...
              </p>
            </div>

            {/* Diagnostic Terminal Stream */}
            <div className="max-w-md mx-auto bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 text-left font-mono text-[11px] text-sky-300/80 space-y-1">
              <div>&gt; INGESTING PARTICIPANT TELEMETRY: {name.toUpperCase()}</div>
              <div>&gt; DETECTED 30-DAY FOCUS BASELINE: {focusDays30}/30 DAYS</div>
              <div>&gt; ISOLATING DISTRACTION NODES: {screenTimeApps.slice(0, 3).join(", ")}</div>
              <div>&gt; GENERATING ADAPTIVE 90-DAY PROTOCOL MATRIX...</div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3: AI ANALYSIS RESULTS
            ========================================================================= */}
        {stage === "ai_result" && aiAnalysis && (
          <div className="bg-slate-950/90 border border-sky-500/30 p-6 sm:p-10 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="font-mono text-xs text-sky-400 tracking-widest uppercase">
                  AI Tactical Assessment
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  QUANTUM CORE OBSERVATION
                </h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs">
                SYNTHESIS 100%
              </div>
            </div>

            {/* Strategic Summary Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-900/60 border border-sky-500/40 font-sans text-sm text-slate-200 leading-relaxed">
              <div className="font-mono text-xs text-sky-400 font-bold mb-1.5 flex items-center gap-1.5">
                <Shield size={14} /> STRATEGIC EXECUTIVE SUMMARY
              </div>
              {aiAnalysis.arc_summary}
            </div>

            {/* Identified Friction Points */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                IDENTIFIED MOMENTUM LEAKS & FRICTION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {aiAnalysis.focus_obstacles.map((obs, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 font-sans text-xs text-red-200"
                  >
                    <div className="font-mono text-[10px] text-red-400 font-bold uppercase mb-1">
                      LEAK 0{idx + 1}
                    </div>
                    {obs}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Habits Arsenal */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>TAILORED DAILY HABIT MATRIX</span>
                <span className="text-sky-400 text-[10px]">ALL 4 ENABLED</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aiAnalysis.recommended_habits.map((habit, idx) => {
                  const isSelected = selectedHabits.includes(habit);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleArrayItem(selectedHabits, setSelectedHabits, habit)}
                      className={cn(
                        "p-3 rounded-xl border font-mono text-xs font-bold transition flex items-center justify-between text-left",
                        isSelected
                          ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-sm"
                          : "bg-slate-900/60 border-slate-800 text-slate-500"
                      )}
                    >
                      <span>{habit}</span>
                      <div
                        className={cn(
                          "w-4 h-4 rounded flex items-center justify-center border",
                          isSelected ? "bg-sky-500 border-sky-400 text-slate-950" : "border-slate-700"
                        )}
                      >
                        {isSelected && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accountability Strategy */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-sans text-xs text-slate-300">
              <span className="font-mono font-bold text-sky-400 uppercase block mb-1">
                PSYCHOLOGICAL RESET DIRECTIVE:
              </span>
              {aiAnalysis.accountability_strategy}
            </div>

            {/* Proceed to Contract Button */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                variant="quantum"
                onClick={handleProceedToContract}
                className="gap-2 font-mono text-xs font-bold px-6 py-2.5"
              >
                <span>PROCEED TO 90-DAY COMMITMENT</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 4: 90-DAY COMMITMENT CONTRACT QUESTIONS (8 QUESTIONS)
            ========================================================================= */}
        {stage === "contract_questions" && (
          <AnimatePresence mode="wait">
            <motion.div
              key={cqIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-950/85 border border-cyan-500/30 p-6 sm:p-10 rounded-2xl backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.12)] space-y-6"
            >
              {/* CQ01: Confirm Primary & Secondary Goal */}
              {cqIndex === 1 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 01 / 08 • Strategic Directive
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Confirm your 90-day primary and secondary objectives.
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Review and refine the exact phrasing that will be ratified into your legally dignified covenant.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-sky-400 font-bold">PRIMARY 90-DAY OBJECTIVE</label>
                      <textarea
                        rows={2}
                        value={cqPrimaryGoal}
                        onChange={(e) => setCqPrimaryGoal(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <label className="text-cyan-400 font-bold">SECONDARY 90-DAY OBJECTIVE</label>
                      <textarea
                        rows={2}
                        value={cqSecondaryGoal}
                        onChange={(e) => setCqSecondaryGoal(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CQ02: Proof of Progress */}
              {cqIndex === 2 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 02 / 08 • Verifiable Proof
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What will be the physical or measurable proof that you completed this goal after 90 days?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Examples: A deployed web application, an uploaded portfolio of 10 designs, a 5km run under 22 minutes, or a physical logbook.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={cqProofMethod}
                      onChange={(e) => setCqProofMethod(e.target.value)}
                      placeholder="e.g. A fully deployed production platform repository, daily execution timestamps in Quantum, and a visible 12% body composition photo."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* CQ03: 90-Day Arc Non-Negotiable Standard */}
              {cqIndex === 3 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 03 / 08 • Daily Standard
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is the daily standard you commit to executing, even when you have zero motivation?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Discipline is doing what must be done regardless of passing emotions or temporary fatigue.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={cqArcCommitment}
                      onChange={(e) => setCqArcCommitment(e.target.value)}
                      placeholder="e.g. 2 hours of focused deep work, 45 minutes of physical training, and completing my full habit matrix before 22:00."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* CQ04: Bad Day Protocol */}
              {cqIndex === 4 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 04 / 08 • Emergency Protocol
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    When you feel like quitting or skipping a day, what exact protocol will you follow instead of doing nothing?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Define your emergency micro-standard so you never drop to absolute zero.
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={cqBadDayProtocol}
                      onChange={(e) => setCqBadDayProtocol(e.target.value)}
                      placeholder="e.g. Execute an emergency 15-minute workout and write 1 page of study notes. A small rep keeps the neural habit alive."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* CQ05: Distraction Sacrifice */}
              {cqIndex === 5 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 05 / 08 • Sacrifice Directive
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    What is the #1 distraction you agree to restrict, remove, or strictly limit during this 90-day arc?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Transformation requires voluntary sacrifice. What dopamine leak are you cutting off?
                  </p>

                  <div className="pt-2">
                    <textarea
                      rows={3}
                      value={cqDistractionStrategy}
                      onChange={(e) => setCqDistractionStrategy(e.target.value)}
                      placeholder="e.g. Delete Instagram and YouTube from phone during daytime. Zero smartphone screen time in bed after 22:30."
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* CQ06: Consistency Checkpoint */}
              {cqIndex === 6 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 06 / 08 • Accountability Anchor
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Who or what will keep you accountable when excuses show up?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Select your primary accountability anchor to audit daily integrity.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ACCOUNTABILITY_OPTIONS.map((opt) => {
                      const isSelected = cqConsistencyCheckpoint === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCqConsistencyCheckpoint(opt)}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border font-sans text-xs sm:text-sm font-semibold transition text-left",
                            isSelected
                              ? "bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <span>{opt}</span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border",
                              isSelected
                                ? "bg-cyan-500 border-cyan-400 text-slate-950"
                                : "border-slate-700"
                            )}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CQ07: Continuation Agreement */}
              {cqIndex === 7 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 07 / 08 • The Reset Covenant
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    If you fail or miss a day, do you agree to get back on track within 24 hours without abandoning the arc?
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Slips are data, not reasons to surrender. The 24-hour reset covenant guarantees continuity.
                  </p>

                  <div className="space-y-3 pt-2">
                    {[
                      "Yes — I commit to the 24-hour reset standard without abandoning the arc.",
                      "I accept absolute personal responsibility for my momentum and recovery.",
                    ].map((agree) => {
                      const isSelected = cqContinuationPlan === agree;
                      return (
                        <button
                          key={agree}
                          type="button"
                          onClick={() => setCqContinuationPlan(agree)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border font-sans text-sm font-bold transition text-left",
                            isSelected
                              ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/15"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          )}
                        >
                          <span>{agree}</span>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border",
                              isSelected
                                ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                : "border-slate-700"
                            )}
                          >
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CQ08: Digital Cursive Signature */}
              {cqIndex === 8 && (
                <div className="space-y-4">
                  <div className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
                    Contract Question 08 / 08 • Immutable Seal
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Sign your name to bind this agreement.
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Draw your cursive signature below using your mouse, stylus, or finger. This vector signature will be bound to your printable A4 covenant.
                  </p>

                  <div className="pt-2">
                    <SignatureCanvas
                      initialSignature={signatureUrl}
                      onSignatureChange={(sig) => setSignatureUrl(sig)}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <Button
                  variant="ghost"
                  onClick={handlePrevContractQ}
                  disabled={cqIndex === 1}
                  className="gap-1.5 text-slate-400 font-mono text-xs"
                >
                  <ArrowLeft size={16} /> BACK
                </Button>

                <Button
                  variant="quantum"
                  onClick={handleNextContractQ}
                  disabled={cqIndex === 8 && !signatureUrl}
                  className="gap-2 font-mono text-xs font-bold"
                >
                  <span>{cqIndex === 8 ? "SEAL IMMUTABLE CONTRACT" : "NEXT QUESTION"}</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* =========================================================================
            STAGE 5: CONTRACT GENERATING LOADING STATE
            ========================================================================= */}
        {stage === "contract_generating" && (
          <div className="bg-slate-950/90 border border-emerald-500/30 p-8 sm:p-14 rounded-2xl backdrop-blur-2xl text-center space-y-6 shadow-2xl">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-sky-500/30 border-b-sky-300 animate-spin reverse" />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                <Shield size={28} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs text-emerald-400 tracking-[0.3em] uppercase animate-pulse">
                Polishing First-Person Covenant
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                GENERATING IMMUTABLE CONTRACT
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-mono">
                Transforming diagnostic responses into solemn first-person statements and ratifying official serial record...
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 6: OFFICIAL INDUCTION ARTIFACTS (HABIT TRACKER & SIGNED CONTRACT)
            ========================================================================= */}
        {stage === "contract_preview" && contractResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Notification & Control Bar (Hidden during print) */}
            <div className="no-print bg-slate-900/90 border border-slate-700/80 p-4 sm:p-6 rounded-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 size={16} /> 90-DAY CONTRACT RATIFIED & SIGNED
                </div>
                <p className="text-slate-300 text-xs font-sans">
                  Your covenant is rendered in pure white A4 print proportions with your digital signature and official stamp.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handlePrintContract}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs gap-1.5 border-slate-700 hover:border-slate-500 text-slate-200"
                >
                  <Printer size={14} />
                  <span>PRINT (A4)</span>
                </Button>

                <Button
                  onClick={handleDownloadContract}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs gap-1.5 border-sky-700 hover:border-sky-500 text-sky-300 hover:bg-sky-950/40"
                >
                  <Download size={14} />
                  <span>DOWNLOAD CONTRACT</span>
                </Button>
              </div>
            </div>

            {/* Official Pure White A4 Contract Document */}
            <QuantumContractDocument
              participant={{
                name: name || "Challenger",
                age: age || "21",
                academicStatus:
                  academicStatus === "Other"
                    ? customAcademicStatus || "Independent"
                    : academicStatus,
                username: name.toUpperCase().replace(/\s+/g, "_"),
              }}
              contract={contractResult}
              signatureUrl={signatureUrl}
            />

            {/* Start My Journey Transition Button */}
            <div className="no-print text-center pt-6 space-y-3">
              <LiquidButton
                onClick={handleStartJourney}
                size="xxl"
                className="shadow-[0_0_50px_rgba(56,189,248,0.5)] border-sky-400"
              >
                <span>ENTER THE 90-DAY PORTAL</span>
                <Flame size={22} className="text-sky-300 ml-2 animate-pulse" />
              </LiquidButton>
              <div className="text-[11px] font-mono text-slate-500">
                PORTAL INITIALIZATION COMMENCES 90-DAY SEQUENCE
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto text-center font-mono text-[10px] text-slate-600 py-3 border-t border-slate-900 no-print">
        QUANTUM OPERATING SYSTEM • IMMUTABLE 90-DAY WINTER ARC INDUCTION
      </footer>
    </main>
  );
}
