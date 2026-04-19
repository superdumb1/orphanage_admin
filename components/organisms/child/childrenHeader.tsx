"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { useUIModals } from "@/hooks/useUIModal";


export function ChildrenHeader() {
    const { openChildModal } = useUIModals()
    return (
        <>
            {/* ✨ Replaced bg-white and border-zinc-200 with bg-card and border-border */}
            <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] shadow-sm border border-border transition-colors duration-500">
                <div className="flex items-center gap-4">

                    {/* ✨ Used your primary color variable with opacity for the icon background! */}
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl border border-primary/20">
                        👧👦
                    </div>

                    <div>
                        {/* ✨ Replaced text-zinc-900 with text-text */}
                        <h1 className="text-2xl font-black text-text tracking-tight">Children in Care</h1>
                        {/* ✨ Replaced text-zinc-500 with text-text-muted */}
                        <p className="text-sm text-text-muted font-medium">Manage admissions, statuses, and profiles.</p>
                    </div>
                </div>

                {/* ✨ Replaced static blue with bg-primary and text-text-invert so it flips perfectly */}
                <Button
                    onClick={()=>openChildModal()}
                    className="bg-primary text-text-invert hover:opacity-90 shadow-glow font-bold py-2.5 px-6 rounded-xl transition-all"
                >
                    + Admit Child
                </Button>
            </div>


        </>
    );
}