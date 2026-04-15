import Link from "next/link";
import React from "react";

export default function GuardianProfileHeader({
    guardian,
    id
}: {
    guardian: any;
    id: string;
}) {

    const statusStyles: Record<string, string> = {
        APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
        VETTING: "bg-amber-50 text-amber-700 border-amber-100",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
        BLACKLISTED: "bg-rose-50 text-rose-700 border-rose-100",
    };

    const statusClass =
        statusStyles[guardian?.vettingStatus] ||
        "bg-zinc-100 text-zinc-600 border-zinc-200";

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">

            {/* LEFT */}
            <div className="flex items-center gap-6">

                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center text-4xl shrink-0">
                    {guardian?.profileImageUrl ? (
                        <img
                            src={guardian.profileImageUrl}
                            alt={guardian.primaryName || "Guardian"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        "👤"
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">

                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                            {guardian?.primaryName || "Unnamed Guardian"}
                        </h1>

                        <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-lg border ${statusClass}`}>
                            {guardian?.vettingStatus || "UNKNOWN"}
                        </span>
                    </div>

                    <p className="text-zinc-500 font-medium">
                        {guardian?.type || "—"} •{" "}
                        {guardian?.secondaryName
                            ? `Partner: ${guardian.secondaryName}`
                            : "Single Applicant"}
                    </p>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
                <Link
                    href={`/guardians/${id}/edit`}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-sm"
                >
                    ✏️ Edit Profile
                </Link>
            </div>
        </div>
    );
}