import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify Email | QUANTUM Winter Arc",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
