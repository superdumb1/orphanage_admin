"use client";

import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianFinancialCard({ guardian }: { guardian: any }) {
    const income = guardian?.annualIncome;

    return (
        // Container: Updated bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="bg-card p-6 rounded-dashboard shadow-glow border border-border transition-colors duration-500">

            {/* HEADER: Updated border-zinc-100 -> border-border */}
            <div className="border-b border-border pb-3 mb-5">
                {/* Typography: Updated text-zinc-500 -> text-text-muted, added micro-caps styling */}
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Stability Check
                </h3>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-5">

                <InfoRow 
                    label="Occupation" 
                    value={guardian?.occupation || "Not listed"} 
                />

                <InfoRow
                    label="Annual Income"
                    value={
                        typeof income === "number"
                            ? `NPR ${income.toLocaleString()}`
                            : "NPR 0"
                    }
                    isBold
                />
            </div>
        </div>
    );
}