import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/components/audio/audio-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "QUANTUM — 90-Day Winter Arc Transformation Operating System",
  description:
    "An elite futuristic personal transformation platform. Master habits, skills, XP progression, and 90 consecutive days of unwavering focus.",
  keywords: [
    "Quantum",
    "Winter Arc",
    "90 Day Challenge",
    "Habit Tracker",
    "Productivity OS",
    "Self Discipline",
  ],
  icons: {
    icon: "/assets/images/logo/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
        <ThemeProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
