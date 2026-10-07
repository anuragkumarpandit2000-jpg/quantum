import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/components/audio/audio-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.transformationyourself.in"),
  title: {
    default: "QUANTUM — 90-Day Winter Arc Habit & Discipline Operating System",
    template: "%s | QUANTUM Winter Arc",
  },
  description:
    "An autonomous personal transformation operating system. Master daily habits, accountability streaks, authentic XP progression, and 90 consecutive days of focused discipline.",
  authors: [{ name: "Anurag Pandit", url: "https://www.transformationyourself.in" }],
  creator: "QUANTUM",
  publisher: "QUANTUM",
  alternates: {
    canonical: "https://www.transformationyourself.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.transformationyourself.in",
    siteName: "QUANTUM — Transformation Yourself",
    title: "QUANTUM — 90-Day Winter Arc Habit & Discipline System",
    description:
      "Lock in for 90 days. Master habits, level up with verified XP, compete on the leaderboard, and claim your physical transformation.",
    images: [
      {
        url: "/assets/images/background.png",
        width: 1200,
        height: 630,
        alt: "QUANTUM 90-Day Winter Arc Transformation OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QUANTUM — 90-Day Winter Arc Transformation OS",
    description:
      "Lock in for 90 days. Master habits, level up with verified XP, and build unbroken discipline.",
    images: ["/assets/images/background.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/images/logo/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.transformationyourself.in/#organization",
      "name": "QUANTUM",
      "url": "https://www.transformationyourself.in",
      "logo": "https://www.transformationyourself.in/assets/images/logo/logo.png",
      "founder": {
        "@type": "Person",
        "name": "Anurag Pandit"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://www.transformationyourself.in/#app",
      "name": "QUANTUM Winter Arc",
      "url": "https://www.transformationyourself.in",
      "applicationCategory": "HealthAndFitnessApplication, ProductivityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.transformationyourself.in/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the timeline: 92 days vs 90 days?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The global Winter Arc window spans 92 days (1 October to 31 December). Each challenger commits to a 90-day personal arc. If you join after 1 October, your personal 90-day counter begins on your Day 1."
          }
        },
        {
          "@type": "Question",
          "name": "When does each day reset?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Days reset strictly at local midnight (Indian Standard Time / IST by default)."
          }
        },
        {
          "@type": "Question",
          "name": "How does the 90-Day Habit Matrix work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each habit displays a 90-day horizontal grid. Clicking a box marks it completed and awards +50 XP. Double-clicking marks it missed. You need an 80% completion rate (maximum 18 misses across the 90 days) to qualify for the completion certificate."
          }
        },
        {
          "@type": "Question",
          "name": "Is Quantum free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, completely free. All core systems—Habit Matrix, XP Engine, Skill Decomposer, Proof Gallery, 3D Calendar, and Quantum Core AI—have zero paywalls."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem("quantum_theme", "dark");
                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-quantum-obsidian text-slate-100 min-h-screen antialiased selection:bg-sky-500 selection:text-slate-950 font-sans transition-colors duration-300">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-400 focus:text-slate-950 focus:font-mono focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchema),
          }}
        />
        <ThemeProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
