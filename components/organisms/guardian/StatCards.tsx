"use client";

import React from "react";

// 1. Replaced hardcoded colors with your semantic theme variants
type Variant = "default" | "primary" | "warning" | "success" | "danger";

const StatCard: React.FC<{ label: string; value: number; variant: Variant }> = ({
    label,
    value,
    variant,
}) => {
    // 2. Map the variants to your CSS variables
    const textColors: Record<Variant, string> = {
        default: "text-text-muted",
        primary: "text-primary",
        warning: "text-warning",
        success: "text-success",
        danger: "text-danger",
    };

    return (
        // 3. Updated Container: bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="p-6 rounded-dashboard border border-border bg-card shadow-glow transition-colors duration-500 flex flex-col justify-center">
            
            {/* 4. Upgraded Typography: Micro-caps aesthetic to match your other panels */}
            <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 ${textColors[variant]}`}>
                {label}
            </p>
            
            {/* 5. Value: text-zinc-900 -> text-text */}
            <p className="text-3xl font-black text-text">
                {value}
            </p>
        </div>
    );
};

const StatCards: React.FC<{ guardians: any[] }> = ({ guardians }) => {
    return (
        // Increased gap to 6 for better breathing room on premium layouts
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <StatCard 
                label="Total Applicants" 
                value={guardians.length} 
                variant="default" 
            />
            
            <StatCard 
                label="Under Vetting" 
                value={guardians.filter(g => g.vettingStatus === "VETTING").length} 
                variant="warning" 
            />
            
            <StatCard 
                label="Approved Families" 
                value={guardians.filter(g => g.vettingStatus === "APPROVED").length} 
                variant="success" 
            />
            
            <StatCard 
                label="Blacklisted" 
                value={guardians.filter(g => g.vettingStatus === "BLACKLISTED").length} 
                variant="danger" 
            />
            
        </div>
    );
};

export default StatCards;