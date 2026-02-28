"use client";

import Navbar from "@/components/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="ambient-glow" />
      <main className="pt-16 min-h-screen cyber-grid">{children}</main>
    </>
  );
}
