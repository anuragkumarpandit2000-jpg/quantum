import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Challenger Dashboard | QUANTUM Winter Arc",
  description: "Private habit matrix, streak counter, XP telemetry, and AI coach command center.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
