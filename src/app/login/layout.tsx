import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Challenger Login | QUANTUM Winter Arc",
  description: "Sign in to access your daily habit matrix, streak logs, and XP progression on QUANTUM.",
  alternates: {
    canonical: "https://www.transformationyourself.in/login",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
