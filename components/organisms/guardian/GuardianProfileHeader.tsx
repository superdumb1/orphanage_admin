"use client";

import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import React from "react";
import { useUIModals } from "@/hooks/useUIModal";

export default function GuardianProfileHeader({
    guardian,
    id
}: {
    guardian: any;
    id: string;
}) {
    const {openGuardianModal}=useUIModals()

    // Mapped statuses to your semantic theme tokens with opacity modifiers
    const statusStyles: Record<string, string> = {
        APPROVED: "bg-success/10 text-success border-success/20",
        VETTING: "bg-warning/10 text-warning border-warning/20",
        REJECTED: "bg-danger/10 text-danger border-danger/20",
        BLACKLISTED: "bg-danger/20 text-danger border-danger/40",
    };

    const statusClass =
        statusStyles[guardian?.vettingStatus] ||
        "bg-shaded text-text-muted border-border";

    return (
        // Container: bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card p-6 rounded-dashboard border border-border shadow-glow gap-4 transition-colors duration-500">

            {/* LEFT */}
            <div className="flex items-center gap-6">

                {/* Avatar: bg-zinc-50 -> bg-shaded, border-zinc-200 -> border-border */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border bg-shaded shadow-inner flex items-center justify-center text-4xl shrink-0">
                    {guardian?.profileImageUrl ? (
                        <img
                            src={guardian.profileImageUrl}
                            alt={guardian.primaryName || "Guardian"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="opacity-50 grayscale">👤</span>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-4 mb-1 flex-wrap">

                        {/* Title: text-zinc-900 -> text-text */}
                        <h1 className="text-3xl font-black text-text tracking-tight">
                            {guardian?.primaryName || "Unnamed Guardian"}
                        </h1>

                        {/* Status Badge: Now using matched VettingBadge styles */}
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] rounded-full border transition-colors ${statusClass}`}>
                            {guardian?.vettingStatus || "INQUIRY"}
                        </span>
                    </div>

                    {/* Subtitle: text-zinc-500 -> text-text-muted */}
                    <p className="text-sm text-text-muted font-medium mt-1">
                        {guardian?.type || "—"} •{" "}
                        {guardian?.secondaryName
                            ? `Partner: ${guardian.secondaryName}`
                            : "Single Applicant"}
                    </p>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
                {/* Button Link: Styled to match your ghost/secondary buttons */}
                <Button
                    onClick={()=>openGuardianModal(guardian)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-text border border-border hover:bg-shaded transition-all flex items-center gap-2 active:scale-95"
                >
                    ✏️ Edit Profile
                </Button>
            </div>
        </div>
    );
}