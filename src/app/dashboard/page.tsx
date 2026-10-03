"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Zap,
  Flame,
  Trophy,
  Brain,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  User,
  Smartphone,
  Info,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award,
  Upload,
  Clock,
  Plus,
  CheckCircle2,
  Check,
  AlertCircle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Camera,
  Trash2,
  Film,
  Sparkles,
  FileText,
  Lock,
  Moon,
  Sun,
  Target,
  Compass,
  Printer,
  Download,
  ExternalLink,
  Eye,
  RefreshCw,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HabitMatrix, { HabitItem } from "@/components/habits/habit-matrix";
import AIChatInput from "@/components/ui/ai-chat-input";
import QuantumContractDocument, { downloadContractImage } from "@/components/onboarding/quantum-contract-document";
import PhysicalHabitTracker from "@/components/onboarding/physical-habit-tracker";
import HabitTrackerSurpriseModal from "@/components/dashboard/habit-tracker-surprise-modal";
import QuantumCompletionCertificate, {
  downloadCertificateImage,
  QuantumCertificateData,
} from "@/components/certificate/quantum-completion-certificate";
import AvatarCropModal from "@/components/ui/avatar-crop-modal";
import ArcCompletionCelebration from "@/components/certificate/arc-completion-celebration";
import { LevelUpModal, LevelUpData } from "@/components/ui/level-up-modal";
import { LiveExecutionProofSection } from "@/components/dashboard/live-execution-proof-section";
import ThreeDWallCalendar from "@/components/ui/three-dwall-calendar";
import DraggableWidgetGrid, { WidgetItem } from "@/components/ui/draggable-widget-grid";
import { useAudio } from "@/components/audio/audio-provider";
import { useTheme } from "@/components/theme/theme-provider";
import MotivationalModal from "@/components/motivation/motivational-modal";
import {
  evaluateUserConsistency,
  hasAcknowledgedIntervention,
  markInterventionAcknowledged,
  StruggleAnalysis,
} from "@/lib/motivation/consistency-evaluator";
import MobileRotatingShowcase from "@/components/ui/mobile-rotating-showcase";
import QuantumMobileExperience from "@/components/landing/quantum-mobile-experience";
import AboutSection from "@/components/landing/about-section";
import QuantumSupportModal from "@/components/donations/quantum-support-modal";
import { cn, formatXP, calculateLevel, getActiveWinterArcDay, getTimeUntilMidnight } from "@/lib/utils";

type NavTab =
  | "TASK"
  | "ANALYTICS"
  | "SKILLS"
  | "GALLERY"
  | "COMPETITION"
  | "PROFILE"
  | "AI"
  | "APP"
  | "ABOUT"
  | "SETTINGS";

