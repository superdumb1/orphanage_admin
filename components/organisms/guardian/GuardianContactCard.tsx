import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianContactCard({ guardian }: { guardian: any }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">

            {/* HEADER */}
            <div className="border-b border-zinc-100 pb-3 mb-5">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                    Contact Details
                </h3>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-4">

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