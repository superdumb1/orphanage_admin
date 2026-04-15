"use client";

import React from "react";
import StaffForm from "@/components/organisms/staffs/staffpage/StaffForm";

export const AddStaffModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    // Updated overlay: bg-zinc-900/40 -> bg-black/60 (or use a themed token)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in">

      {/* MODAL SHELL: Updated bg-white -> bg-card, border-zinc-200 -> border-border */}
      <div className="w-full max-w-5xl max-h-[90vh] bg-card rounded-dashboard shadow-glow border border-border overflow-hidden flex flex-col relative animate-in zoom-in-95 transition-colors duration-500">

        {/* HEADER STRIP: Updated bg-zinc-50 -> bg-shaded, border-zinc-100 -> border-border */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-shaded/50">
          <div>
            <h2 className="text-xl font-black text-text tracking-tight">
              Add Employee
            </h2>
            <p className="text-xs text-text-muted font-medium mt-0.5">
              Fill staff details, salary & compliance info
            </p>
          </div>

          <button
            onClick={onClose}
            // Updated button styles to match your theme
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-shaded text-text-muted hover:text-text transition-all active:scale-95"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* FORM BODY */}
        <div className="overflow-y-auto p-4 custom-scrollbar">
          <StaffForm />
        </div>
      </div>
    </div>
  );
};