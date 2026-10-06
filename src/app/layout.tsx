import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/components/audio/audio-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://transformationyourself.in"),
  title: {
    default: "QUANTUM — 90-Day Winter Arc Transformation Operating System",
    template: "%s | QUANTUM Winter Arc",
  },
  description:
    "An elite futuristic personal transformation platform. Master daily habits, accountability streaks, XP progression, and 90 consecutive days of unwavering discipline.",
  keywords: [
    "Transformation Yourself",
    "transformationyourself.in",
    "Quantum",
    "Quantum Winter Arc",
    "Winter Arc Challenge",
    "Winter Arc 2025",
    "90 Day Transformation",
    "Gamified Habit Tracker",
    "Productivity OS",
    "Self Discipline Protocol",
    "Winter Arc App",
  ],
  authors: [{ name: "Quantum System", url: "https://transformationyourself.in" }],
  creator: "Quantum System",
  publisher: "Quantum System",
  alternates: {
    canonical: "https://transformationyourself.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://transformationyourself.in",
    siteName: "QUANTUM — Transformation Yourself",
    title: "QUANTUM — 90-Day Winter Arc Transformation Operating System",
    description:
      "Lock in for 90 days. Master habits, level up with XP telemetry, compete on the leaderboard, and claim your physical transformation.",
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
      "Lock in for 90 days. Master habits, level up with XP telemetry, and transform yourself.",
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
      "@type": "WebSite",
      "@id": "https://transformationyourself.in/#website",
      "url": "https://transformationyourself.in",
      "name": "QUANTUM — Transformation Yourself",
      "description": "90-Day Winter Arc Transformation Operating System",
      "publisher": {
        "@type": "Organization",
        "name": "QUANTUM System",
        "url": "https://transformationyourself.in",
        "logo": "https://transformationyourself.in/assets/images/logo/logo.png"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://transformationyourself.in/#app",
      "name": "QUANTUM Winter Arc",
      "url": "https://transformationyourself.in",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1"
      }
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchema),
          }}
        />
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
        <ThemeProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
