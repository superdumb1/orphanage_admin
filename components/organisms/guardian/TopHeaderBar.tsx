"use client";

import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import React from "react";
import VettingStatusBadge from "./VettingStatusBadge";

const TopHeaderBar = ({ guardian, id }: { guardian: any; id: string }) => {
    return (
        // Container: Updated bg-white -> bg-card, border-zinc-200 -> border-border
        <div className="bg-card p-6 rounded-dashboard shadow-glow border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-500">

            {/* LEFT */}
            <div className="flex items-center gap-4">

                <Link href="/guardians">
                    <Button
                        variant="ghost"
                        // Updated text-zinc-600 -> text-text-muted, hover:bg-zinc-50 -> hover:bg-shaded
                        className="px-3 py-2 text-text-muted hover:text-text hover:bg-shaded rounded-xl transition-all"
                    >
                        ← Back
                    </Button>
                </Link>

                <div>
                    {/* Updated text-zinc-900 -> text-text */}
                    <h1 className="text-2xl font-black text-text tracking-tight">
                        {guardian?.primaryName || "Guardian"}
                    </h1>

                    {/* Updated text-zinc-500 -> text-text-muted */}
                    <p className="text-xs text-text-muted font-medium mt-0.5">
                        Member since{" "}
                        {guardian?.createdAt
                            ? new Date(guardian.createdAt).toLocaleDateString()
                            : "—"}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 w-full md:w-auto">

                {/* Your already-themed badge component */}
                <VettingStatusBadge status={guardian?.vettingStatus} />

                <Link href={`/guardians/${id}/edit`}>
                    <Button
                        variant="secondary"
                        // Updated text/border/hover classes to use theme tokens
                        className="px-5 py-2.5 rounded-xl border border-border text-text font-bold hover:bg-shaded transition-all"
                    >
                        Edit Profile
                    </Button>
                </Link>

            </div>
        </div>
    );
};

export default TopHeaderBar;