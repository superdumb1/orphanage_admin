"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddChildModal } from "./AddChildModal"; // ✨ Import the new modal!

export function ChildrenHeader() {
    // 1. Manage the modal state safely
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-zinc-200">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl border border-blue-100">
                        👧👦
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Children in Care</h1>
                        <p className="text-sm text-zinc-500 font-medium">Manage admissions, statuses, and profiles.</p>
                    </div>
                </div>
                
                {/* 2. Trigger the modal instead of routing away */}
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                >
                    + Admit Child
                </Button>
            </div>

            {/* 3. Drop the modal at the bottom */}
            <AddChildModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />
        </>
    );
}