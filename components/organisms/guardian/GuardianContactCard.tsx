import React from "react";
import InfoRow from "./InfoRow";

export default function GuardianContactCard({ guardian }: { guardian: any }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-200">
            <div className="border-b border-zinc-100 pb-4 mb-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                    Contact Details
                </h3>
            </div>
            <div className="flex flex-col gap-4">
                <InfoRow label="Email" value={guardian.email} />
                <InfoRow label="Phone" value={guardian.phone} />
                <InfoRow label="Address" value={guardian.address} />
                <InfoRow label="Applicant Type" value={guardian.type} />
            </div>
        </div>
    );
}