// Utility to compress an image file from the device gallery/camera into a clean base64 data URL
const compressImageFile = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.85,
  squareCrop: boolean = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (squareCrop) {
          // Center square crop for perfect profile avatar
          const size = Math.min(width, height);
          const startX = (width - size) / 2;
          const startY = (height - size) / 2;
          const targetSize = Math.min(size, maxWidth);
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, startX, startY, size, size, 0, 0, targetSize, targetSize);
          }
        } else {
          // Aspect-ratio preserving resize for gallery proof
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
          }
        }

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const FormattedAiMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet points (• or - or *)
        const isBullet = /^[•\-*]\s+/.test(trimmed);
        const bulletText = isBullet ? trimmed.replace(/^[•\-*]\s+/, "") : trimmed;

        // Numbered list (1. or 2.)
        const isNumbered = /^\d+\.\s+/.test(trimmed);
        const numberMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);

        // Helper to format bold text: **text** -> <strong className="text-white font-bold">text</strong>
        const renderTextWithBold = (txt: string) => {
          const parts = txt.split(/(\*\*[^*]+\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="text-white font-bold tracking-normal">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          });
        };

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 text-slate-200">
              <span className="text-sky-400 font-bold mt-1 text-[11px] leading-none shrink-0">•</span>
              <div className="flex-1 leading-relaxed">{renderTextWithBold(bulletText)}</div>
            </div>
          );
        }

        if (isNumbered && numberMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 text-slate-200">
              <span className="text-sky-400 font-mono font-bold text-xs shrink-0">{numberMatch[1]}</span>
              <div className="flex-1 leading-relaxed">{renderTextWithBold(numberMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-200 leading-relaxed">
            {renderTextWithBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { playTrack, soundEnabled, toggleSound } = useAudio();
  const { theme, setTheme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<NavTab>("TASK");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User State
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Motivational Intervention State
  const [isMotivationalModalOpen, setIsMotivationalModalOpen] = useState(false);
  const [struggleState, setStruggleState] = useState<StruggleAnalysis | null>(null);

  // Gallery Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadDay, setUploadDay] = useState(1);
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadIsPublic, setUploadIsPublic] = useState(true);
  const [uploadFileType, setUploadFileType] = useState<"image" | "video">("image");
  const [isProofUploading, setIsProofUploading] = useState(false);
  const proofFileRef = useRef<HTMLInputElement | null>(null);

  // Gallery Proof Management States (View Lightbox, Delete Confirm, Replace Modal)
  const [viewingProof, setViewingProof] = useState<any | null>(null);
  const [deletingProof, setDeletingProof] = useState<any | null>(null);
  const [replacingProof, setReplacingProof] = useState<any | null>(null);

  // Level Up Celebration Animation Modal State
  const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null);
  const [replaceFileUrl, setReplaceFileUrl] = useState("");
  const [replaceCaption, setReplaceCaption] = useState("");
  const [isReplacingProof, setIsReplacingProof] = useState(false);
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Hey! Main tumhara Quantum AI copilot hoon. Daily routine, study timetable, micro-tasks ya streak ke baare me jo bhi puchhna ho, direct puchho.",
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Technical Mastery");

  // Profile Avatar Management & Gallery Direct File Picker
  const [customAvatarInput, setCustomAvatarInput] = useState("");
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState("");
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [cropModalSrc, setCropModalSrc] = useState<string | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  // 90-Day Arc Completion Certificate & Celebration State
  const [isArcCompleted, setIsArcCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<QuantumCertificateData | null>(null);
  const [isCompletionCertModalOpen, setIsCompletionCertModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isTriggeringCompletion, setIsTriggeringCompletion] = useState(false);
  const [isSurpriseTrackerOpen, setIsSurpriseTrackerOpen] = useState(false);
  const [forceUnsealedTracker, setForceUnsealedTracker] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const profileFileRef = useRef<HTMLInputElement | null>(null);

  // 24-Hour Protocol Clock & Midnight Reset State
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("");
  const [timeUntilMidnightFormatted, setTimeUntilMidnightFormatted] = useState("");
  const [activeWinterArcDay, setActiveWinterArcDay] = useState(1);

  // 24-Hour live clock ticking & active day calculation (12:00 AM Midnight Reset)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setCurrentTimeFormatted(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);

      const { formatted } = getTimeUntilMidnight();
      setTimeUntilMidnightFormatted(formatted);

      if (user?.profile?.startDate || user?.createdAt) {
        const day = getActiveWinterArcDay(user.profile?.startDate || user.createdAt);
        setActiveWinterArcDay(day);
      } else {
        // New user login cleanly initializes to Day 1
        setActiveWinterArcDay(1);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Trigger surprise physical habit tracker popup on first entry into command center
  useEffect(() => {
    try {
      const hasSeenSurprise = localStorage.getItem("quantum_habit_tracker_surprise_opened_v1");
      if (!hasSeenSurprise) {
        const timer = setTimeout(() => {
          setForceUnsealedTracker(false);
          setIsSurpriseTrackerOpen(true);
        }, 1100);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage access error
    }
  }, []);

  // Quantum Core AI chat auto-scroll ref and handler
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToChatBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  // Auto-scroll when messages update, AI loading state changes, or user switches to AI tab
  useEffect(() => {
    if (activeTab === "AI") {
      scrollToChatBottom("smooth");
    }
  }, [aiMessages, isAiLoading, activeTab, scrollToChatBottom]);

  const handleSelectAvatar = async (avatarUrl: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: avatarUrl }),
      });
      if (res.ok) {
        setUser((prev: any) => ({
          ...prev,
          profile: {
            ...prev?.profile,
            avatar: avatarUrl,
          },
        }));
        setAvatarSuccessMsg(avatarUrl ? "Challenger avatar updated!" : "Avatar removed");
        setTimeout(() => setAvatarSuccessMsg(""), 3500);
      }
    } catch (err) {
      console.error("Failed to update avatar", err);
    }
  };

  // Direct Gallery Selection for Profile Avatar
  const handleProfileGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarSuccessMsg("Please choose an image file (JPG, PNG, WebP).");
      setTimeout(() => setAvatarSuccessMsg(""), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropModalSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = "";
  };

  // Direct Gallery Selection for Daily Proof of Work (9:16 Photo or Video)
  const handleProofGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProofUploading(true);
      if (file.type.startsWith("video/")) {
        // Video file support for 9:16 vertical reels/stories
        if (file.size > 50 * 1024 * 1024) {
          alert("Video size exceeds 50MB limit. Please select a shorter vertical clip.");
          setIsProofUploading(false);
          return;
        }
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          setUploadFileUrl(result);
          setUploadFileType("video");
          setIsProofUploading(false);
        };
        reader.onerror = () => {
          setIsProofUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      } else {
        // 9:16 target vertical image compression (1080x1920)
        const compressedDataUrl = await compressImageFile(file, 1080, 1920, 0.85, false);
        setUploadFileUrl(compressedDataUrl);
        setUploadFileType("image");
      }
    } catch (err) {
      console.error("Proof photo/video upload error:", err);
    } finally {
      setIsProofUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  // Check consistency and evaluate struggle state
  const checkConsistency = useCallback((currentHabits: HabitItem[], currentStreakData: any) => {
    if (!currentHabits || currentHabits.length === 0) return;
    const analysis = evaluateUserConsistency(currentHabits, currentStreakData);
    if (analysis.isStruggling) {
      setStruggleState(analysis);
      if (!hasAcknowledgedIntervention(analysis.signature)) {
        setIsMotivationalModalOpen(true);
      }
    }
  }, []);

  // Load Dashboard Data on Mount
  useEffect(() => {
    playTrack("dashboard");

    const fetchAllData = async () => {
      try {
        const [meRes, habitsRes, skillsRes, galleryRes, compRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/habits"),
          fetch("/api/skills"),
          fetch("/api/gallery"),
          fetch("/api/competition"),
        ]);

        const meData = await meRes.json();
        if (!meData.user) {
          router.push("/login");
          return;
        }

        if (!meData.user.emailVerified) {
          router.push("/verify-email");
          return;
        }

        if (!meData.user.profile?.onboardingDone) {
          router.push("/onboarding");
          return;
        }

        setUser(meData.user);

        let loadedHabits: HabitItem[] = [];
        if (habitsRes.ok) {
          const hData = await habitsRes.json();
          loadedHabits = hData.habits || [];
          setHabits(loadedHabits);
          // Real habit consistency check on real database records
          checkConsistency(loadedHabits, meData.user.streak);
        }

        if (skillsRes.ok) {
          const sData = await skillsRes.json();
          setSkills(sData.skills || []);
        }

        if (galleryRes.ok) {
          const gData = await galleryRes.json();
          setGallery(gData.items || []);
        }

        if (compRes.ok) {
          const cData = await compRes.json();
          setLeaderboard(cData);
        }

        // Check 90-Day Arc Completion Certificate Status
        try {
          const certRes = await fetch("/api/certificate");
          if (certRes.ok) {
            const certJson = await certRes.json();
            if (certJson.completed && certJson.certificate) {
              setIsArcCompleted(true);
              const dataPayload = certJson.certificate.contractData || {};
              setCompletionData({
                name: certJson.stats.name,
                username: certJson.stats.username,
                primaryGoal: dataPayload.primaryGoal || certJson.stats.primaryGoal,
                secondaryGoal: dataPayload.secondaryGoal || certJson.stats.secondaryGoal,
                totalXP: dataPayload.totalXP || certJson.stats.totalXP,
                consistency: dataPayload.consistency || certJson.stats.consistency,
                completedDays: 90,
                arcId: certJson.certificate.certificateNumber,
                completionDate: new Date(certJson.certificate.endDate || Date.now()).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                startDate: new Date(certJson.certificate.startDate || Date.now()).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
              });
            } else if (certJson.eligible && !certJson.completed) {
              // Eligible for Day 90 completion
              triggerArcCompletion(false);
            }
          }
        } catch (e) {
          console.error("Certificate check error:", e);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [router, playTrack, checkConsistency]);

  const triggerArcCompletion = async (showCelebration = true) => {
    try {
      setIsTriggeringCompletion(true);
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceComplete: true }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsArcCompleted(true);
        const dataPayload = json.data || {};
        const formatted: QuantumCertificateData = {
          name: dataPayload.name || user?.name || "Challenger",
          username: dataPayload.username || user?.username,
          primaryGoal: dataPayload.primaryGoal || user?.profile?.objective || "Master self-discipline",
          secondaryGoal: dataPayload.secondaryGoal || "Peak physical endurance & compounding skills",
          totalXP: dataPayload.totalXP || (user?.profile?.totalXP || 0) + 2500,
          consistency: dataPayload.consistency || user?.streak?.consistencyRate || 94,
          completedDays: 90,
          arcId: json.certificate?.certificateNumber || dataPayload.arcId || "Q-CERT-90ARC",
          completionDate: new Date(json.certificate?.endDate || Date.now()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        };
        setCompletionData(formatted);
        if (showCelebration) {
          setIsCelebrationOpen(true);
        }
      }
    } catch (e) {
      console.error("Failed to trigger Arc completion:", e);
    } finally {
      setIsTriggeringCompletion(false);
    }
  };

  const handleStatsUpdate = (
    newXP: number,
    currentStreak: number,
    consistencyRate?: number,
    isLevelUp?: boolean,
    milestone?: any
  ) => {
    // Exact Winter Arc Level Ladder Check: Day 1, 7, 14, 25, 30, 45, 52, 65, 75, 90
    const levelInfo = calculateLevel(currentStreak);
    const oldLevel = user?.profile?.level || 1;

    const exactMilestoneDays = [1, 7, 14, 25, 30, 45, 52, 65, 75, 90];
    const isExactMilestone = exactMilestoneDays.includes(currentStreak);

    if ((isLevelUp || levelInfo.level > oldLevel || isExactMilestone) && currentStreak >= 1) {
      setLevelUpData({
        level: levelInfo.level,
        tier: levelInfo.tier,
        title: levelInfo.title,
        quote: levelInfo.quote,
        streak: currentStreak,
        badgeColor: levelInfo.badgeColor,
      });
    }

    setUser((prev: any) => {
      if (!prev) return prev;
      const updatedStreak = {
        ...prev.streak,
        currentStreak,
        ...(consistencyRate !== undefined ? { consistencyRate } : {}),
      };
      // Evaluate consistency when habits are completed/missed
      checkConsistency(habits, updatedStreak);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalXP: newXP,
          level: levelInfo.level,
          currentClass: levelInfo.tier,
        },
        streak: updatedStreak,
      };
    });

    if (currentStreak >= 90 && !isArcCompleted) {
      triggerArcCompletion(true);
    }
  };

  const handleHabitsChange = (updatedHabits: HabitItem[]) => {
    setHabits(updatedHabits);
    if (user?.streak) {
      checkConsistency(updatedHabits, user.streak);
    }
  };

  const handleCloseMotivationalModal = () => {
    if (struggleState?.signature) {
      markInterventionAcknowledged(struggleState.signature);
    }
    setIsMotivationalModalOpen(false);
  };

  const handleManualOpenMotivation = () => {
    const analysis = evaluateUserConsistency(habits, user?.streak);
    setStruggleState(
      analysis.isStruggling
        ? analysis
        : {
            isStruggling: true,
            reason: "CONSECUTIVE_MISSED",
            consecutiveMissedDays: 0,
            lastMissedDay: 0,
            brokenStreakLength: user?.streak?.longestStreak || 0,
            currentStreak: user?.streak?.currentStreak || 0,
            longestStreak: user?.streak?.longestStreak || 0,
            consistencyRate: user?.streak?.consistencyRate || 0,
            signature: `manual_${Date.now()}`,
            title: "REINFORCE YOUR RESOLVE.",
            subtitle: "THE WINTER ARC DEMANDS EVERYTHING. GET BACK IN THE ARENA.",
          }
    );
    setIsMotivationalModalOpen(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSendMessage = async (
    message: string,
    options: { thinkActive: boolean; deepSearchActive: boolean }
  ) => {
    setAiMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsAiLoading(true);
    setTimeout(() => scrollToChatBottom("smooth"), 40);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          thinkActive: options.thinkActive,
          deepSearchActive: options.deepSearchActive,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawReply = data.reply || "";
        const cleanReply = rawReply
          .replace(/^#+\s*(QUANTUM\s*CORE|DIRECTIVE|PROTOCOL|STATUS\s*FOR|MISSION)[^\n]*\n+/gim, "")
          .replace(/^\[(QUANTUM|SYSTEM)[^\]]*\]\n*/gim, "")
          .replace(/\*+(Quantum\s*Core\s*(is\s*)?standing\s*by|The\s*Winter\s*Arc\s*yields)[^\n]*\*+/gim, "")
          .trim();
        setAiMessages((prev) => [...prev, { role: "assistant", content: cleanReply || rawReply }]);
        setTimeout(() => scrollToChatBottom("smooth"), 50);
      }
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "System transmission interrupted. Re-establishing Quantum Core link...",
        },
      ]);
      setTimeout(() => scrollToChatBottom("smooth"), 50);
    } finally {
      setIsAiLoading(false);
      setTimeout(() => scrollToChatBottom("smooth"), 80);
    }
  };

  const handleToggleSkillTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/skills/${taskId}/toggle`, { method: "PATCH" });
      if (res.ok) {
        const data = await res.json();
        setSkills((prev) =>
          prev.map((s) => ({
            ...s,
            progress: s.tasks.some((t: any) => t.id === taskId) ? data.progress : s.progress,
            tasks: s.tasks.map((t: any) =>
              t.id === taskId
                ? {
                    ...t,
                    completions: [{ completed: data.completed }],
                  }
                : t
            ),
          }))
        );

        if (user) {
          setUser({
            ...user,
            profile: { ...user.profile, totalXP: data.totalXP },
          });
        }
      }
    } catch (err) {
      console.error("Toggle skill task error", err);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTitle.trim()) return;

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSkillTitle.trim(),
          category: newSkillCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSkills((prev) => [...prev, data.skill]);
        setNewSkillTitle("");
        setIsSkillModalOpen(false);
      }
    } catch (err) {
      console.error("Create skill error", err);
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadCaption.trim()) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayNumber: uploadDay,
          caption: uploadCaption,
          fileUrl: uploadFileUrl || "/assets/images/background.png",
          fileType: uploadFileType,
          isPublic: uploadIsPublic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGallery((prev) => [data.item, ...prev]);
        if (data.xpEarned) {
          setUser((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              profile: {
                ...prev.profile,
                totalXP: (prev.profile?.totalXP || 0) + data.xpEarned,
              },
            };
          });
        }
        setUploadCaption("");
        setUploadFileUrl("");
        setUploadFileType("image");
        setIsUploadModalOpen(false);
      }
    } catch (err) {
      console.error("Upload proof error", err);
    }
  };

  const handleDeleteProof = async () => {
    if (!deletingProof) return;
    const targetId = deletingProof.id;
    try {
      const res = await fetch(`/api/gallery/${targetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGallery((prev) => prev.filter((item) => item.id !== targetId));
      } else {
        console.warn("Delete proof non-200 response, applying optimistic delete");
        setGallery((prev) => prev.filter((item) => item.id !== targetId));
      }
    } catch (err) {
      console.error("Delete proof error", err);
      setGallery((prev) => prev.filter((item) => item.id !== targetId));
    } finally {
      setDeletingProof(null);
    }
  };

  const handleReplaceProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingProof) return;
    setIsReplacingProof(true);
    const targetId = replacingProof.id;
    const newFileUrl = replaceFileUrl || replacingProof.fileUrl;
    const newCaption = replaceCaption !== undefined ? replaceCaption.trim() : replacingProof.caption;

    try {
      const res = await fetch(`/api/gallery/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: newFileUrl,
          caption: newCaption,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGallery((prev) =>
          prev.map((item) => (item.id === targetId ? data.item : item))
        );
      } else {
        console.warn("Replace proof non-200 response, applying optimistic update");
        setGallery((prev) =>
          prev.map((item) =>
            item.id === targetId
              ? { ...item, fileUrl: newFileUrl, caption: newCaption }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Replace proof error", err);
      setGallery((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? { ...item, fileUrl: newFileUrl, caption: newCaption }
            : item
        )
      );
    } finally {
      setReplacingProof(null);
      setReplaceFileUrl("");
      setReplaceCaption("");
      setIsReplacingProof(false);
    }
  };

  const handleReplaceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageFile(file, 1280, 960, 0.85, false);
        setReplaceFileUrl(compressedDataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const base64 = uploadEvent.target?.result as string;
          setReplaceFileUrl(base64);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#02050f] text-white flex flex-col items-center justify-center font-mono space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
        <div className="text-xs tracking-widest text-sky-400">INITIALIZING QUANTUM TELEMETRY...</div>
      </div>
    );
  }

  const userXP = user?.profile?.totalXP || 0;
  const currentStreak = user?.streak?.currentStreak || 0;
  const longestStreak = user?.streak?.longestStreak || 0;
  const consistencyRate = user?.streak?.consistencyRate || 0;
  const levelInfo = calculateLevel(currentStreak);
  const { level, tier, progressPercent } = levelInfo;

  return (
    <div className="relative min-h-screen bg-[#02050f] text-slate-100 flex overflow-hidden selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Command Center Cyberpunk Background Graphic Asset */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/images/background.png"
          alt="Command Center Matrix Background"
          fill
          priority
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02050f]/75 via-[#02050f]/35 to-[#02050f]/85 backdrop-blur-[2px]" />
      </div>

      {/* ============================================================
          SIDEBAR NAVIGATION (Matches Directive Section 13)
          ============================================================ */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/45 border-r border-white/10 p-5 flex flex-col justify-between transition-transform duration-300 backdrop-blur-2xl md:translate-x-0 shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-sky-400/40 bg-slate-950/60 p-0.5 flex items-center justify-center text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)] shrink-0">
                <Image
                  src="/assets/images/logo/logo.png"
                  alt="Quantum Logo"
                  width={30}
                  height={30}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-wider text-white">QUANTUM</div>
                <div className="text-[9px] font-mono text-sky-400">COMMAND CENTER</div>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Micro Profile */}
          <div className="p-3 rounded-xl bg-black/35 backdrop-blur-xl border border-white/10 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full border border-sky-400/40 overflow-hidden shrink-0 shadow-sm aspect-square bg-slate-900/60 flex items-center justify-center">
              {user?.profile?.avatar ? (
                <Image
                  src={user.profile.avatar}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sky-500/20 text-sky-400 text-sm font-bold font-mono">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
              )}
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-white truncate">{user?.name}</div>
              <div className="text-[10px] font-mono text-sky-400 truncate">
                Lvl {level} • {tier}
              </div>
            </div>
          </div>

          {/* Nav Items (Task, Analytics, Skills, Gallery, Competition, Profile, AI, App, About) */}
          <nav className="space-y-1 font-mono text-xs">
            {[
              { id: "TASK", label: "TASK (HABITS)", icon: Zap },
              { id: "ANALYTICS", label: "ANALYTICS", icon: TrendingUp },
              { id: "SKILLS", label: "SKILLS", icon: Award },
              { id: "GALLERY", label: "GALLERY", icon: ImageIcon },
              { id: "COMPETITION", label: "COMPETITION", icon: Trophy },
              { id: "PROFILE", label: "PROFILE", icon: User },
              { id: "AI", label: "QUANTUM CORE", icon: Brain },
              { id: "APP", label: "APP MOBILE", icon: Smartphone },
              { id: "ABOUT", label: "ABOUT", icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as NavTab);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-left",
                    isActive
                      ? "bg-sky-500/15 border border-sky-400/40 text-sky-300 font-bold shadow-md shadow-sky-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-sky-400" : "text-slate-500"} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={13} className="text-sky-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nav Items: Support / Donate, Super Admin, Settings & Log Out */}
        <div className="pt-4 border-t border-slate-900 space-y-1 font-mono text-xs">
          <button
            onClick={() => {
              setIsSupportModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-amber-500/15 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold hover:scale-[1.02] hover:border-rose-400 transition shadow-[0_0_15px_rgba(244,63,94,0.2)] mb-1.5 group"
          >
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-rose-400 fill-rose-500/30 group-hover:scale-110 transition-transform" />
              <span>DONATE / SUPPORT</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono">SUPPORT</span>
          </button>

          {(user?.isAdmin || user?.email?.toLowerCase() === "anuragkumar.pandit2000@gmail.com" || user?.role === "ADMIN") && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold hover:scale-[1.02] transition shadow-[0_0_15px_rgba(244,63,94,0.2)] mb-2"
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-rose-400" />
                <span>SUPER ADMIN</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/30 text-white font-mono">ROOT</span>
            </Link>
          )}

          <button
            onClick={() => {
              setActiveTab("SETTINGS");
              setMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg transition",
              activeTab === "SETTINGS"
                ? "bg-sky-500/15 border border-sky-400/40 text-sky-300 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            )}
          >
            <Settings size={16} />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
            <span>LOG OUT</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN VIEWPORT AREA
          ============================================================ */}
      <main className="relative z-10 flex-1 md:ml-64 min-h-screen flex flex-col overflow-y-auto">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-30 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
                <span>{activeTab}</span>
                <span className="text-[10px] font-mono text-slate-500">
                  // TELEMETRY LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs">
            {(user?.isAdmin || user?.email?.toLowerCase() === "anuragkumar.pandit2000@gmail.com" || user?.role === "ADMIN") && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold transition shadow-[0_0_15px_rgba(244,63,94,0.25)] text-xs"
              >
                <Shield size={13} className="text-rose-400" />
                <span>ROOT ADMIN</span>
              </Link>
            )}

            {/* 24-Hour Protocol Clock & Midnight Reset Countdown */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-sky-500/30 px-3 py-1 rounded-lg backdrop-blur-md text-xs font-mono">
              <Clock size={13} className="text-sky-400 animate-pulse" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">24H:</span>
                <span className="text-white font-bold">{currentTimeFormatted || "00:00:00"}</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-300 font-bold">12AM RESET IN {timeUntilMidnightFormatted || "24:00:00"}</span>
              </div>
            </div>

            {/* Active Day & Calibrated Level */}
            <div className="flex items-center gap-1.5 text-sky-300 bg-sky-950/30 border border-sky-500/30 px-3 py-1 rounded-lg backdrop-blur-md">
              <Shield size={13} className="text-sky-400" />
              <span className="font-bold">DAY {activeWinterArcDay}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-200">LVL {level}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/20 border border-amber-500/20 px-3 py-1 rounded-lg backdrop-blur-md">
              <Flame size={16} className="text-amber-400 animate-pulse" />
              <span>{currentStreak} DAYS</span>
            </div>

            {/* XP Counter (Section 15: CURRENT XP / 10,000 XP TARGET) */}
            <div className="flex items-center gap-2 bg-slate-900/40 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
              <Zap size={14} className="text-sky-400" />
              <span className="font-bold text-sky-300">
                {formatXP(userXP)} / 10,000 XP
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-8 flex-1 space-y-8 max-w-7xl w-full mx-auto">
          {/* ============================================================
              TAB 1: TASK (90-DAY HABIT MATRIX)
              ============================================================ */}
          {activeTab === "TASK" && (
            <div className="space-y-8">
              {/* 90-Day Arc Completion Banner / Milestone Status */}
              {isArcCompleted ? (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950/80 to-sky-950/60 border border-emerald-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-xl animate-fade-in">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] shrink-0">
                        <Award size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                            WINTER ARC COMPLETED
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                            DAY 90 / 90 SEALED
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                          CONGRATULATIONS, {user?.name || "CHALLENGER"}! YOUR 90-DAY ARC IS COMPLETE.
                        </h2>
                        <p className="text-xs text-slate-300 font-sans mt-0.5">
                          Your official Quantum Certificate of Completion is ratified and permanently stored on-chain in your profile.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCelebrationOpen(true)}
                        className="font-mono text-xs gap-1.5 border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300"
                      >
                        <Sparkles size={14} /> REPLAY CELEBRATION
                      </Button>
                      <Button
                        variant="quantum"
                        size="sm"
                        onClick={() => setIsCompletionCertModalOpen(true)}
                        className="font-mono text-xs gap-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      >
                        <Award size={14} /> VIEW CERTIFICATE
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-slate-950/40 border border-white/10 backdrop-blur-md font-mono text-xs">
                  <div className="flex items-center gap-2.5">
                    <Award size={16} className="text-sky-400" />
                    <span className="text-slate-300">
                      WINTER ARC GOAL: <strong className="text-white">{currentStreak}/90 DAYS</strong> COMPLETED
                    </span>
                    <span className="text-slate-500 text-[10px] hidden sm:inline">
                      • Official Certificate unlocks automatically on Day 90
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerArcCompletion(true)}
                      disabled={isTriggeringCompletion}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-400/30 hover:bg-sky-500/20 text-sky-300 text-[10px] font-mono transition flex items-center gap-1.5 disabled:opacity-50"
                      title="Test the complete 90-Day Arc Completion Ceremony and Certificate System"
                    >
                      <Sparkles size={12} />
                      <span>{isTriggeringCompletion ? "CALIBRATING..." : "SIMULATE DAY 90 COMPLETION"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Summary Cards: 24h Clock, Streak, Level, and XP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                {/* Card 1: 24-Hour Protocol Clock & Midnight Reset */}
                <div className="p-5 rounded-xl bg-slate-950/35 backdrop-blur-xl border border-sky-500/30 shadow-xl space-y-1.5 hover:border-sky-400/60 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Clock size={12} className="text-sky-400 animate-pulse" />
                      24H PROTOCOL CLOCK
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                      12AM RESET
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono tracking-wider">
                    {timeUntilMidnightFormatted || "24:00:00"}
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span>ACTIVE: <strong className="text-white">DAY {activeWinterArcDay} OF 90</strong></span>
                    <span className="text-slate-400 text-[10px]">{currentTimeFormatted}</span>
                  </div>
                </div>

                {/* Card 2: Active Winter Arc Streak */}
                <div className="p-5 rounded-xl bg-slate-950/35 backdrop-blur-xl border border-white/10 shadow-xl space-y-1.5 hover:border-amber-500/30 transition">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    ACTIVE WINTER ARC STREAK
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center gap-2">
                    <Flame size={24} /> {currentStreak} Days
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Longest: {longestStreak} Days • Rate: {consistencyRate}%
                  </div>
                </div>

                {/* Card 3: Winter Arc Level (Ladder by Streak Days) */}
                <div className="p-5 rounded-xl bg-slate-950/35 backdrop-blur-xl border border-white/10 shadow-xl space-y-1.5 hover:border-sky-500/30 transition">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest">
                    <span>WINTER ARC LEVEL</span>
                    <span className="text-sky-400 font-bold truncate max-w-[120px]">{tier}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                    <Award size={24} className="text-sky-400" />
                    <span>LEVEL {level}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{level === 0 ? "Complete Day 01 for Lvl 1" : `${currentStreak} / ${levelInfo.nextDays} Days`}</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-400 h-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card 4: XP Advancement */}
                <div className="p-5 rounded-xl bg-slate-950/35 backdrop-blur-xl border border-white/10 shadow-xl space-y-1.5 hover:border-emerald-500/30 transition">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    CURRENT XP ADVANCEMENT
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {formatXP(userXP)} XP
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>TARGET: 10,000 XP</span>
                      <span>{Math.min(100, Math.round((userXP / 10000) * 100))}%</span>
                    </div>
                    <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all"
                        style={{ width: `${Math.min(100, (userXP / 10000) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocol Status & Motivational Intervention Launcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/40 border border-white/10 backdrop-blur-md shadow-lg font-mono">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      struggleState?.isStruggling
                        ? "bg-red-400 animate-ping"
                        : "bg-emerald-400 animate-pulse"
                    )}
                  />
                  <div>
                    <div className="text-xs text-white font-bold flex items-center gap-2">
                      <span>PROTOCOL STATUS:</span>
                      <span
                        className={
                          struggleState?.isStruggling
                            ? "text-red-400"
                            : "text-emerald-400"
                        }
                      >
                        {struggleState?.isStruggling
                          ? "MOTIVATION REQUIRED • STRUGGLE DETECTED"
                          : "ARC CONSISTENCY OPTIMAL"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {struggleState?.isStruggling
                        ? struggleState.title
                        : `${currentStreak}-day unbroken trajectory in database`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setForceUnsealedTracker(true);
                      setIsSurpriseTrackerOpen(true);
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-500/20 text-emerald-300 hover:text-white text-xs font-mono transition shadow-md"
                    title="Download or Print Official Physical 90-Day Habit Tracker Sheet"
                  >
                    <Printer size={14} className="text-emerald-400" />
                    <span>PHYSICAL TRACKER (A4)</span>
                  </button>

                  <button
                    onClick={handleManualOpenMotivation}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-500/10 border border-sky-400/30 hover:border-sky-400 hover:bg-sky-500/20 text-sky-300 hover:text-white text-xs font-mono transition shadow-md"
                    title="Launch Quantum Motivational Protocol Video"
                  >
                    <Film size={14} className="text-sky-400" />
                    <span>MOTIVATIONAL PROTOCOL</span>
                  </button>
                </div>
              </div>

              {/* The Working 90-Day Habit Matrix Component */}
              <HabitMatrix
                initialHabits={habits}
                onStatsUpdate={handleStatsUpdate}
                onHabitsChange={handleHabitsChange}
              />

              {/* Dedicated Command Center Home Section: Live Execution Proofs (9:16 Vertical Stories Feed) */}
              <LiveExecutionProofSection
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                currentUserId={user?.id}
                onSelectProof={(p) => setViewingProof(p)}
              />
            </div>
          )}

          {/* ============================================================
              TAB 2: ANALYTICS (Charts, 3D Wall Calendar, Consistency)
              ============================================================ */}
          {activeTab === "ANALYTICS" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 90-Day Arc Trajectory Breakdown */}
                <div className="p-6 rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <TrendingUp size={18} className="text-sky-400" />
                    90-DAY ARC XP OVER TIME
                  </h3>
                  <div className="h-44 flex items-end justify-between gap-1 pt-6 px-2 border-b border-white/10">
                    {[
                      { day: "D1", xp: 120 },
                      { day: "D10", xp: 520 },
                      { day: "D20", xp: 1200 },
                      { day: "D30", xp: 2100 },
                      { day: "D40", xp: 2850 },
                      { day: "D50", xp: 3400 },
                      { day: "D60", xp: userXP || 4280 },
                      { day: "D75", xp: 6800 },
                      { day: "D90", xp: 10000 },
                    ].map((pt, i) => {
                      const heightPercent = Math.min(100, Math.round((pt.xp / 10000) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className={cn(
                              "w-full rounded-t-sm transition-all",
                              i <= 6 ? "bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.4)]" : "bg-slate-800"
                            )}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] font-mono text-slate-500">{pt.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between font-mono text-xs text-slate-400 pt-2">
                    <span>Target: 10,000 XP</span>
                    <span className="text-sky-400">Current Velocity: +150 XP / Day</span>
                  </div>
                </div>

                {/* Consistency Breakdown */}
                <div className="p-6 rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <Flame size={18} className="text-amber-400" />
                    HABIT CONSISTENCY AUDIT
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    {habits.slice(0, 4).map((h) => {
                      const completedCount = h.completions.filter((c) => c.status === "COMPLETED").length;
                      const rate = Math.round((completedCount / 90) * 100);
                      return (
                        <div key={h.id} className="space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>{h.title}</span>
                            <span className="text-sky-300">{rate}% ({completedCount} / 90)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3D Wall Calendar Integration */}
              <div className="p-6 rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 shadow-xl">
                <ThreeDWallCalendar
                  events={[
                    { id: "1", title: "Day 01 Arc Genesis", date: new Date().toISOString() },
                    { id: "2", title: "Day 30 Checkpoint", date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString() },
                    { id: "3", title: "Day 90 Winter Arc Final", date: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString() },
                  ]}
                />
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: SKILLS (Microtasks & XP)
              ============================================================ */}
          {activeTab === "SKILLS" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="text-sky-400 size-5" /> SKILL ACQUISITION LAB
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    MICRO-TASK DECOMPOSITION ENGINE • +100 XP PER TASK
                  </p>
                </div>
                <Button
                  onClick={() => setIsSkillModalOpen(true)}
                  variant="quantum"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={16} /> ADD SKILL
                </Button>
              </div>

              {skills.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-mono text-sm border border-white/10 rounded-2xl bg-slate-950/35 backdrop-blur-xl">
                  CHOOSE A SKILL TO BEGIN. CLICK &quot;+ ADD SKILL&quot; TO DECOMPOSE YOUR FIRST CRAFT.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-6 rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 hover:border-sky-500/40 transition space-y-4 shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                            {skill.category}
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-wide mt-1">
                            {skill.title}
                          </h3>
                        </div>
                        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                          {skill.progress}% COMPLETE
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-400 h-full transition-all"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>

                      {/* Micro Tasks */}
                      <div className="space-y-2 pt-2">
                        {skill.tasks.map((task: any) => {
                          const isDone = task.completions?.[0]?.completed;
                          return (
                            <button
                              key={task.id}
                              onClick={() => handleToggleSkillTask(task.id)}
                              className={cn(
                                "w-full p-3 rounded-lg border text-left flex items-center justify-between text-xs font-mono transition",
                                isDone
                                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                                  : "bg-slate-900/35 backdrop-blur-md border border-white/10 text-slate-300 hover:border-sky-400/40"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded flex items-center justify-center border",
                                    isDone
                                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                      : "border-slate-600"
                                  )}
                                >
                                  {isDone && <CheckCircle2 size={12} className="stroke-[3]" />}
                                </div>
                                <span className={isDone ? "line-through opacity-75" : ""}>
                                  {task.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-sky-400">+{task.xpReward} XP</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              TAB 4: GALLERY (Proof Uploads)
              ============================================================ */}
          {activeTab === "GALLERY" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ImageIcon className="text-sky-400 size-5" /> DAILY PROOF ARCHIVE
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    DOCUMENT PHOTOGRAPHIC PROOF OF WORK • VERIFIABLE DISCIPLINE
                  </p>
                </div>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  variant="quantum"
                  size="sm"
                  className="gap-2"
                >
                  <Upload size={16} /> LOG PROOF
                </Button>
              </div>

              {gallery.length === 0 ? (
                <div className="p-16 text-center text-slate-500 font-mono text-sm border border-white/10 rounded-2xl bg-slate-950/35 backdrop-blur-xl space-y-2">
                  <div className="text-lg text-slate-300">YOUR FIRST PROOF IS WAITING.</div>
                  <div className="text-xs">Take a photo of your training session or deep work desk to record Day 01.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gallery.map((item) => {
                    const isVid =
                      item.fileType === "video" ||
                      item.fileUrl.endsWith(".mp4") ||
                      item.fileUrl.startsWith("data:video");
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl hover:border-sky-500/40 transition group flex flex-col justify-between"
                      >
                        <div
                          className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden cursor-pointer"
                          onClick={() => setViewingProof(item)}
                        >
                          {isVid ? (
                            <video
                              src={item.fileUrl}
                              loop
                              muted
                              playsInline
                              autoPlay
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Image
                              src={item.fileUrl}
                              alt={item.caption}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-sky-400 border border-white/10 shadow-sm">
                            DAY {String(item.dayNumber).padStart(2, "0")} PROOF
                          </div>
                          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-400/30 shadow-sm">
                            {isVid ? "9:16 VIDEO" : "9:16 PHOTO"}
                          </div>
                        </div>
                      <div className="p-4 space-y-3 font-mono flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="text-sky-400">DAY {item.dayNumber}</span>
                            <span className="text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-sans line-clamp-2 leading-relaxed">{item.caption}</p>
                        </div>

                        {/* Actions: [VIEW] [REPLACE] and [DELETE] */}
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingProof(item)}
                              className="py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition"
                            >
                              <Eye size={13} />
                              <span>VIEW</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplacingProof(item);
                                setReplaceFileUrl(item.fileUrl);
                                setReplaceCaption(item.caption);
                              }}
                              className="py-1.5 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-1.5 transition"
                            >
                              <RefreshCw size={13} />
                              <span>REPLACE</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeletingProof(item)}
                            className="w-full py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/50 text-rose-300 hover:text-rose-100 font-mono text-[11px] flex items-center justify-center gap-1.5 transition"
                          >
                            <Trash2 size={13} />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          )}

          {/* ============================================================
              TAB 5: COMPETITION (Real Database Leaderboard)
              ============================================================ */}
          {activeTab === "COMPETITION" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="text-amber-400 size-5" /> LEADERBOARD RANKINGS
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    RANKINGS ARE COMPUTED FROM REAL DATABASE XP • ACTIVE PARTICIPANTS: {leaderboard?.totalParticipants || 1}
                  </p>
                </div>
              </div>

              {/* Podium for Top 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {leaderboard?.top3?.map((u: any, idx: number) => {
                  const place = idx + 1;
                  return (
                    <div
                      key={u.id}
                      className={cn(
                        "p-6 rounded-2xl border text-center space-y-3 relative overflow-hidden shadow-xl backdrop-blur-xl",
                        place === 1
                          ? "bg-amber-950/20 border-amber-500/40 shadow-amber-500/10"
                          : place === 2
                          ? "bg-slate-950/35 border-white/10"
                          : "bg-slate-950/35 border-white/10"
                      )}
                    >
                      <div className="text-xs font-mono font-bold text-amber-400">
                        RANK #0{place}
                      </div>
                      <div className="relative w-16 h-16 rounded-full mx-auto border-2 border-sky-400/40 overflow-hidden shadow-lg aspect-square">
                        <Image
                          src={u.profile?.avatar || "/assets/images/avatars/default_avatar.svg"}
                          alt={u.name}
                          fill
                          className="rounded-full object-cover object-center"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{u.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          @{u.username}
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-sky-400">
                        {formatXP(u.profile?.totalXP || 0)} XP
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table of Competitors */}
              <div className="rounded-xl border border-white/10 bg-slate-950/35 backdrop-blur-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-900/40 border-b border-white/10 text-slate-400">
                    <tr>
                      <th className="p-3.5">RANK</th>
                      <th className="p-3.5">CHALLENGER</th>
                      <th className="p-3.5">TIER</th>
                      <th className="p-3.5">STREAK</th>
                      <th className="p-3.5 text-right">XP TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard?.leaderboard?.map((u: any, i: number) => {
                      const isMe = u.id === user?.id;
                      return (
                        <tr
                          key={u.id}
                          className={cn(
                            "border-b border-white/5 hover:bg-sky-500/10 transition",
                            isMe ? "bg-sky-500/15 font-bold" : ""
                          )}
                        >
                          <td className="p-3.5 text-sky-400">#{i + 1}</td>
                          <td className="p-3.5 flex items-center gap-2.5">
                            <div className="relative w-7 h-7 rounded-full border border-sky-400/30 overflow-hidden shrink-0 aspect-square">
                              <Image
                                src={u.profile?.avatar || "/assets/images/avatars/default_avatar.svg"}
                                alt={u.name}
                                fill
                                className="rounded-full object-cover object-center"
                              />
                            </div>
                            <span>{u.name}</span>
                            {isMe && (
                              <span className="text-[9px] bg-sky-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                                YOU
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-400">{u.profile?.currentClass || "Tier I"}</td>
                          <td className="p-3.5 text-amber-400">{u.streak?.currentStreak || 0}D</td>
                          <td className="p-3.5 text-right font-bold text-sky-300">
                            {formatXP(u.profile?.totalXP || 0)} XP
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 6: PROFILE
              ============================================================ */}
          {activeTab === "PROFILE" && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-slate-950/40 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/10">
                  <div className="relative group">
                    <div className="relative w-24 h-24 rounded-full border-2 border-sky-400/50 overflow-hidden shadow-2xl shrink-0 aspect-square bg-slate-900/60 flex items-center justify-center">
                      {user?.profile?.avatar ? (
                        <Image
                          src={user.profile.avatar}
                          alt="Profile"
                          fill
                          className="rounded-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-500/20 to-cyan-500/10 text-sky-400 text-3xl font-extrabold font-mono">
                          {user?.name ? user.name.charAt(0).toUpperCase() : <User size={36} />}
                        </div>
                      )}
                    </div>
                    {/* Camera quick-upload badge on avatar */}
                    <button
                      type="button"
                      onClick={() => profileFileRef.current?.click()}
                      disabled={isAvatarUploading}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-500 text-slate-950 shadow-lg hover:bg-sky-400 transition hover:scale-110 border-2 border-slate-950"
                      title="Upload photo from gallery"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{user?.name}</h2>
                    <div className="text-xs font-mono text-sky-400">@{user?.username}</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      Inducted on {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Profile Photo Customization */}
                <div className="p-5 rounded-2xl bg-slate-900/35 backdrop-blur-xl border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">CUSTOM PROFILE PHOTO</h4>
                      <p className="text-xs text-slate-400">
                        Pick a photo directly from your device gallery, or paste a link.
                      </p>
                    </div>
                    {avatarSuccessMsg && (
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Check size={12} /> {avatarSuccessMsg}
                      </span>
                    )}
                  </div>

                  {/* Hidden Profile File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={profileFileRef}
                    onChange={handleProfileGalleryUpload}
                    className="hidden"
                  />

                  {/* Direct Gallery Upload Button & Controls */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="cool"
                      size="sm"
                      onClick={() => profileFileRef.current?.click()}
                      disabled={isAvatarUploading}
                      className="gap-2 shadow-lg"
                    >
                      {isAvatarUploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>PROCESSING PHOTO...</span>
                        </>
                      ) : (
                        <>
                          <Camera size={15} />
                          <span>CHOOSE FROM GALLERY</span>
                        </>
                      )}
                    </Button>

                    {user?.profile?.avatar && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAvatar("")}
                        className="text-xs border-white/10 text-slate-400 hover:text-red-400 gap-1.5"
                      >
                        <Trash2 size={13} /> REMOVE PHOTO
                      </Button>
                    )}
                  </div>

                  {/* Manual URL Input & Controls */}
                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-mono">OR PASTE DIRECT IMAGE URL:</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={customAvatarInput}
                        onChange={(e) => setCustomAvatarInput(e.target.value)}
                        placeholder="Paste image URL (https://...)"
                        className="bg-slate-900/40 border-white/10 text-xs max-w-md h-9"
                      />
                      <Button
                        variant="quantum"
                        size="sm"
                        onClick={() => {
                          if (customAvatarInput.trim()) {
                            handleSelectAvatar(customAvatarInput.trim());
                            setCustomAvatarInput("");
                          }
                        }}
                        className="whitespace-nowrap h-9 text-xs"
                      >
                        UPDATE URL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div className="text-slate-500 text-[10px]">CURRENT LEVEL</div>
                    <div className="text-xl font-bold text-white mt-1">Level {level}</div>
                    <div className="text-sky-400 text-[10px] mt-0.5">{tier}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div className="text-slate-500 text-[10px]">TOTAL VERIFIED XP</div>
                    <div className="text-xl font-bold text-sky-400 mt-1">{formatXP(userXP)}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">Target: 10,000 XP</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div className="text-slate-500 text-[10px]">LONGEST STREAK</div>
                    <div className="text-xl font-bold text-amber-400 mt-1">{longestStreak} Days</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">Current: {currentStreak} Days</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div className="text-slate-500 text-[10px]">GLOBAL RANK</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      #{leaderboard?.currentUserRank || 1}
                    </div>
                    <div className="text-slate-400 text-[10px] mt-0.5">Of {leaderboard?.totalParticipants || 1} Challengers</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase">90-DAY OBJECTIVE</div>
                  <p className="p-4 rounded-xl bg-slate-900/30 backdrop-blur-md border border-white/10 text-xs text-slate-300 font-sans leading-relaxed">
                    {user?.profile?.objective}
                  </p>
                </div>

                {/* Parse User Certificate & Onboarding Dossier */}
                {(() => {
                  const cert = user?.certificate;
                  let parsedContract: any = null;
                  if (cert?.contractData) {
                    try {
                      parsedContract = JSON.parse(cert.contractData);
                    } catch {}
                  }
                  const contractDoc = parsedContract?.document || parsedContract || {};
                  const contractAnswers = parsedContract?.answers || {};
                  const contractAnalysis = parsedContract?.analysis || {};

                  return (
                    <div className="space-y-6 pt-2">
                      {/* Section 1: AI-Designed 90-Day System Architecture */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-950/60 to-slate-900/40 backdrop-blur-xl border border-sky-500/30 space-y-4 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-500/20 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/30">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <h3 className="text-base font-extrabold text-white tracking-wide">
                                AI-DESIGNED 90-DAY PROTOCOL & SYSTEM ARCHITECTURE
                              </h3>
                              <p className="text-xs text-sky-300 font-mono">
                                TAILORED SPECIFICALLY AROUND YOUR CIRCADIAN RHYTHM & ATTENTION LEAKS
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/40 text-sky-300">
                            SYSTEM ACTIVE • DAY {currentStreak > 0 ? currentStreak : 1}/90
                          </span>
                        </div>

                        {/* 4 Protocol Pillars Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          {/* Pillar 1: Morning Ignition */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-sans text-xs">
                            <div className="flex items-center justify-between font-mono text-[11px] text-amber-300 font-bold">
                              <span className="flex items-center gap-1.5"><Sun size={14} /> 01 • MORNING IGNITION PROTOCOL</span>
                              <span>{contractAnswers.wakeTime ? `WAKE: ${contractAnswers.wakeTime}` : "WAKE: 06:30 AM"}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              Zero smartphone usage before 09:00 AM. Immediate 500ml cold hydration, 10-minute sunlight exposure, and execution of Habit 01 before opening messaging apps.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500">
                              FIRST APP EMBARGO: {contractAnswers.firstApp || "Notifications Blocked"}
                            </div>
                          </div>

                          {/* Pillar 2: Deep Work Sprint */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-sans text-xs">
                            <div className="flex items-center justify-between font-mono text-[11px] text-sky-300 font-bold">
                              <span className="flex items-center gap-1.5"><Target size={14} /> 02 • DEEP WORK & CRAFT SPRINT</span>
                              <span>{user?.profile?.dailyAvailableHours || 2.5}H / DAY</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              Dedicated 90-minute uninterrupted focus block for <strong className="text-white">{skills?.[0]?.title || contractAnswers.careerPath || "High-Yield Mastery"}</strong>. Phone locked in another room.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500">
                              TARGET: {contractDoc.primaryGoalText ? contractDoc.primaryGoalText.slice(0, 55) + "..." : user?.profile?.objective?.slice(0, 55)}
                            </div>
                          </div>

                          {/* Pillar 3: Distraction Firewall */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-sans text-xs">
                            <div className="flex items-center justify-between font-mono text-[11px] text-red-300 font-bold">
                              <span className="flex items-center gap-1.5"><Lock size={14} /> 03 • DISTRACTION FIREWALL</span>
                              <span>MAX {contractAnswers.dailyScreenHours || "2"}H SCREEN</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              Strict restrictive quarantine on <strong className="text-red-200">{Array.isArray(contractAnswers.screenTimeApps) ? contractAnswers.screenTimeApps.join(", ") : "Social Media & Shorts"}</strong>. Dopamine sacrifice strictly enforced during prime execution hours.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500">
                              FIREWALL DIRECTIVE: {contractDoc.distractionStrategyText || "Notifications silenced & app limits locked"}
                            </div>
                          </div>

                          {/* Pillar 4: Circadian Shutdown */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-sans text-xs">
                            <div className="flex items-center justify-between font-mono text-[11px] text-indigo-300 font-bold">
                              <span className="flex items-center gap-1.5"><Moon size={14} /> 04 • CIRCADIAN SHUTDOWN & RESET</span>
                              <span>{contractAnswers.sleepTime ? `SLEEP: ${contractAnswers.sleepTime}` : "SLEEP: 23:00 PM"}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              Screen cutoff 45 minutes before sleep. Habit Matrix daily audit, streak verification, and reading consolidation to ensure rapid Stage-4 REM recovery.
                            </p>
                            <div className="text-[10px] font-mono text-slate-500">
                              LAST APP EMBARGO: {contractAnswers.lastApp || "Airplane Mode Active"}
                            </div>
                          </div>
                        </div>

                        {/* Emergency Protocol Badge */}
                        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-mono text-red-400 font-bold text-[11px] flex items-center gap-1.5">
                              <AlertCircle size={13} /> EMERGENCY BAD-DAY PROTOCOL (ACTIVE):
                            </span>
                            <p className="text-slate-300 font-sans">
                              {contractDoc.badDayProtocolText || contractAnalysis.accountability_strategy || "Execute an immediate 15-minute micro-rep to maintain neural streak. Never drop to zero."}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab("AI");
                              handleSendMessage("Quantum Core, I need to activate my Emergency Bad-Day Protocol right now. Walk me through my immediate micro-rep.", { thinkActive: true, deepSearchActive: false });
                            }}
                            className="text-[11px] font-mono border-red-500/50 hover:bg-red-500/20 text-red-200"
                          >
                            ACTIVATE PROTOCOL
                          </Button>
                        </div>
                      </div>

                      {/* Section 2: Challenger Onboarding Dossier */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText size={14} className="text-sky-400" /> CHALLENGER ONBOARDING DOSSIER & BEHAVIORAL PROFILE
                          </h4>
                          <span className="font-mono text-[10px] text-slate-500">PARSED FROM INDUCTION</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-sans text-xs">
                          {/* Card 1: Academic & Career */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">ACADEMIC & CAREER VECTOR</div>
                            <div className="font-bold text-white text-sm">
                              {cert?.academicStatus || user?.profile?.currentClass || "College Student"}
                            </div>
                            <div className="text-sky-400 font-mono text-[11px]">
                              {skills?.[0]?.title || contractAnswers.careerPath || "High-Performance Execution"}
                            </div>
                          </div>

                          {/* Card 2: 90-Day Goals */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">PRIMARY 90-DAY OBJECTIVE</div>
                            <div className="font-bold text-white line-clamp-2">
                              {contractDoc.primaryGoalText || user?.profile?.objective}
                            </div>
                            {contractDoc.secondaryGoalText && (
                              <div className="text-slate-400 text-[11px] line-clamp-1 border-t border-slate-800 pt-1">
                                Sec: {contractDoc.secondaryGoalText}
                              </div>
                            )}
                          </div>

                          {/* Card 3: Screen Leaks */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">SCREEN TIME LEAKS</div>
                            <div className="font-bold text-amber-300">
                              {Array.isArray(contractAnswers.screenTimeApps) ? contractAnswers.screenTimeApps.join(", ") : "Instagram, YouTube"}
                            </div>
                            <div className="text-slate-400 font-mono text-[11px]">
                              Est. {contractAnswers.dailyScreenHours || "4.5"}h/day • {contractAnswers.focusDays30 ? `${contractAnswers.focusDays30}/30 Days Baseline` : "Calibrated"}
                            </div>
                          </div>

                          {/* Card 4: Obstacle Avoided */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">AVOIDED CRUCIAL TASK</div>
                            <div className="font-semibold text-slate-200 line-clamp-2">
                              {contractAnswers.avoidedTask || "Consistent deep work without phone distraction"}
                            </div>
                            <div className="text-emerald-400 text-[10px] font-mono">STATUS: CONFRONTING IN ARC</div>
                          </div>

                          {/* Card 5: Broken Promise Rebuilding */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">BROKEN PROMISE REBUILDING</div>
                            <div className="font-semibold text-slate-200 line-clamp-2">
                              {contractAnswers.brokenPromise || "Waking up early and maintaining unbroken daily routine"}
                            </div>
                            <div className="text-sky-400 text-[10px] font-mono">STATUS: REBUILDING SELF-TRUST</div>
                          </div>

                          {/* Card 6: Consistency Checkpoint */}
                          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
                            <div className="font-mono text-[10px] text-slate-500 uppercase">ACCOUNTABILITY CHECKPOINT</div>
                            <div className="font-bold text-white text-sm">
                              {contractDoc.consistencyCheckpointText ? contractDoc.consistencyCheckpointText.slice(0, 35) : "Quantum Core AI Verification"}
                            </div>
                            <div className="text-emerald-400 font-mono text-[10px]">
                              RESET COVENANT: 24-HOUR GUARANTEE
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Ratified 90-Day Covenant Card */}
                      <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="text-sky-400 size-5" />
                            <div>
                              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                                RATIFIED 90-DAY WINTER ARC COVENANT
                              </div>
                              <div className="font-mono text-[10px] text-slate-500">
                                SERIAL: {contractDoc.serialNumber || cert?.certificateNumber || "QNTM-CONTRACT-2026-90"} • ISSUED: {contractDoc.generatedDate || new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 size={13} /> RATIFIED & IMMUTABLE
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-mono text-[10px] text-slate-400 uppercase">SOLEMN COMMITMENT EXCERPT</div>
                            <blockquote className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 font-sans italic leading-relaxed">
                              &ldquo;{contractDoc.arcCommitmentText || "I commit to dedicating non-negotiable daily effort without compromise."}&rdquo;
                            </blockquote>
                          </div>

                          <div className="space-y-2">
                            <div className="font-mono text-[10px] text-slate-400 uppercase">PARTICIPANT DIGITAL CURSIVE SIGNATURE</div>
                            <div className="h-16 px-4 rounded-xl bg-white flex items-center justify-between border border-slate-200">
                              {cert?.signatureUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={cert.signatureUrl}
                                  alt="Participant Drawn Signature"
                                  className="max-h-12 max-w-[180px] object-contain filter contrast-125"
                                />
                              ) : (
                                <span className="font-serif italic text-slate-900 font-bold text-lg">
                                  {user?.name || "Challenger"}
                                </span>
                              )}
                              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                                BINDING SEAL
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Covenant Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                          <div className="text-[11px] font-mono text-slate-500">
                            FULL PURE-WHITE A4 DOCUMENT IS READY FOR PRINT & PDF EXPORT
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsContractModalOpen(true)}
                              className="font-mono text-xs gap-1.5 border-slate-700 hover:border-sky-500 text-slate-200"
                            >
                              <FileText size={14} /> VIEW FULL CONTRACT
                            </Button>

                            <Button
                              variant="quantum"
                              size="sm"
                              onClick={() => {
                                setIsContractModalOpen(true);
                                setTimeout(() => window.print(), 400);
                              }}
                              className="font-mono text-xs gap-1.5"
                            >
                              <Printer size={14} /> PRINT / EXPORT PDF
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: 90-Day Arc Completion Certificate Card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950/70 via-emerald-950/20 to-slate-900/60 border border-emerald-500/30 space-y-4 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="text-emerald-400 size-5" />
                            <div>
                              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                                {isArcCompleted ? "WINTER ARC COMPLETED • OFFICIAL CERTIFICATE" : "WINTER ARC COMPLETION CERTIFICATE (LOCKED)"}
                              </div>
                              <div className="font-mono text-[10px] text-slate-400">
                                {isArcCompleted
                                  ? `ARC ID: ${completionData?.arcId || "Q-CERT-90ARC"} • STATUS: VERIFIED & COMPLETED`
                                  : `CURRENT TRAJECTORY: ${currentStreak}/90 DAYS • UNLOCKS ON 90/90 COMPLETION`}
                              </div>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "font-mono text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5",
                              isArcCompleted
                                ? "text-emerald-400 bg-emerald-950/60 border border-emerald-500/40"
                                : "text-amber-400 bg-amber-950/40 border border-amber-500/30"
                            )}
                          >
                            {isArcCompleted ? (
                              <>
                                <CheckCircle2 size={13} /> CERTIFICATE RATIFIED
                              </>
                            ) : (
                              <>
                                <Lock size={13} /> {90 - currentStreak > 0 ? `${90 - currentStreak} DAYS REMAINING` : "ELIGIBLE TO CLAIM"}
                              </>
                            )}
                          </span>
                        </div>

                        {/* Certificate Card Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                            <div className="text-slate-400 text-[10px] uppercase">DAYS COMPLETED</div>
                            <div className="text-2xl font-black text-emerald-400">
                              {isArcCompleted ? "90 / 90" : `${currentStreak} / 90`}
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              {isArcCompleted ? "Full Arc Executed" : "Trajectory in progress"}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                            <div className="text-slate-400 text-[10px] uppercase">VERIFIED TOTAL XP</div>
                            <div className="text-2xl font-black text-sky-400">
                              {formatXP(completionData?.totalXP || userXP)} XP
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              {isArcCompleted ? "Includes +2,500 Arc Completion Bonus" : "Compounding daily"}
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
                            <div className="text-slate-400 text-[10px] uppercase">CONSISTENCY RATING</div>
                            <div className="text-2xl font-black text-amber-400">
                              {completionData?.consistency || consistencyRate}%
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Cryptographic proof on-chain
                            </div>
                          </div>
                        </div>

                        {/* Certificate Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                          <div className="text-[11px] font-mono text-slate-400">
                            {isArcCompleted
                              ? "LANDSCAPE A4 CERTIFICATE WITH DYNAMIC QR VERIFICATION CODE & CEO SIGN-OFF"
                              : "Complete all 90 days or trigger completion simulation to unlock your certificate."}
                          </div>

                          <div className="flex items-center gap-2">
                            {isArcCompleted ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsCelebrationOpen(true)}
                                  className="font-mono text-xs gap-1.5 border-slate-700 hover:border-emerald-500 text-slate-200"
                                >
                                  <Sparkles size={14} /> CELEBRATION
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => completionData && downloadCertificateImage(completionData)}
                                  className="font-mono text-xs gap-1.5 border-sky-600/60 text-sky-400 hover:bg-sky-950/40"
                                >
                                  <Download size={14} /> DOWNLOAD PNG
                                </Button>

                                <Button
                                  variant="quantum"
                                  size="sm"
                                  onClick={() => setIsCompletionCertModalOpen(true)}
                                  className="font-mono text-xs gap-1.5"
                                >
                                  <Award size={14} /> VIEW CERTIFICATE
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="quantum"
                                size="sm"
                                disabled={isTriggeringCompletion}
                                onClick={() => triggerArcCompletion(true)}
                                className="font-mono text-xs gap-1.5"
                              >
                                <Sparkles size={14} />
                                {isTriggeringCompletion ? "TRIGGERING..." : "TEST 90-DAY COMPLETION CEREMONY"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 7: AI CORE (Quantum Core AI Chat)
              ============================================================ */}
          {activeTab === "AI" && (
            <div className="space-y-2.5 max-w-4xl mx-auto flex flex-col h-[calc(100vh-210px)] min-h-[440px] max-h-[620px]">
              {/* Sleek Console Header */}
              <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xl shrink-0">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Brain className="text-sky-400 size-4 sm:size-5" /> QUANTUM CORE CONSOLE
                  </h2>
                  <p className="text-[10px] font-mono text-slate-400">
                    REAL-TIME STRATEGIC COPILOT • GROUNDED IN YOUR 90-DAY DOSSIER & COVENANT
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold text-[11px]">AI CONNECTED</span>
                </div>
              </div>

              {/* Messages viewport - auto-scrollable & compact */}
              <div className="flex-1 min-h-0 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-3.5 sm:p-4 overflow-y-auto space-y-3 shadow-2xl matrix-scrollbar">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col max-w-2xl w-full",
                      msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    {msg.role === "user" ? (
                      <div className="flex flex-col items-end max-w-xl">
                        <span className="text-[9px] font-mono text-slate-400 mb-0.5 px-1 uppercase">
                          {user?.name || "YOU"}
                        </span>
                        <div className="bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-semibold px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs sm:text-[13px] shadow-md leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start max-w-2xl w-full">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-sky-400 font-bold mb-0.5 px-1 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                          QUANTUM AI
                        </div>
                        <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-slate-100 rounded-2xl rounded-tl-sm p-3.5 sm:p-4 shadow-xl text-xs sm:text-[13px] font-sans tracking-wide leading-relaxed">
                          <FormattedAiMessage content={msg.content} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400 animate-pulse py-1">
                    <Brain size={15} /> Synthesizing tactical directive...
                  </div>
                )}
                {/* Auto-scroll target anchor */}
                <div ref={messagesEndRef} className="h-0 w-0" />
              </div>

              {/* Tactical Quick Prompt Pills - Sleek horizontal single-row */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0 no-print">
                {[
                  "📅 Design my daily routine around my wake/sleep hours",
                  "⚡ Activate my Emergency Bad-Day Protocol",
                  "🎯 Decompose my primary 90-day goal into weekly sprints",
                  "🛡️ How do I eliminate my screen time leaks today?",
                ].map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSendMessage(promptText, { thinkActive: true, deepSearchActive: false })}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition whitespace-nowrap shrink-0"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* AIChatInput Component - Always pinned in sight */}
              <div className="shrink-0">
                <AIChatInput onSendMessage={handleSendMessage} isLoading={isAiLoading} />
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 8: APP MOBILE (Full Interactive 19-Feature Ecosystem)
              ============================================================ */}
          {activeTab === "APP" && (
            <div className="space-y-6">
              <QuantumMobileExperience />
            </div>
          )}

          {/* ============================================================
              TAB 9: ABOUT (Full Quantum Transformation Specification)
              ============================================================ */}
          {activeTab === "ABOUT" && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <AboutSection showHero={true} showCta={false} />
            </div>
          )}

          {/* ============================================================
              TAB 10: SETTINGS
              ============================================================ */}
          {activeTab === "SETTINGS" && (
            <div className="space-y-6 max-w-3xl mx-auto font-mono text-xs">
              <div className="p-8 rounded-2xl bg-slate-950/35 backdrop-blur-xl border border-white/10 space-y-6 shadow-xl">
                <h2 className="text-xl font-bold text-white font-sans">SETTINGS & PREFERENCES</h2>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div>
                      <div className="text-white font-bold">ATMOSPHERE MUSIC</div>
                      <div className="text-[10px] text-slate-400">Persistent ambient soundscapes</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={toggleSound}>
                      {soundEnabled ? <Volume2 size={16} className="text-sky-400" /> : <VolumeX size={16} />}
                      <span className="ml-2">{soundEnabled ? "ENABLED" : "MUTED"}</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div>
                      <div className="text-white font-bold">LEADERBOARD VISIBILITY</div>
                      <div className="text-[10px] text-slate-400">Display your XP on public rankings</div>
                    </div>
                    <span className="text-emerald-400 font-bold">PUBLIC</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 backdrop-blur-md border border-white/10">
                    <div>
                      <div className="text-white font-bold flex items-center gap-2">
                        <Moon size={16} className="text-sky-400" />
                        <span>APPEARANCE PROTOCOL</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Quantum Obsidian Dark (Permanent System Theme)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-mono text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30">
                        DARK ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    SIGN OUT OF SESSION
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Add Skill */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">DECOMPOSE NEW SKILL</h3>
            <form onSubmit={handleCreateSkill} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">SKILL TITLE</label>
                <Input
                  placeholder="e.g. Next.js 14 Full Stack, Calisthenics"
                  value={newSkillTitle}
                  onChange={(e) => setNewSkillTitle(e.target.value)}
                  className="bg-slate-900/50 border-white/10"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSkillModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="cool" size="sm">
                  Decompose Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Proof to Gallery with Direct Device Gallery Upload */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="text-sky-400 size-5" /> LOG PROOF OF WORK
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFileUrl("");
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadProof} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">DAY NUMBER</label>
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    value={uploadDay}
                    onChange={(e) => setUploadDay(parseInt(e.target.value) || 1)}
                    className="bg-slate-900/50 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">VISIBILITY</label>
                  <div className="flex h-10 items-center justify-around rounded-md bg-slate-900/50 border border-white/10 px-1">
                    <button
                      type="button"
                      onClick={() => setUploadIsPublic(true)}
                      className={cn(
                        "px-3 py-1 rounded text-[11px] font-bold transition",
                        uploadIsPublic ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
                      )}
                    >
                      PUBLIC
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadIsPublic(false)}
                      className={cn(
                        "px-3 py-1 rounded text-[11px] font-bold transition",
                        !uploadIsPublic ? "bg-sky-500 text-slate-950" : "text-slate-400 hover:text-white"
                      )}
                    >
                      PRIVATE
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">CAPTION / PROOF LOG</label>
                <Input
                  placeholder="Describe your session execution (e.g. 10km run, deep work block)..."
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="bg-slate-900/50 border-white/10"
                  required
                />
              </div>

              {/* Direct Gallery / Camera Photo or Video Upload (9:16 Vertical) */}
              <div className="space-y-2">
                <label className="text-slate-400 flex items-center justify-between text-xs">
                  <span>9:16 PROOF (DEVICE GALLERY / CAMERA / VIDEO)</span>
                  {uploadFileUrl && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check size={12} /> {uploadFileType === "video" ? "9:16 VIDEO ATTACHED" : "9:16 PHOTO ATTACHED"}
                    </span>
                  )}
                </label>

                {/* Hidden File Input for Device Gallery / Camera (Image or Video) */}
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={proofFileRef}
                  onChange={handleProofGalleryUpload}
                  className="hidden"
                />

                {uploadFileUrl ? (
                  <div className="relative rounded-2xl border border-sky-500/40 overflow-hidden bg-slate-900/60 p-3 space-y-3">
                    <div className="relative w-44 aspect-[9/16] mx-auto rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg">
                      {uploadFileType === "video" ||
                      uploadFileUrl.endsWith(".mp4") ||
                      uploadFileUrl.startsWith("data:video") ? (
                        <video
                          src={uploadFileUrl}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={uploadFileUrl}
                          alt="Proof Preview"
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[9px] font-mono text-cyan-300 border border-cyan-400/30">
                        9:16 {uploadFileType.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                        <Check size={12} /> Ready for verification
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => proofFileRef.current?.click()}
                          disabled={isProofUploading}
                          className="h-7 text-[10px] border-white/10 gap-1"
                        >
                          <Camera size={12} /> Change Media
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setUploadFileUrl("");
                            setUploadFileType("image");
                          }}
                          className="h-7 text-[10px] gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => proofFileRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-sky-400/50 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-900/30 hover:bg-slate-900/50 space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center mx-auto text-sky-400 group-hover:scale-110 transition-transform">
                      {isProofUploading ? (
                        <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera size={22} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">
                        {isProofUploading ? "PROCESSING 9:16 MEDIA..." : "CHOOSE 9:16 PHOTO OR VIDEO FROM GALLERY"}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Tap here to select a vertical portrait (9:16) image or short video clip from your device
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternative Manual URL Input */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <label className="text-slate-500 text-[10px]">OR ENTER IMAGE URL MANUALLY</label>
                <Input
                  placeholder="/assets/images/background.png or https://..."
                  value={uploadFileUrl.startsWith("data:") ? "" : uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  className="bg-slate-900/40 border-white/10 text-[11px] h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFileUrl("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="cool" size="sm" className="gap-1.5">
                  <Upload size={14} /> Commit Proof
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Fullscreen 9:16 Proof Lightbox */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950/95 border border-cyan-400/30 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-sky-400 size-4" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  DAY {String(viewingProof.dayNumber).padStart(2, "0")} PROOF • 9:16
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative w-full aspect-[9/16] max-h-[62vh] rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center mx-auto">
              {viewingProof.fileType === "video" ||
              viewingProof.fileUrl.endsWith(".mp4") ||
              viewingProof.fileUrl.startsWith("data:video") ? (
                <video
                  src={viewingProof.fileUrl}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={viewingProof.fileUrl}
                  alt={viewingProof.caption || "Proof"}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            <div className="space-y-1.5 font-mono text-xs border-t border-white/10 pt-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-sky-400 font-bold">{viewingProof.user?.name || user?.name || "Challenger"}</span>
                <span>{new Date(viewingProof.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">{viewingProof.caption}</p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <a
                href={viewingProof.fileUrl}
                download={`QUANTUM_DAY_${viewingProof.dayNumber}_PROOF`}
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-mono text-[11px] flex items-center gap-1.5 transition"
              >
                <Download size={12} />
                <span>DOWNLOAD MEDIA</span>
              </a>
              <Button variant="outline" size="sm" onClick={() => setViewingProof(null)} className="h-7 text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Proof Confirmation Modal */}
      {deletingProof && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle size={20} />
              <h3 className="text-base font-bold text-white tracking-wide">DELETE THIS PROOF?</h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This image will be permanently removed from your Arc gallery.
            </p>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                <Image
                  src={deletingProof.fileUrl}
                  alt={deletingProof.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="truncate font-mono text-xs">
                <div className="text-sky-400 font-bold">DAY {deletingProof.dayNumber} PROOF</div>
                <div className="text-slate-400 text-[11px] truncate">{deletingProof.caption}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProof(null)}
                className="font-mono text-xs border-slate-700 hover:bg-slate-800"
              >
                CANCEL
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteProof}
                className="font-mono text-xs gap-1.5 shadow-md shadow-rose-900/40"
              >
                <Trash2 size={13} />
                <span>DELETE</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Replace Proof Modal */}
      {replacingProof && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-sky-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-sky-400" />
                <h3 className="text-base font-bold text-white tracking-wide">REPLACE PROOF</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReplacingProof(null);
                  setReplaceFileUrl("");
                  setReplaceCaption("");
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Upload a new image to replace the current proof. Original day number (#DAY {replacingProof.dayNumber}), date, and metadata will be strictly preserved.
            </p>

            <form onSubmit={handleReplaceProof} className="space-y-4 font-mono text-xs">
              {/* Image Preview & Replacement Picker */}
              <div className="space-y-2">
                <input
                  type="file"
                  ref={replaceFileRef}
                  accept="image/*"
                  onChange={handleReplaceFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500">CURRENT PROOF</span>
                    <div className="relative h-28 rounded-lg overflow-hidden border border-white/10 bg-black">
                      <Image
                        src={replacingProof.fileUrl}
                        alt="Current"
                        fill
                        className="object-cover opacity-75"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-sky-400 font-bold">NEW REPLACEMENT</span>
                    <div
                      onClick={() => replaceFileRef.current?.click()}
                      className="relative h-28 rounded-lg overflow-hidden border border-sky-400/50 bg-slate-900/60 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition group p-2 text-center"
                    >
                      {replaceFileUrl ? (
                        <Image
                          src={replaceFileUrl}
                          alt="Replacement preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-sky-300">
                          <Camera size={20} className="text-sky-400" />
                          <span className="text-[10px]">CHOOSE NEW PHOTO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => replaceFileRef.current?.click()}
                    className="text-[11px] gap-1.5 h-7"
                  >
                    <Camera size={12} /> {replaceFileUrl ? "Change Selected Photo" : "Upload File / Camera"}
                  </Button>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px]">CAPTION</label>
                <Input
                  value={replaceCaption}
                  onChange={(e) => setReplaceCaption(e.target.value)}
                  className="bg-slate-900/50 border-white/10 text-xs"
                  placeholder="Update proof caption..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplacingProof(null);
                    setReplaceFileUrl("");
                    setReplaceCaption("");
                  }}
                  className="font-mono text-xs"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="quantum"
                  size="sm"
                  disabled={isReplacingProof}
                  className="font-mono text-xs gap-1.5"
                >
                  <RefreshCw size={13} className={isReplacingProof ? "animate-spin" : ""} />
                  <span>{isReplacingProof ? "UPDATING..." : "CONFIRM REPLACEMENT"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cinematic Motivational Video Intervention Modal */}
      <MotivationalModal
        isOpen={isMotivationalModalOpen}
        onClose={handleCloseMotivationalModal}
        title={struggleState?.title}
        subtitle={struggleState?.subtitle}
        consecutiveMissedDays={struggleState?.consecutiveMissedDays}
        brokenStreakLength={struggleState?.brokenStreakLength}
      />

      {/* Full Pure-White A4 Contract Modal */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-4xl flex items-center justify-between py-3 mb-4 border-b border-slate-800 text-white no-print">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-sky-400">
              <Shield size={18} />
              <span>OFFICIAL 90-DAY WINTER ARC CONTRACT</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const cert = user?.certificate;
                  let parsedContract: any = null;
                  if (cert?.contractData) {
                    try {
                      parsedContract = JSON.parse(cert.contractData);
                    } catch {}
                  }
                  const contractDoc = parsedContract?.document || parsedContract || {
                    primaryGoalText: user?.profile?.objective || "Master self-discipline",
                    secondaryGoalText: "Continuous skill compounding and physical conditioning",
                    proofMethodText: "Daily photographic proof and completed repository log",
                    arcCommitmentText: "Daily unbroken execution of core habits",
                    badDayProtocolText: "Immediate 15-minute emergency rep",
                    distractionStrategyText: "Lockdown of notifications and screen time",
                    consistencyCheckpointText: "Quantum Core AI verification",
                    continuationPlanText: "Defend transformed standards as an immutable baseline",
                    serialNumber: cert?.certificateNumber || "QNTM-CONTRACT-2026-90",
                    generatedDate: new Date().toLocaleDateString(),
                  };
                  downloadContractImage({
                    participant: {
                      name: user?.name || "Challenger",
                      age: user?.profile?.age || "21",
                      academicStatus: cert?.academicStatus || user?.profile?.currentClass || "Independent Challenger",
                      username: user?.username || "CHALLENGER",
                    },
                    contract: contractDoc,
                    signatureUrl: cert?.signatureUrl || null,
                  });
                }}
                className="gap-1.5 font-mono text-xs border-sky-600 text-sky-400 hover:bg-sky-950/40"
              >
                <Download size={14} /> DOWNLOAD CONTRACT
              </Button>
              <Button
                variant="quantum"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 font-mono text-xs"
              >
                <Printer size={14} /> PRINT (A4)
              </Button>
              <button
                onClick={() => setIsContractModalOpen(false)}
                className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center pb-12">
            {(() => {
              const cert = user?.certificate;
              let parsedContract: any = null;
              if (cert?.contractData) {
                try {
                  parsedContract = JSON.parse(cert.contractData);
                } catch {}
              }
              const contractDoc = parsedContract?.document || parsedContract || {
                primaryGoalText: user?.profile?.objective || "Master self-discipline",
                secondaryGoalText: "Continuous skill compounding and physical conditioning",
                proofMethodText: "Daily photographic proof and completed repository log",
                arcCommitmentText: "Daily unbroken execution of core habits",
                badDayProtocolText: "Immediate 15-minute emergency rep",
                distractionStrategyText: "Lockdown of notifications and screen time",
                consistencyCheckpointText: "Quantum Core AI verification",
                continuationPlanText: "Defend transformed standards as an immutable baseline",
                serialNumber: cert?.certificateNumber || "QNTM-CONTRACT-2026-90",
                generatedDate: new Date().toLocaleDateString(),
              };

              return (
                <QuantumContractDocument
                  participant={{
                    name: user?.name || "Challenger",
                    age: user?.profile?.age || "21",
                    academicStatus: cert?.academicStatus || user?.profile?.currentClass || "Independent Challenger",
                    username: user?.username || "CHALLENGER",
                  }}
                  contract={contractDoc}
                  signatureUrl={cert?.signatureUrl || null}
                />
              );
            })()}
          </div>
        </div>
      )}

      {/* Full Official A4 Landscape 90-Day Arc Completion Certificate Modal */}
      {isCompletionCertModalOpen && completionData && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-5xl flex items-center justify-between py-3 mb-4 border-b border-slate-800 text-white no-print">
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-400">
              <Award size={18} />
              <span>QUANTUM 90-DAY WINTER ARC • CERTIFICATE OF COMPLETION</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCertificateImage(completionData)}
                className="gap-1.5 font-mono text-xs border-sky-600 text-sky-400 hover:bg-sky-950/40"
              >
                <Download size={14} /> DOWNLOAD CERTIFICATE
              </Button>
              <Button
                variant="quantum"
                size="sm"
                onClick={() => {
                  document.body.classList.add("printing-landscape");
                  window.print();
                  setTimeout(() => document.body.classList.remove("printing-landscape"), 1000);
                }}
                className="gap-1.5 font-mono text-xs"
              >
                <Printer size={14} /> PRINT (A4 LANDSCAPE)
              </Button>
              <button
                onClick={() => setIsCompletionCertModalOpen(false)}
                className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center pb-12">
            <QuantumCompletionCertificate data={completionData} />
          </div>
        </div>
      )}

      {/* Surprise Physical 90-Day Habit Tracker Modal with Click to Open */}
      <HabitTrackerSurpriseModal
        isOpen={isSurpriseTrackerOpen}
        onClose={() => {
          try {
            localStorage.setItem("quantum_habit_tracker_surprise_opened_v1", "true");
          } catch {}
          setIsSurpriseTrackerOpen(false);
        }}
        selectedHabits={habits.map((h) => h.title)}
        userName={user?.name || "Challenger"}
        forceOpenUnsealed={forceUnsealedTracker}
      />

      {/* Cinematic 90th Day Arc Completion Celebration Sequence */}
      {isCelebrationOpen && completionData && (
        <ArcCompletionCelebration
          data={completionData}
          onClose={() => setIsCelebrationOpen(false)}
        />
      )}

      {/* Strict Winter Arc Level Ladder Modal & Animation (Day 1, 7, 14, 25, 30, 45, 52, 65, 75, 90) */}
      <LevelUpModal
        data={levelUpData}
        onClose={() => setLevelUpData(null)}
      />

      {/* Voluntary Support / Donation Modal */}
      <QuantumSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Interactive Avatar Drag-and-Crop Modal */}
      {cropModalSrc && (
        <AvatarCropModal
          isOpen={!!cropModalSrc}
          imageSrc={cropModalSrc}
          onClose={() => setCropModalSrc(null)}
          onCropComplete={async (croppedUrl) => {
            await handleSelectAvatar(croppedUrl);
            setCropModalSrc(null);
          }}
        />
      )}
    </div>
  );
}
