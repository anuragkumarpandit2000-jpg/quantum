import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/utils";

const competitors = [
  {
    name: "Tanishq M.",
    username: "tanishq_arc",
    email: "tanishq@quantum.system",
    avatar: "/assets/images/avatars/avatar_16.jpg",
    level: 9,
    totalXP: 8750,
    currentClass: "Obsidian Sovereign",
    currentStreak: 42,
    longestStreak: 42,
    consistencyRate: 98.2,
  },
  {
    name: "Riddhi S.",
    username: "riddhi_discipline",
    email: "riddhi@quantum.system",
    avatar: "/assets/images/avatars/avatar_17.jpg",
    level: 8,
    totalXP: 7420,
    currentClass: "Vanguard Titan",
    currentStreak: 36,
    longestStreak: 36,
    consistencyRate: 94.5,
  },
  {
    name: "Raghav K.",
    username: "raghav_forge",
    email: "raghav@quantum.system",
    avatar: "/assets/images/avatars/avatar_18.jpg",
    level: 7,
    totalXP: 6190,
    currentClass: "Apex Sentinel",
    currentStreak: 28,
    longestStreak: 30,
    consistencyRate: 91.0,
  },
  {
    name: "Sameer P.",
    username: "sameer_execution",
    email: "sameer@quantum.system",
    avatar: "/assets/images/avatars/avatar_19.jpg",
    level: 6,
    totalXP: 5450,
    currentClass: "Quantum Adept",
    currentStreak: 22,
    longestStreak: 25,
    consistencyRate: 88.0,
  },
  {
    name: "Zoya B.",
    username: "zoya_focus",
    email: "zoya@quantum.system",
    avatar: "/assets/images/avatars/avatar_20.jpg",
    level: 4,
    totalXP: 3890,
    currentClass: "Discipline Adept",
    currentStreak: 18,
    longestStreak: 18,
    consistencyRate: 85.5,
  },
  {
    name: "Neelam D.",
    username: "neelam_momentum",
    email: "neelam@quantum.system",
    avatar: "/assets/images/avatars/avatar_21.jpg",
    level: 4,
    totalXP: 3120,
    currentClass: "Kinetic Operator",
    currentStreak: 12,
    longestStreak: 14,
    consistencyRate: 82.0,
  },
  {
    name: "Arman X.",
    username: "arman_arc90",
    email: "arman@quantum.system",
    avatar: "/assets/images/avatars/avatar_22.jpg",
    level: 3,
    totalXP: 2640,
    currentClass: "Initiate Tier III",
    currentStreak: 9,
    longestStreak: 10,
    consistencyRate: 79.5,
  },
  {
    name: "Devika C.",
    username: "devika_arc",
    email: "devika@quantum.system",
    avatar: "/assets/images/avatars/avatar_23.jpg",
    level: 2,
    totalXP: 1980,
    currentClass: "Initiate Tier II",
    currentStreak: 7,
    longestStreak: 7,
    consistencyRate: 76.0,
  },
];

async function seedCompetitors() {
  console.log("Seeding distinct competitor profiles with unique character PFPs...");
  const pwd = hashPassword("quantum90");

  // Also update Arun V. avatar
  const arun = await prisma.user.findFirst({ where: { email: "demo@quantum.system" } });
  if (arun) {
    await prisma.profile.update({
      where: { userId: arun.id },
      data: { avatar: "/assets/images/avatars/avatar_15.jpg" },
    });
    console.log("Updated Arun V. avatar to /assets/images/avatars/avatar_15.jpg");
  }

  for (const c of competitors) {
    const existing = await prisma.user.findFirst({ where: { email: c.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: c.email,
          username: c.username,
          name: c.name,
          passwordHash: pwd,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          profile: {
            create: {
              avatar: c.avatar,
              level: c.level,
              totalXP: c.totalXP,
              targetXP: 10000,
              currentClass: c.currentClass,
              onboardingDone: true,
              objective: `Relentless execution across 90 days. Focus on physical and mental transformation.`,
            },
          },
          settings: {
            create: {
              leaderboardVisible: true,
              soundEnabled: true,
            },
          },
          streak: {
            create: {
              currentStreak: c.currentStreak,
              longestStreak: c.longestStreak,
              consistencyRate: c.consistencyRate,
              lastCompletedDay: c.currentStreak,
            },
          },
        },
      });
      console.log(`Seeded competitor ${c.name} with unique avatar ${c.avatar}`);
    } else {
      await prisma.profile.update({
        where: { userId: existing.id },
        data: { avatar: c.avatar, level: c.level, totalXP: c.totalXP, currentClass: c.currentClass },
      });
      console.log(`Updated competitor ${c.name} with unique avatar ${c.avatar}`);
    }
  }

  console.log("All competitors seeded with unique PFPs successfully!");
}

seedCompetitors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
