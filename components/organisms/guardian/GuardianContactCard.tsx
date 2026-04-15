"use client";

import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianContactCard({ guardian }: { guardian: any }) {
    return (
        // Container: Updated bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="bg-card p-6 rounded-dashboard shadow-glow border border-border transition-colors duration-500">

            {/* HEADER: Updated border-zinc-100 -> border-border */}
            <div className="border-b border-border pb-3 mb-5">
                {/* Typography: Updated text-zinc-500 -> text-text-muted, added micro-caps styling */}
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Contact Details
                </h3>
            </div>

            {/* CONTENT: Increased gap to 5 for better vertical breathing room */}
            <div className="flex flex-col gap-5">

                <InfoRow 
                    label="Email" 
                    value={guardian?.email || "—"} 
                />

                <InfoRow 
                    label="Phone" 
                    value={guardian?.phone || "—"} 
                />

                <InfoRow 
                    label="Address" 
                    value={guardian?.address || "—"} 
                />

                <InfoRow 
                    label="Applicant Type" 
                    value={
                        guardian?.type
                            ? guardian.type.charAt(0) + guardian.type.slice(1).toLowerCase()
                            : "—"
                    } 
                />
            </div>
        </div>
    );
}