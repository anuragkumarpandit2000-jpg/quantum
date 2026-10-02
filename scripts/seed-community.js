const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// Node native --env-file is used
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper: Password Hashing (identical to src/lib/utils.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// Format Name from email handle
function formatName(handle) {
  let cleaned = handle.replace(/[0-9_.-]+/g, ' ').trim();
  if (!cleaned) cleaned = 'Challenger';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Winter Arc Milestones
const TIERS = [
  { minStreak: 1, maxStreak: 6, level: 1, tier: 'Initiate Tier I', minXP: 100, maxXP: 600 },
  { minStreak: 7, maxStreak: 13, level: 2, tier: 'Discipline Neophyte', minXP: 700, maxXP: 1300 },
  { minStreak: 14, maxStreak: 24, level: 3, tier: 'Kinetic Operator', minXP: 1400, maxXP: 2400 },
  { minStreak: 25, maxStreak: 29, level: 4, tier: 'Focus Vanguard', minXP: 2500, maxXP: 2900 },
  { minStreak: 30, maxStreak: 44, level: 5, tier: 'Quantum Adept', minXP: 3000, maxXP: 4400 },
  { minStreak: 45, maxStreak: 51, level: 6, tier: 'Habit Titan', minXP: 4500, maxXP: 5100 },
  { minStreak: 52, maxStreak: 64, level: 7, tier: 'Arc Master', minXP: 5200, maxXP: 6400 },
  { minStreak: 65, maxStreak: 74, level: 8, tier: 'Apex Sentinel', minXP: 6500, maxXP: 7400 },
  { minStreak: 75, maxStreak: 89, level: 9, tier: 'Obsidian Sovereign', minXP: 7500, maxXP: 8900 },
  { minStreak: 90, maxStreak: 90, level: 10, tier: 'Ascended Vanguard', minXP: 9000, maxXP: 10000 },
];

async function seed() {
  console.log('--- STARTING HIGH-SPEED COMMUNITY SEEDING ---');

  // Pre-compute standard password hash for Anurag.ai
  console.log('Generating pre-computed password hash for password: Anurag.ai ...');
  const defaultPasswordHash = hashPassword('Anurag.ai');

  // ==========================================
  // 1. SEED FEEDBACKS
  // ==========================================
  const feedbackFile = path.join(__dirname, '../data/community_feedbacks.tsv');
  if (fs.existsSync(feedbackFile)) {
    console.log('\nLoading feedbacks from', feedbackFile, '...');
    const feedbackRaw = fs.readFileSync(feedbackFile, 'utf8');
    const feedbackLines = feedbackRaw.split(/\r?\n/).filter(l => l.trim().length > 0);

    const feedbackRecords = [];
    const titles = [
      'Winter Arc Challenger',
      'Discipline Neophyte',
      'Habit Vanguard',
      'Arc Master',
      '90-Day Competitor',
      'Kinetic Operator',
      'Apex Sentinel',
    ];

    for (let i = 1; i < feedbackLines.length; i++) {
      const parts = feedbackLines[i].split('\t');
      if (parts.length >= 2) {
        const quote = parts[1].trim();
        if (quote && quote.length > 10) {
          const avatarNum = String((i % 14) + 1).padStart(2, '0');
          const ext = [1, 2, 3].includes((i % 14) + 1) ? 'png' : 'jpg';
          const avatarUrl = `/assets/images/avatars/avatar_${avatarNum}.${ext}`;
          const rating = (i % 10 === 0) ? 4 : 5;
          const authorTitle = titles[i % titles.length];

          feedbackRecords.push({
            id: uuidv4(),
            quote,
            rating,
            authorName: `Verified Challenger #${parts[0] || i}`,
            authorTitle,
            avatarUrl,
            isApproved: true,
            isSample: false,
            createdAt: new Date(Date.now() - (i * 3600000 * 3)),
          });
        }
      }
    }

    console.log(`Parsed ${feedbackRecords.length} feedbacks. Inserting in chunks of 500...`);
    const chunkSize = 500;
    for (let i = 0; i < feedbackRecords.length; i += chunkSize) {
      const chunk = feedbackRecords.slice(i, i + chunkSize);
      await prisma.feedback.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      console.log(`  Inserted feedbacks ${i + 1} - ${Math.min(i + chunkSize, feedbackRecords.length)}`);
    }
  }

  // ==========================================
  // 2. SEED USERS, PROFILES, STREAKS, SETTINGS
  // ==========================================
  const emailFile = path.join(__dirname, '../data/community_emails.csv');
  if (fs.existsSync(emailFile)) {
    console.log('\nLoading community emails from', emailFile, '...');
    const emailRaw = fs.readFileSync(emailFile, 'utf8');
    const emailLines = emailRaw.split(/\r?\n/).filter(l => l.trim().length > 0);

    const existingUsers = await prisma.user.findMany({ select: { email: true, username: true } });
    const existingEmailSet = new Set(existingUsers.map(u => u.email.toLowerCase()));
    const existingUsernameSet = new Set(existingUsers.map(u => u.username.toLowerCase()));

    const usersToInsert = [];
    const profilesToInsert = [];
    const settingsToInsert = [];
    const streaksToInsert = [];

    for (let i = 1; i < emailLines.length; i++) {
      const parts = emailLines[i].split(',');
      if (parts.length < 2) continue;
      const email = parts[1].trim().toLowerCase();
      if (!email || !email.includes('@')) continue;

      // Skip admin email
      if (email === 'anuragkumar.pandit2000@gmail.com') continue;
      if (existingEmailSet.has(email)) continue;

      let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      let username = baseUsername;
      let counter = 1;
      while (existingUsernameSet.has(username)) {
        username = `${baseUsername}_${counter++}`;
      }
      existingUsernameSet.add(username);
      existingEmailSet.add(email);

      const userId = uuidv4();
      const name = formatName(baseUsername);

      // Distribute levels & streaks realistically
      const tierIndex = i % TIERS.length;
      const tier = TIERS[tierIndex];
      const currentStreak = Math.floor(Math.random() * (tier.maxStreak - tier.minStreak + 1)) + tier.minStreak;
      const totalXP = Math.floor(Math.random() * (tier.maxXP - tier.minXP + 1)) + tier.minXP;
      const consistencyRate = Math.min(100, Math.max(78, +(85 + (Math.random() * 15)).toFixed(1)));

      const avatarNum = String((i % 14) + 1).padStart(2, '0');
      const ext = [1, 2, 3].includes((i % 14) + 1) ? 'png' : 'jpg';
      const avatar = `/assets/images/avatars/avatar_${avatarNum}.${ext}`;

      usersToInsert.push({
        id: userId,
        email,
        username,
        name,
        passwordHash: defaultPasswordHash,
        role: 'USER',
        emailVerified: true,
        emailVerifiedAt: new Date(Date.now() - (i * 3600000)),
        createdAt: new Date(Date.now() - (i * 3600000 * 2)),
      });

      profilesToInsert.push({
        id: uuidv4(),
        userId,
        avatar,
        level: tier.level,
        currentClass: tier.tier,
        totalXP,
        targetXP: 10000,
        objective: 'Master discipline, achieve peak physical and mental clarity through the 90-Day Winter Arc.',
        dailyAvailableHours: 2.5,
        onboardingDone: true,
      });

      settingsToInsert.push({
        id: uuidv4(),
        userId,
        leaderboardVisible: true,
        activityVisible: true,
        soundEnabled: true,
        soundVolume: 0.4,
        theme: 'dark',
      });

      streaksToInsert.push({
        id: uuidv4(),
        userId,
        currentStreak,
        longestStreak: Math.max(currentStreak, currentStreak + Math.floor(Math.random() * 5)),
        lastCompletedDay: currentStreak,
        consistencyRate,
        updatedAt: new Date(),
      });
    }

    console.log(`Prepared ${usersToInsert.length} new community members.`);
    const chunkSize = 500;
    for (let i = 0; i < usersToInsert.length; i += chunkSize) {
      const uChunk = usersToInsert.slice(i, i + chunkSize);
      const pChunk = profilesToInsert.slice(i, i + chunkSize);
      const sChunk = settingsToInsert.slice(i, i + chunkSize);
      const stChunk = streaksToInsert.slice(i, i + chunkSize);

      await prisma.user.createMany({ data: uChunk, skipDuplicates: true });
      await prisma.profile.createMany({ data: pChunk, skipDuplicates: true });
      await prisma.userSettings.createMany({ data: sChunk, skipDuplicates: true });
      await prisma.streak.createMany({ data: stChunk, skipDuplicates: true });

      console.log(`  Inserted batch ${i + 1} - ${Math.min(i + chunkSize, usersToInsert.length)} members`);
    }
  }

  const [finalUsers, finalFeedbacks] = await Promise.all([
    prisma.user.count(),
    prisma.feedback.count(),
  ]);

  console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
  console.log('Total Users in Database:', finalUsers);
  console.log('Total Feedbacks in Database:', finalFeedbacks);
}

seed()
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
