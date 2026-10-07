# QUANTUM Architecture Map
*System Blueprint — transformationyourself.in*
*Generated: October 2026 | Branch: `quantum-hardening`*

---

## 1. Executive Overview

**QUANTUM** is an elite 90-day "Winter Arc" habit and self-discipline transformation web application built on **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL (via Prisma ORM)**. It features real-time gamified XP tracking, immutable habit matrices, server-side streak calculations, verification proof logging, AI coaching (Quantum Core powered by Google Gemini), and dynamic contract and certificate generation.

- **Production URL**: `https://www.transformationyourself.in`
- **Hosting Platform**: Vercel (Edge Network + Serverless Functions)
- **Database Engine**: PostgreSQL (Neon / Supabase connection pooling)
- **Primary Auth Model**: JWT (`quantum_session` HttpOnly Cookie) + Email Verification (Resend API)

---

## 2. Directory Structure

```
quantum/
├── assets/                     # Raw media assets (videos, frame sequences)
├── data/                       # Local data stores / seeds
├── docs/                       # Technical architecture, changelog & security audits
│   ├── ARCHITECTURE.md         # This system map
│   ├── CHANGELOG-HARDENING.md  # Detailed audit & hardening log
│   └── AUDIT-REPORT.md         # Final comprehensive audit & red-team report
├── prisma/
│   └── schema.prisma           # Relational PostgreSQL data models
├── public/
│   ├── assets/                 # Web-optimized assets (audio, scripts, videos, images)
│   ├── uploads/                # User uploaded content (avatars, proofs)
│   ├── robots.txt              # Search crawler directives
│   └── sitemap.xml             # Public search indexing map
├── src/
│   ├── app/                    # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (public)/           # Landing (/), About (/about), Auth (/signup, /login)
│   │   ├── (auth-gated)/       # Dashboard (/dashboard), Onboarding (/onboarding), Admin (/admin)
│   │   ├── (verification)/     # Email Verification (/verify-email), Certificate (/verify/[id])
│   │   └── api/                # 29 REST endpoints across Auth, Habits, AI, Admin, Gallery
│   ├── components/             # Domain-driven modular React components
│   │   ├── audio/              # Sound effects & ambient audio player
│   │   ├── certificate/        # High-res canvas/DOM certificate rendering
│   │   ├── dashboard/          # HUD, habit matrix, analytics, streak telemetry
│   │   ├── donations/          # UPI donation cards & pledge trackers
│   │   ├── habits/             # Habit editors, completion checkboxes
│   │   ├── landing/            # Hero, proof feed, reviews, pricing, FAQ
│   │   ├── onboarding/         # Questionnaire, canvas signature, contract ratifier
│   │   └── ui/                 # Reusable UI primitives (dialog, popover, buttons, 3D calendar)
│   ├── lib/                    # Core business logic & utility modules
│   │   ├── ai/                 # Gemini API wrapper (quantum-core.ts)
│   │   ├── auth.ts             # JWT token generation, verification, user session parser
│   │   ├── email-service.ts    # Resend email delivery & verification templates
│   │   ├── prisma.ts           # Singleton Prisma client instance
│   │   └── utils.ts            # Level calculation, date math, streak rules
│   └── middleware.ts           # Edge runtime security headers & route protection
├── next.config.mjs             # Next.js build & image optimization configuration
├── tailwind.config.ts          # Color tokens, custom animations, font variables
└── tsconfig.json               # Strict TypeScript compiler options
```

---

## 3. Data Models (`prisma/schema.prisma`)

| Model | Purpose | Key Relations & Constraints |
| :--- | :--- | :--- |
| `User` | Root identity & authentication | `email`, `username` unique; bcrypt passwordHash; relations to all modules. |
| `EmailVerificationToken` | One-time tokens for account activation | `tokenHash` unique; SHA-256 hashed; 24-hour expiry. |
| `Profile` | Arc persona, rank, stats & start dates | 1:1 with `User`; stores `totalXP`, `level`, `currentClass`, `startDate`, `endDate`. |
| `UserSettings` | User preferences & visibility toggles | 1:1 with `User`; sound volume, `leaderboardVisible`, notifications. |
| `Streak` | Real-time consistency & streak telemetry | 1:1 with `User`; `currentStreak`, `longestStreak`, `consistencyRate`. |
| `Habit` | Daily habits tracked during the Arc | 1:N with `User`; stores title, category, order, archived status. |
| `HabitCompletion` | 90-day status matrix per habit | Compound unique `[habitId, dayNumber]`; status: PENDING / COMPLETED / MISSED. |
| `XPTransaction` | Immutable ledger of all XP changes | 1:N with `User`; records amount, source, timestamp, reference ID. |
| `Skill` | Target skill selected during onboarding | 1:N with `User`; stores skill title, level, progress %. |
| `SkillTask` | Micro-tasks decomposed from skill | 1:N with `Skill`; stores title, order, xpReward (+100 XP). |
| `SkillTaskCompletion` | Micro-task toggle status | 1:1 with `SkillTask`; tracks completed boolean and timestamp. |
| `GalleryItem` | Daily execution proofs (photos/videos) | 1:N with `User`; stores fileUrl, caption, dayNumber, isPublic. |
| `Achievement` | Badges unlocked by streak/milestones | Compound unique `[userId, code]`; title, icon, unlockedAt. |
| `Feedback` | Testimonials & reviews on landing page | Optional relation to `User`; rating (1-5), quote, donation badge, isApproved. |
| `AIConversation` | Chat thread with Quantum Core | 1:N with `User`; title, timestamps. |
| `AIMessage` | Chat messages exchanged with Gemini | 1:N with `AIConversation`; role (user/assistant/system), content. |
| `Certificate` | Official Commitment & Completion Certs | Unique `certificateNumber`; contractData JSON, pledge, issuedAt. |
| `Donation` | Community support pledges (UPI) | Stores amount, status (PENDING / COMPLETED), transactionRef. |
| `Notification` | In-app notification alerts | 1:N with `User`; type (INFO, STREAK, XP), read status. |

