import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Seed Sample Feedback from review.txt
  const sampleReviews = [
    {
      authorName: "Aarav",
      authorTitle: "Student",
      rating: 5,
      quote: "Quantum makes my 90-day goals feel much more organized. The habit matrix and XP system make it satisfying to come back every day.",
      avatarUrl: "/assets/images/avatars/avatar_01.png",
    },
    {
      authorName: "Rohan",
      authorTitle: "Student",
      rating: 5,
      quote: "I really like how everything is in one place instead of using multiple apps. The analytics make my progress much easier to understand.",
      avatarUrl: "/assets/images/avatars/avatar_02.png",
    },
    {
      authorName: "Ananya",
      authorTitle: "Student",
      rating: 5,
      quote: "The Quantum Core AI is a really cool concept. It feels like having a personal coach that understands what I’m trying to achieve.",
      avatarUrl: "/assets/images/avatars/avatar_03.png",
    },
    {
      authorName: "Kabir",
      authorTitle: "Student",
      rating: 5,
      quote: "The 90-day Winter Arc structure makes consistency feel like an actual mission. I especially like the streak and competition features.",
      avatarUrl: "/assets/images/avatars/avatar_04.jpg",
    },
    {
      authorName: "Dev",
      authorTitle: "Creator",
      rating: 4,
      quote: "The interface looks extremely clean and futuristic. The habit tracker is simple enough to use every day without feeling complicated.",
      avatarUrl: "/assets/images/avatars/avatar_05.jpg",
    },
    {
      authorName: "Vihaan",
      authorTitle: "Student",
      rating: 5,
      quote: "I love the idea of earning XP for completing real-life goals. Seeing everything turn into measurable progress makes the journey more motivating.",
      avatarUrl: "/assets/images/avatars/avatar_06.jpg",
    },
    {
      authorName: "Aditya",
      authorTitle: "Student",
      rating: 5,
      quote: "The skills section is one of my favourite concepts. Breaking something big like coding or Blender into tiny tasks makes learning feel much easier.",
      avatarUrl: "/assets/images/avatars/avatar_07.jpg",
    },
    {
      authorName: "Ishaan",
      authorTitle: "Student",
      rating: 5,
      quote: "The competition system gives the challenge another level of motivation. You can actually see where you stand while still focusing on your own progress.",
      avatarUrl: "/assets/images/avatars/avatar_08.jpg",
    },
    {
      authorName: "Arjun",
      authorTitle: "Student",
      rating: 5,
      quote: "Finally, a productivity concept that combines habits, analytics, AI and competition in one place. The whole Quantum experience feels different from a normal tracker.",
      avatarUrl: "/assets/images/avatars/avatar_09.jpg",
    },
    {
      authorName: "Reyansh",
      authorTitle: "Student",
      rating: 5,
      quote: "The 90-day concept is simple but powerful. Having a visual record of your daily effort, XP and progress could make the entire transformation journey much more meaningful.",
      avatarUrl: "/assets/images/avatars/avatar_10.jpg",
    },
  ];

  await prisma.feedback.deleteMany({});
  for (const r of sampleReviews) {
    await prisma.feedback.create({
      data: {
        authorName: r.authorName,
        authorTitle: r.authorTitle,
        rating: r.rating,
        quote: r.quote,
        avatarUrl: r.avatarUrl,
        isSample: true,
        isApproved: true,
      },
    });
  }
  console.log(" Seeded 10 sample reviews");

  // 2. Seed Default Demo Challenger
  const demoEmail = "demo@quantum.system";
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingUser) {
    const passwordHash = hashPassword("quantum90");
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        username: "challenger_arc",
        name: "Arun V.",
        passwordHash,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            avatar: "/assets/images/avatar_3.png",
            objective: "Total mastery of physical conditioning, deep work, and high-frequency habit execution over 90 days.",
            currentClass: "Quantum Adept",
            level: 5,
            totalXP: 4280,
            targetXP: 10000,
            dailyAvailableHours: 3.5,
            age: 21,
            onboardingDone: true,
          },
        },
        settings: {
          create: {
            soundEnabled: true,
            soundVolume: 0.4,
            leaderboardVisible: true,
            activityVisible: true,
          },
        },
        streak: {
          create: {
            currentStreak: 14,
            longestStreak: 18,
            lastCompletedDay: 14,
            consistencyRate: 88.5,
          },
        },
      },
    });

    // Seed default habits
    const habitsData = [
      { title: "MEDITATION", category: "Mind & Clarity", icon: "brain", color: "#38bdf8" },
      { title: "WORKOUT", category: "Physical Power", icon: "dumbbell", color: "#22d3ee" },
      { title: "DEEP WORK / STUDY", category: "Intellectual Mastery", icon: "book-open", color: "#818cf8" },
      { title: "READING (30 MIN)", category: "Knowledge Acquisition", icon: "scroll", color: "#a855f7" },
      { title: "COLD SHOWER", category: "Dopamine Reset", icon: "snowflake", color: "#06b6d4" },
    ];

    for (let hIdx = 0; hIdx < habitsData.length; hIdx++) {
      const h = habitsData[hIdx];
      const habit = await prisma.habit.create({
        data: {
          userId: user.id,
          title: h.title,
          category: h.category,
          icon: h.icon,
          color: h.color,
          order: hIdx,
        },
      });

      // Generate 90 day completions
      const completions = [];
      for (let day = 1; day <= 90; day++) {
        let status = "PENDING";
        if (day <= 14) {
          // days 1..14 mostly completed with occasional missed
          if (day === 4 && hIdx === 0) status = "MISSED";
          else if (day === 5 && hIdx === 1) status = "MISSED";
          else status = "COMPLETED";
        }
        completions.push({
          habitId: habit.id,
          dayNumber: day,
          status,
          completedAt: status === "COMPLETED" ? new Date() : null,
        });
      }
      await prisma.habitCompletion.createMany({ data: completions });
    }

    // Seed Sample Skills
    const skill1 = await prisma.skill.create({
      data: {
        userId: user.id,
        title: "BLENDER 3D MODELLING",
        category: "Creative Technology",
        level: "Level 2: Advanced Geometries",
        progress: 60,
      },
    });

    const tasks = [
      { title: "Learn Viewport & 3D Gizmos Navigation", xpReward: 100, completed: true },
      { title: "Master Mesh Editing & Subdivisions", xpReward: 150, completed: true },
      { title: "Sculpt First Organic Character Base", xpReward: 200, completed: true },
      { title: "Procedural Shading & Glass Dispersion Nodes", xpReward: 250, completed: false },
      { title: "Render Photorealistic Quantum Prism Artifact", xpReward: 300, completed: false },
    ];

    for (let tIdx = 0; tIdx < tasks.length; tIdx++) {
      const t = tasks[tIdx];
      const st = await prisma.skillTask.create({
        data: {
          skillId: skill1.id,
          title: t.title,
          xpReward: t.xpReward,
          order: tIdx,
        },
      });
      await prisma.skillTaskCompletion.create({
        data: {
          taskId: st.id,
          completed: t.completed,
          completedAt: t.completed ? new Date() : null,
        },
      });
    }

    // Seed XP transactions
    await prisma.xPTransaction.createMany({
      data: [
        { userId: user.id, amount: 500, source: "ONBOARDING_COMPLETION", description: "Winter Arc Induction Pledge Finalized" },
        { userId: user.id, amount: 1500, source: "STREAK_MILESTONE", description: "14-Day Unbroken Streak Milestone Reached" },
        { userId: user.id, amount: 450, source: "SKILL_TASK", description: "Completed 3 Blender foundational micro-tasks" },
        { userId: user.id, amount: 1830, source: "HABIT_COMPLETION", description: "Cumulative daily habit execution" },
      ],
    });

    // Seed Certificate
    await prisma.certificate.create({
      data: {
        userId: user.id,
        certificateNumber: "QNTM-ARC-2025-9014",
        userName: "Arun V.",
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        pledge: "I hereby commit to 90 consecutive days of unwavering focus, intense execution, and relentless self-discipline under the Quantum Winter Arc system.",
      },
    });

    // Seed Achievements
    await prisma.achievement.createMany({
      data: [
        { userId: user.id, code: "FIRST_STEP", title: "Quantum Genesis", description: "Initiated Day 01 of the Winter Arc transformation." },
        { userId: user.id, code: "STREAK_7", title: "Obsidian Persistence", description: "Completed 7 days uninterrupted streak." },
        { userId: user.id, code: "LEVEL_5", title: "Quantum Adept", description: "Surpassed 4,000 XP in verified discipline actions." },
      ],
    });

    console.log(" Seeded demo user with habits, skills, XP, and certificate");
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
