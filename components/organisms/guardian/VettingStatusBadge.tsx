"use client";

import React from "react";

export default function VettingStatusBadge({ status }: { status: string }) {
    // Maps your business logic to your CSS theme tokens
    const styles: Record<string, string> = {
        // bg-zinc-100 -> bg-shaded, text-zinc-700 -> text-text-muted
        INQUIRY: "bg-shaded text-text-muted border-border",
        
        // bg-amber-50 -> bg-warning/10, text-amber-700 -> text-warning
        VETTING: "bg-warning/10 text-warning border-warning/20",
        
        // bg-emerald-50 -> bg-success/10, text-emerald-700 -> text-success
        APPROVED: "bg-success/10 text-success border-success/20",
        
        // bg-rose-50 -> bg-danger/10, text-rose-700 -> text-danger
        REJECTED: "bg-danger/10 text-danger border-danger/20",
        
        // Darker variant for Blacklisted using higher opacity
        BLACKLISTED: "bg-danger/20 text-danger border-danger/40",
    };

    const normalized = status?.toUpperCase?.() || "INQUIRY";
    const style = styles[normalized] || styles.INQUIRY;

    return (
        <span
            className={`
                px-4 py-1.5 rounded-full border
                text-[10px] font-black uppercase tracking-[0.15em]
                transition-all duration-300
                ${style}
            `}
        >
            {normalized.replace("_", " ")}
        </span>
    );
}