"use client";
import React from "react";
import { StaffForm } from "@/components/organisms/StaffForm"; // Adjust path if needed

export const AddStaffModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 relative">
                
                {/* 📌 Floating Close Button so it doesn't block the form tabs */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 hover:bg-zinc-300 text-zinc-700 transition-colors"
                >
                    ✕
                </button>

                <div className="overflow-y-auto rounded-[2rem]">
                    <StaffForm onClose={onClose} />
                </div>
            </div>
        </div>
    );
};