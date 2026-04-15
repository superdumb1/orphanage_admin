"use client";

import React from "react";

export default function VettingBadge({ status }: { status: string }) {
  // Mapping statuses to your semantic theme tokens
  const styles: Record<string, string> = {
    // bg-zinc-100 -> bg-shaded, text-zinc-700 -> text-text-muted
    INQUIRY: "bg-shaded text-text-muted border-border",

    // bg-amber-50 -> bg-warning/10, text-amber-700 -> text-warning
    VETTING: "bg-warning/10 text-warning border-warning/20",

    // bg-emerald-50 -> bg-success/10, text-emerald-700 -> text-success
    APPROVED: "bg-success/10 text-success border-success/20",

    // bg-rose-50 -> bg-danger/10, text-rose-700 -> text-danger
    REJECTED: "bg-danger/10 text-danger border-danger/20",

    // Blacklisted uses a heavier danger tint for emphasis
    BLACKLISTED: "bg-danger/20 text-danger border-danger/40",
  };

  const normalized = status?.toUpperCase?.() || "INQUIRY";
  const style = styles[normalized] || styles.INQUIRY;

  return (
    <span
      className={`
        text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-[0.1em]
        transition-colors duration-300 inline-flex items-center justify-center
        ${style}
      `}
    >
      {normalized.replace("_", " ")}
    </span>
  );
}