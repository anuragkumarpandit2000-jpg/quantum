import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About & System Specification | QUANTUM Winter Arc",
  description:
    "Explore the complete 15-pillar specification of QUANTUM: 90-day habit matrix, XP engine, skill decomposition, and verified transformation architecture.",
  alternates: {
    canonical: "https://www.transformationyourself.in/about",
  },
  openGraph: {
    title: "About QUANTUM — 90-Day Winter Arc Transformation Specification",
    description:
      "Explore the 15 core pillars of Quantum: 90-day habit matrix, verified XP progression, and daily accountability.",
    url: "https://www.transformationyourself.in/about",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/assets/images/background.png",
        width: 1200,
        height: 630,
        alt: "QUANTUM System Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About QUANTUM — 90-Day System Specification",
    description: "Explore the 15 core pillars of the 90-day habit transformation system.",
    images: ["/assets/images/background.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
