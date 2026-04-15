import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianFinancialCard({ guardian }: { guardian: any }) {
    const income = guardian?.annualIncome;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">

            {/* HEADER */}
            <div className="border-b border-zinc-100 pb-3 mb-5">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                    Stability Check
                </h3>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-4">

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