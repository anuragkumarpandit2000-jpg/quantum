# Quantum Hardening & Audit Changelog

This running log documents all findings, architectural changes, security mitigations, and verification results across all phases of the Quantum hardening task.

---

## Phase 0: Architecture Mapping & Setup
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening` (Created from `main`)
- **Actions**:
  - Full codebase inspection across `src/app`, `src/components`, `src/lib`, `prisma/schema.prisma`, `src/middleware.ts`, and public assets.
  - Authored comprehensive system architecture map in `docs/ARCHITECTURE.md`.
  - Initialized running hardening log in `docs/CHANGELOG-HARDENING.md`.
- **Verification**: Verified branch isolation (`git branch`), verified clean directory tree.

---

## Phase 1: Landing Page & About Trust, Copy, and Contradictions
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening`
- **What Was Wrong / Audit Findings**:
  - Hero counter displayed ungrammatical "1 CHALLENGERS • 1 ONLINE LIVE NOW" advertising an empty platform.
  - Solitary user shown with "Winter Arc Top 1% #1" badge.
  - Amit transformation block claimed 88/90 days and 61kg -> 74kg before the challenge could have naturally run that long without clear "sample" disclaimer.
  - 4 identical default placeholder avatars shown under "Active Protocol Squad".
  - 5.0 star rating and "Total Votes: 1" visible with single review.
  - Empty category tabs (Habits(0), Physical(0), Skills(0), AI Core(0)) and empty Proof Feed rendered empty boxes to visitors.
  - "Donate and Get Royal Card" conflicted with "badges cannot be bought" and "zero vanity".
  - Heavy AI jargon ("telemetry", "Sovereign Scarcity Hierarchy", "Navigation Console", "ascendance", "cryptographically verified DB", "immune to client-side injection", "legal-grade irrevocable contract", "<1.2s AI latency").
  - 6+ competing CTA labels across the landing page.
  - Missing legal policies (Privacy, Terms, Contact, Refund).
  - Dead relative anchor links in `/about` footer and missing section anchors.
  - Video issues: missing metadata preload, lack of accessible fallback, "click button inside video" instruction.
  - Rotating phone showcase displayed intrusive "FRAME BUFFERING..." overlay.
  - Contradictions in duration (92 vs 90 days), timezone resets, XP awards (+50 vs +10..+25), and completion thresholds (85% vs 80%).
- **Files Modified / Created**:
  - Created: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/contact/page.tsx`, `src/app/refund/page.tsx`.
  - Created: `src/app/about/layout.tsx`, `src/app/signup/layout.tsx`, `src/app/login/layout.tsx`, `src/app/dashboard/layout.tsx`, `src/app/onboarding/layout.tsx`, `src/app/verify-email/layout.tsx`, `src/app/admin/layout.tsx`.
  - Modified: `src/app/page.tsx` (Hero counter threshold < 50 spots claimed, Hinglish hero subtitle, single CTA "Start Day 1", sample benchmark label, founder story section).
  - Modified: `src/app/about/page.tsx` (Harmonized 15 specs: +50 XP, 10,000 XP target, unified ranks, 80% pass threshold, IST local midnight, removed overclaims).
  - Modified: `src/components/landing/navbar.tsx` (Standardized CTA "Start Day 1", aligned section numbers 00-08, cleaned AI jargon).
  - Modified: `src/components/landing/footer.tsx` (Absolute links `/#...`, legal links, synchronized 00-08 sections, removed tech stack disclosures).
  - Modified: `src/components/landing/sovereign-badges-showcase.tsx` (Milestones & badges, clarified patron card has zero XP/rank benefit).
  - Modified: `src/components/landing/live-proof-feed-section.tsx` (Conditionally hides empty proof feed).
  - Modified: `src/components/landing/experiences-review-section.tsx` (Hides rating when < 10 reviews, hides empty tabs, patron support button).
  - Modified: `src/components/landing/quantum-typography-video-section.tsx` & `src/components/landing/quantum-welcome-video-section.tsx` (HTML button overlay, `preload="metadata"`, clean fallback).
  - Modified: `src/components/ui/mobile-rotating-showcase.tsx` (Removed buffering text, sleek minimal loader).
  - Modified: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts` (SEO JSON-LD, en_IN, canonical URLs, noindex for private routes).
- **Verification**:
  - `npx tsc --noEmit` passed with 0 errors.
  - Next.js production build (`npm run build`) passed successfully with 29/29 static pages generated and 0 compilation/lint errors.

---

## Phase 2: SEO, Performance, Accessibility & Responsive Refinement
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening`
- **What Was Wrong / Audit Findings**:
  - Full-screen elements relied on `100vh`, causing iOS Safari address-bar layout jank.
  - Heavy 3D tilt and multi-layered backdrop blur caused GPU frame drops on mid-range Android devices.
  - Star ratings lacked ARIA radiogroup roles, individual `aria-label` tags, and `aria-hidden` attributes on decorative icons.
  - Missing "Skip to Main Content" link for keyboard navigation.
  - No global handling for `prefers-reduced-motion`.
  - Habit matrix boxes were 28px by 28px, failing WCAG 44px minimum touch target size.
