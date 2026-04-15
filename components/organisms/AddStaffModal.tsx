"use client";

import React from "react";
import  StaffForm  from "@/components/organisms/staffs/staffpage/StaffForm";

export const AddStaffModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in">

            {/* MODAL SHELL */}
            <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col relative animate-in zoom-in-95">

                {/* HEADER STRIP (adds structure like your other cards) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                    <div>
                        <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                            Add Employee
                        </h2>
                        <p className="text-xs text-zinc-500 font-medium">
                            Fill staff details, salary & compliance info
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM BODY */}
                <div className="overflow-y-auto p-2">
                    <StaffForm />
                </div>
            </div>
        </div>
    );
};