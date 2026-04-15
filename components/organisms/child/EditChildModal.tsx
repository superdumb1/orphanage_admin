"use client";
import React from "react";
import { ChildForm } from "@/components/organisms/child/ChildForm";

interface EditChildModalProps {
    onClose: () => void;
    child: any; // The fully sanitized child object
}

export const EditChildModal: React.FC<EditChildModalProps> = ({ onClose, child }) => {
    // Standard early return if no child is selected
    if (!child) return null;

    return (
        /* ✨ Backdrop: Theme-aware using bg-bg/60 */
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/60 backdrop-blur-sm p-4 animate-in fade-in transition-colors duration-500">
            
            {/* ✨ Modal Container: Card background and semantic borders */}
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95">
                
                {/* 📌 Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-shaded/50 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* ✨ Icon Box: Using warning/10 (Amber) for "Edit" context */}
                        <div className="w-10 h-10 bg-warning/10 text-warning rounded-xl flex items-center justify-center text-lg border border-warning/20">
                            ✏️
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text tracking-tight">
                                Edit Record: {child.firstName} {child.lastName}
                            </h2>
                            <p className="text-xs text-text-muted font-medium mt-0.5">
                                Update personal, medical, or administrative details.
                            </p>
                        </div>
                    </div>
                    
                    {/* ✨ Close Button: Shaded background with hover danger state */}
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-shaded border border-border hover:bg-danger/10 hover:text-danger hover:border-danger/20 text-text-muted transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* 📌 Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-6 bg-card">
                    {/* initialData populated for editing mode */}
                    <ChildForm initialData={child} onClose={onClose} />
                </div>

            </div>
        </div>
    );
};