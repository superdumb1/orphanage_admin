"use client";
import React from "react";
import { GuardianForm } from "./GuardianForm";

export const AddGuardianFormModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                
                {/* 📌 Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg border border-blue-100">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                                Admit New Child
                            </h2>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                Create a new record in the orphanage database.
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
                    <GuardianForm onClose={onClose} />
                </div>

            </div>
        </div>
    );
};