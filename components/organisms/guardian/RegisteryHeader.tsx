"use client";

import React, { useState } from "react";
import { AddGuardianFormModal } from "./AddGuardianFormModal";
import { Button } from "@/components/atoms/Button";

export default function RegistryHeader() {
    const [viewGuardianModal, setViewGuardianModal] = useState(false);

    return (
        <>
            {/* MODAL */}
            <AddGuardianFormModal
                isOpen={viewGuardianModal}
                onClose={() => setViewGuardianModal(false)}
            />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-zinc-50 text-zinc-700 rounded-2xl flex items-center justify-center text-2xl border border-zinc-200 shrink-0">
                        🤝
                    </div>

                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                            Guardian Registry
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium">
                            Manage vetting, background checks, and placements.
                        </p>
                    </div>
                </div>

                {/* ACTION */}
                <Button
                    onClick={() => setViewGuardianModal(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
                >
                    + Register Family
                </Button>
            </div>
        </>
    );
}