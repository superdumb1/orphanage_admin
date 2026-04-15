"use client";
import React from "react";
import { GuardianForm } from "./GuardianForm";

export const AddGuardianFormModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    if (!isOpen) return null;

    return (
        // OVERLAY: Updated bg-zinc-900/60 to bg-bg-invert/20 for dynamic light/dark tinting
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in">

            {/* MODAL SHELL: Updated bg-white -> bg-card, rounded-3xl -> rounded-dashboard */}
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-dashboard shadow-glow flex flex-col overflow-hidden animate-in zoom-in-95 border border-border transition-colors duration-500">

                {/* HEADER: Updated bg-zinc-50 -> bg-shaded/50, border-zinc-200 -> border-border */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-shaded/50 shrink-0">

                    <div className="flex items-center gap-4">

                        {/* ICON: Updated bg-zinc-100 -> bg-shaded, sized up to w-12 for premium feel */}
                        <div className="w-12 h-12 bg-shaded text-text-muted rounded-2xl flex items-center justify-center text-xl border border-border shadow-inner shrink-0">
                            ✨
                        </div>

                        <div>
                            {/* Typography: Updated text-zinc-900 -> text-text */}
                            <h2 className="text-xl font-black text-text tracking-tight">
                                Register Guardian
                            </h2>
                            <p className="text-xs text-text-muted font-medium mt-0.5">
                                Create a new guardian or foster family record.
                            </p>
                        </div>
                    </div>

                    {/* CLOSE BUTTON: Upgraded to match your other themed modals */}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-shaded text-text-muted hover:text-text transition-all active:scale-95 shrink-0"
                    >
                        <span className="text-lg">✕</span>
                    </button>
                </div>

                {/* BODY: Swapped bg-white for bg-bg to provide slight contrast against the form */}
                <div className="overflow-y-auto p-0 sm:p-6 bg-bg custom-scrollbar flex-1">
                    {/* The GuardianForm component handles its own padding and bg-card styling! */}
                    <GuardianForm onClose={onClose} />
                </div>

            </div>
        </div>
    );
};