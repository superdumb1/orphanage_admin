import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianFinancialCard({ guardian }: { guardian: any }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-200">
            <div className="border-b border-zinc-100 pb-4 mb-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    Stability Check
                </h3>
            </div>
            <div className="flex flex-col gap-4">
                <InfoRow label="Occupation" value={guardian.occupation || "Not listed"} />
                <InfoRow 
                    label="Annual Income" 
                    value={`NPR ${guardian.annualIncome?.toLocaleString() || 0}`} 
                    isBold 
                />
            </div>
        </div>
    );
}