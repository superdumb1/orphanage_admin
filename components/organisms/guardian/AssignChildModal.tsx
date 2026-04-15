"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { assignChildToGuardian } from "@/app/actions/placement";

interface ChildOption {
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    dateOfBirth: Date;
}

export const AssignChildModal = ({
    isOpen,
    onClose,
    guardianId,
    children
}: {
    isOpen: boolean;
    onClose: () => void;
    guardianId: string;
    children: ChildOption[];
}) => {
    const [selectedChildId, setSelectedChildId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [state, formAction, isPending] = useActionState(
        assignChildToGuardian as any,
        { error: null, success: false }
    );

    const filteredChildren = children.filter(c =>
        `${c.firstName} ${c.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        // OVERLAY: Replaced zinc-900/60 with a themed variant of bg-invert with opacity
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-invert/20 backdrop-blur-sm p-4 animate-in fade-in">

            {/* MODAL SHELL: Updated bg-white -> bg-card, border-zinc-200 -> border-border */}
            <div className="bg-card rounded-dashboard shadow-glow w-full max-w-lg overflow-hidden border border-border flex flex-col max-h-[90vh] transition-colors duration-500 animate-in zoom-in-95">

                {/* HEADER: Updated bg-zinc-50 -> bg-shaded, border-zinc-200 -> border-border */}
                <div className="p-6 md:p-8 border-b border-border bg-shaded flex justify-between items-center transition-colors">
                    <div>
                        {/* Typography: Updated text-zinc-900 -> text-text, text-zinc-500 -> text-text-muted */}
                        <h2 className="font-black text-text tracking-tight text-xl md:text-2xl">
                            Confirm Placement
                        </h2>
                        <p className="text-sm text-text-muted mt-1 font-medium">
                            Select a child to assign to this guardian.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-shaded text-text-muted hover:text-text transition-all active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* SEARCH: bg-white -> bg-card */}
                <div className="p-4 md:p-6 border-b border-border bg-card transition-colors">
                    <input
                        type="text"
                        placeholder="Search child..."
                        // Form Input: focus:ring-zinc-900 -> focus:ring-primary, focus:border-zinc-900 -> focus:border-primary
                        className="w-full p-3.5 text-sm border border-border rounded-xl bg-bg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* LIST: bg-zinc-50 -> bg-shaded */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-shaded flex flex-col gap-3 transition-colors custom-scrollbar">

                    {filteredChildren.map((child) => (
                        <div
                            key={child._id}
                            onClick={() => setSelectedChildId(child._id)}
                            // List Item: border-zinc-900 -> border-primary, shadow and border change on hover/selection
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedChildId === child._id
                                    ? "border-primary bg-card shadow-sm"
                                    : "border-border bg-card hover:border-border/60"
                            }`}
                        >
                            <img
                                src={child.profileImageUrl || "/placeholder.png"}
                                className="w-12 h-12 rounded-full object-cover border border-border"
                                alt={`${child.firstName} ${child.lastName}`}
                            />

                            <div className="flex-1">
                                {/* Name: text-zinc-900 -> text-text */}
                                <p className="font-bold text-text text-sm">
                                    {child.firstName} {child.lastName}
                                </p>
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5">
                                    DOB: {new Date(child.dateOfBirth).toLocaleDateString()}
                                </p>
                            </div>

                            {selectedChildId === child._id && (
                                // Checkmark: bg-zinc-900 -> bg-primary, text-white -> text-invert
                                <div className="w-6 h-6 rounded-full bg-primary text-text-invert flex items-center justify-center text-xs shadow-sm">
                                    ✓
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                {/* FOOTER FORM: bg-white -> bg-card, border-zinc-100 -> border-border */}
                <form action={formAction} className="p-6 md:p-8 border-t border-border bg-card transition-colors">

                    <input type="hidden" name="guardianId" value={guardianId} />
                    <input type="hidden" name="childId" value={selectedChildId} />

                    <div className="mb-6">
                        {/* Label: text-zinc-400 -> text-text-muted */}
                        <label className="text-[10px] uppercase font-black text-text-muted tracking-widest">
                            Placement Type
                        </label>

                        <select
                            name="placementType"
                            required
                            className="mt-2.5 w-full p-3.5 text-sm border border-border rounded-xl bg-bg outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text"
                        >
                            <option value="FOSTERED">Fostering (Temporary)</option>
                            <option value="ADOPTED">Adoption (Permanent)</option>
                        </select>
                    </div>

                    {/* ERROR: text-rose-600 -> text-danger, bg-rose-50 -> bg-danger/10 */}
                    {state?.error && (
                        <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 mb-6 font-bold transition-colors">
                            ⚠ {state.error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3.5">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-text-muted hover:bg-shaded">
                            Cancel
                        </Button>

                        {/* Submit Button: btn-primary utility, removed manual classes */}
                        <Button
                            type="submit"
                            disabled={isPending || !selectedChildId}
                            className="btn-primary w-full sm:w-auto px-10"
                        >
                            {isPending ? "Processing..." : "Finalize Placement"}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
};