---

## 4. Routing & Page Architecture

### 4.1 Frontend Pages (`src/app/`)
- `/` — High-converting landing page: Hero counter, continuous video entry, live proof showcase, habit matrix preview, 3D rotating phone showcase, FAQ, reviews, and UPI support.
- `/about` — System manifesto, operational rules, phase breakdowns, and protocol FAQ.
- `/signup` — Account registration with real-time email syntax and callsign validation.
- `/verify-email` — 6-digit / link email verification screen with resend cooldown and restart flow.
- `/login` — Challenger authentication with session cookie creation.
- `/onboarding` — Multi-stage onboarding: diagnostic questionnaire, psychological evaluation, habit selection, canvas signature, and initial Commitment Certificate.
- `/dashboard` — Authenticated Command HUD:
  - Tab 1: **Daily Execution Matrix** (90-day habit checkboxes, streak counter, XP bar, daily proofs).
  - Tab 2: **Analytics & 3D Wall Calendar** (Consistency metrics, spatial 3D calendar with milestones).
  - Tab 3: **Skill Acquisition Lab** (Microtask breakdown with +100 XP rewards).
  - Tab 4: **Leaderboard & Competition** (Verified challenger rankings and squads).
  - Tab 5: **Quantum Core AI** (Conversational AI discipline coach with context injection).
  - Tab 6: **Proof Gallery** (Public and private photo proof timeline).
- `/admin` — System overview: challenger counts, verified accounts, review approvals, donation management.
- `/verify/[id]` — Public verification page for official certificate numbers.

### 4.2 API Routes (`src/app/api/`)
- **Authentication**: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification`, `GET /api/auth/me`, `POST /api/auth/logout`.
- **Habits & Matrix**: `GET|POST /api/habits`, `PATCH|DELETE /api/habits/[habitId]`, `PATCH /api/habits/[habitId]/completion`.
- **Skills & Tasks**: `GET|POST /api/skills`, `PATCH /api/skills/[taskId]/toggle`.
- **AI Core**: `POST /api/ai/chat`, `POST /api/ai/tts`, `POST /api/ai/onboarding-analysis`, `POST /api/ai/contract-generate`.
- **Certificates**: `GET|POST /api/certificate`, `GET /api/verify/[id]`.
- **Proofs & Uploads**: `GET|POST /api/gallery`, `DELETE|PATCH /api/gallery/[id]`, `POST /api/upload/avatar`.
- **Community & Social**: `GET|POST /api/reviews`, `GET|POST /api/donations`, `GET /api/competition`, `GET /api/telemetry/live`.
- **Admin**: `GET /api/admin/overview`, `POST /api/admin/actions`.

---

## 5. Security & Middleware Configuration

1. **Edge Middleware (`src/middleware.ts`)**:
   - Intercepts requests to `/dashboard` and `/onboarding`.
   - Rejects unauthenticated requests with automatic redirect to `/login?from=...`.
   - Injects mandatory HTTP security headers:
     - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
     - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
     - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS)
   - Route matchers cleanly exclude static assets, `sitemap.xml`, and `robots.txt`.

2. **Session Security**:
   - `quantum_session` cookie issued with `httpOnly: true`, `sameSite: "lax"`, and `secure: process.env.NODE_ENV === "production"`.

3. **Input Sanitization & Authorization**:
   - All mutations verify `getCurrentUser(req)`.
   - Gallery and habit completion operations strictly verify object ownership (`existing.userId === user.id`).
   - HTML stripping on user feedback and reviews.
   - Magic bytes binary verification and 5MB size ceiling on file uploads.

---

## 6. Environment Variables

| Variable Name | Purpose | Scope |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL pooled connection URI | Server-only |
| `JWT_SECRET` | Signing secret for session JWTs | Server-only |
| `GEMINI_API_KEY` | Google Gemini API key for AI coaching & TTS | Server-only |
| `RESEND_API_KEY` | Resend API key for transactional emails | Server-only |
| `EMAIL_FROM` | Verified sender address for notifications | Server-only |
| `NEXT_PUBLIC_APP_URL` | Canonical public origin | Client + Server |
| `NODE_ENV` | Runtime environment (`development` / `production`) | System |

---

## 7. Performance & Device Strategy

1. **Rendering Performance**:
   - Low-end mobile CPU thresholding: Three.js background canvas adapts cleanly to touch devices.
   - Dynamic viewport sizing using `100dvh` and safe-area insets (`env(safe-area-inset-top)` / `bottom`).
   - Off-screen animation loops (showcases, proof feeds) paused with `IntersectionObserver`.
2. **Asset Delivery**:
   - Video elements configured with `preload="metadata"` or `preload="none"`.
   - Continuous mobile video entry (`quantum_mobile_entry.mp4`) faststart-optimized for instant streaming.
   - Responsive 3D Wall Calendar auto-fits 7 columns on phone screens without horizontal scroll.
