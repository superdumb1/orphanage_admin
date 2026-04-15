"use client";
import React from "react";
import { ChildForm } from "@/components/organisms/child/ChildForm";

interface EditChildModalProps {
    onClose: () => void;
    child: any; // The fully sanitized child object
}

export const EditChildModal: React.FC<EditChildModalProps> = ({ onClose, child }) => {
    if ( !child) return null;

    

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg border border-amber-100">
                            ✏️
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                                Edit Record: {child.firstName} {child.lastName}
                            </h2>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                Update personal, medical, or administrative details.
                            </p>
                        </div>
                    </div>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* 📌 Modal Body (Scrollable) */}
                <div className="overflow-y-auto p-6 bg-zinc-50/30">
                    <ChildForm initialData={child} onClose={onClose} />
                </div>

            </div>
        </div>
    );
};