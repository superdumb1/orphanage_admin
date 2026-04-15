import React from "react";

const StatCard: React.FC<{ label: string; value: number; color: "zinc" | "blue" | "emerald" | "red" }> = ({
    label,
    value,
    color,
}) => {
    const colors = {
        zinc: "bg-white border-zinc-200 text-zinc-900",
        blue: "bg-white border-zinc-200 text-zinc-900",
        emerald: "bg-white border-zinc-200 text-zinc-900",
        red: "bg-white border-zinc-200 text-zinc-900",
    };

    const accent = {
        zinc: "text-zinc-500",
        blue: "text-blue-600",
        emerald: "text-emerald-600",
        red: "text-rose-600",
    };

    return (
        <div className={`p-5 rounded-2xl border shadow-sm ${colors[color]}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accent[color]}`}>
                {label}
            </p>
            <p className="text-3xl font-black text-zinc-900">{value}</p>
        </div>
    );
};

const StatCards: React.FC<{ guardians: any[] }> = ({ guardians }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Applicants" value={guardians.length} color="zinc" />
            <StatCard label="Under Vetting" value={guardians.filter(g => g.vettingStatus === "VETTING").length} color="blue" />
            <StatCard label="Approved Families" value={guardians.filter(g => g.vettingStatus === "APPROVED").length} color="emerald" />
            <StatCard label="Blacklisted" value={guardians.filter(g => g.vettingStatus === "BLACKLISTED").length} color="red" />
        </div>
    );
};

export default StatCards;