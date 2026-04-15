"use client";
import React from "react";
import { ChildForm } from "@/components/organisms/child/ChildForm";

export const AddChildModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        /* ✨ Backdrop: Uses bg-bg with opacity for a theme-aware dimming effect */
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/60 backdrop-blur-sm p-4 animate-in fade-in transition-colors duration-500">
            
            {/* ✨ Modal Container: Switched to bg-card and border-border */}
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95">
                
                {/* 📌 Modal Header */}
                {/* ✨ Uses bg-shaded/50 for a subtle distinction from the form body */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-shaded/50 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* ✨ Icon Box: Uses primary/10 tint */}
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg border border-primary/20">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text tracking-tight">
                                Admit New Child
                            </h2>
                            <p className="text-xs text-text-muted font-medium mt-0.5">
                                Create a new record in the orphanage database.
                            </p>
                        </div>
                    </div>
                    
                    {/* ✨ Close Button: Styled with theme tokens */}
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-shaded border border-border hover:bg-danger/10 hover:text-danger hover:border-danger/20 text-text-muted transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* 📌 Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-6 bg-card">
                    {/* ChildForm already uses bg-card inside, so they blend perfectly */}
                    <ChildForm onClose={onClose} />
                </div>

            </div>
        </div>
    );
};