- **Files Modified**:
  - `src/app/globals.css`: Added `100dvh`, safe-area insets (`env(safe-area-inset-*)`), reduced motion overrides, mobile GPU blur reduction (`@media (hover: none)`), content-visibility optimization (`.section-lazy-render`), and touch manipulation rules.
  - `src/app/layout.tsx`: Added accessible skip-to-content link targeting `#main-content`.
  - `src/app/page.tsx` & `src/app/about/page.tsx`: Embedded semantic `<main id="main-content">` targets.
  - `src/components/landing/experiences-review-section.tsx`: Converted star rating to `role="radiogroup"`, `role="radio"`, added `aria-label`, `aria-checked`, and `aria-hidden="true"` on decorative stars.
- **Verification**: Verified zero layout overflow, keyboard accessibility tab order, and clean compilation.

---

## Phase 3: Premium Visual Upgrade & Design Tokens
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening`
- **What Was Wrong / Audit Findings**:
  - Inconsistent surface border colors and flat 1px white/10 borders throughout.
  - Overused cyberpunk decorations and cluttered status tags.
- **Files Modified**:
  - `src/app/globals.css`: Implemented 3-tier Deep Obsidian surface tokens (`.surface-canvas`, `.surface-card`, `.surface-elevated`).
  - `src/components/landing/quantum-mobile-experience.tsx`: Simplified status badges, labeled PWA installation availability and native apps coming soon.
- **Verification**: High-contrast dark theme verified with consistent slate and cyan accents.

---

## Phase 4: Authenticated Flow Audit (Post-Signup)
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening`
- **What Was Wrong / Audit Findings**:
  - Double-click to mark missed did not function on mobile touch devices.
  - Habit matrix lacked phase dividers separating the 30-day milestone blocks.
  - Proof uploads were public by default instead of private.
  - Lack of GDPR / DPDP Act 2023 compliant data export.
- **Files Modified / Created**:
  - `src/components/habits/habit-matrix.tsx`: Added long-press gesture (450ms) with haptic feedback, 44px touch targets, Phase dividers (Days 1–30 Foundation, 31–60 Momentum, 61–90 Mastery), and sticky habit column.
  - `src/app/api/gallery/route.ts`: Made proof uploads private by default (`isPublic: false` unless opted in) and capped daily XP to prevent duplicate farming.
  - Created: `src/app/api/settings/export/route.ts` delivering complete user JSON archive download.
- **Verification**: Tested API response formats and database relationships.

---

## Phase 5: Red-Team Security Assessment & Vulnerability Fixes
- **Date**: 07 October 2026
- **Branch**: `quantum-hardening`
- **What Was Wrong / Audit Findings**:
  - Unverified accounts could theoretically exploit `isAdmin` email check.
  - Sensitive administrator email address was exposed in `/admin` unauthorized view.
  - Missing rate limits on `/api/auth/login`, `/api/auth/signup`, and `/api/ai/chat`.
  - Lack of CSRF protection on mutating HTTP routes.
  - Missing Content Security Policy and frame-ancestors headers.
  - Missing apex domain 301 redirection to canonical `www`.
- **Files Created / Modified**:
  - Created: `src/lib/rate-limit.ts` (In-memory sliding window rate limiter with auto-pruning).
  - Created: `src/lib/sanitize.ts` (XSS sanitization and password strength validator).
  - Modified: `src/lib/auth.ts` (Strict verified email requirement for `isAdmin`, production warning for fallback JWT secrets).
  - Modified: `src/app/admin/page.tsx` (Redacted founder email address from public error state).
  - Modified: `src/app/api/auth/login/route.ts` (Enforced 5 attempts / 15 min per IP and identifier).
  - Modified: `src/app/api/auth/signup/route.ts` (Enforced 3 registrations / hour per IP, min 8 chars password).
  - Modified: `src/app/api/ai/chat/route.ts` (Enforced 20 calls / day per user, 3000 chars limit, health disclaimer).
  - Modified: `src/middleware.ts` (Added `/admin` to route protection, CSRF origin verification, CSP header, and apex-to-www 301 redirect).
  - Modified: `next.config.mjs` (Enforced `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, AVIF/WebP image formats).
  - Created: `docs/AUDIT-REPORT.md` (Comprehensive security audit matrix and remediation report).
- **Verification**:
  - `npx tsc --noEmit` passed with 0 errors.
  - `npm run build` passed with 29/29 static pages generated and 0 compilation errors.
