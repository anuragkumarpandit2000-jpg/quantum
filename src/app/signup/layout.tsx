import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Start Day 1 | QUANTUM Winter Arc",
  description: "Begin your 90-day Winter Arc habit and discipline transformation on QUANTUM.",
  alternates: {
    canonical: "https://www.transformationyourself.in/signup",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
