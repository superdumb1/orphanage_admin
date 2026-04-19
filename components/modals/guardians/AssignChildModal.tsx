"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { assignChildToGuardian } from "@/app/actions/placement";
import { Search, Baby, Loader2 } from "lucide-react";

export const AssignChildModal = ({
    guardianId,
    closeModal
}: {
    guardianId: string;
    closeModal: () => void;
}) => {
    // --- DATA STATE ---
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChildId, setSelectedChildId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // --- FETCH LOGIC ---
    useEffect(() => {
        const fetchAvailableChildren = async () => {
            try {
                const res = await fetch('/api/children/available');
                const data = await res.json();
                setChildren(data);
            } catch (err) {
                console.error("Registry Link Fault:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableChildren();
    }, []);

    const [state, formAction, isPending] = useActionState(
        assignChildToGuardian as any,
        { error: null, success: false }
    );

    const filteredChildren = children.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* INSTRUCTIONAL HEADER */}
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-text tracking-tight">Placement Protocol</h2>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">
                    Assigning Dependent to Guardian ID: {guardianId}
                </p>
            </div>

            {/* SEARCH TRAY */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-30 group-focus-within:text-primary transition-all" size={18} />
                <input
                    type="text"
                    placeholder="Search Care Registry..."
                    className="w-full pl-12 pr-4 py-4 text-sm border border-border rounded-2xl bg-bg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* SELECTION LIST / LOADING STATE */}
            <div className="max-h-[300px] min-h-[200px] overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50 py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Querying Registry...</p>
                    </div>
                ) : filteredChildren.length === 0 ? (
                    <div className="py-10 text-center border-2 border-dashed border-border/50 rounded-2xl">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No candidates found</p>
                    </div>
                ) : (
                    filteredChildren.map((child) => (
                        <div
                            key={child._id}
                            onClick={() => setSelectedChildId(child._id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                                selectedChildId === child._id
                                    ? "border-primary bg-primary/5 shadow-glow"
                                    : "border-border bg-shaded/30 hover:border-border/60"
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center overflow-hidden shrink-0">
                                {child.profileImageUrl ? (
                                    <img src={child.profileImageUrl} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <Baby className="w-6 h-6 text-text-muted/30" />
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="font-black text-text text-sm">
                                    {child.firstName} {child.lastName}
                                </p>
                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">
                                    Status: <span className="text-success">{child.status}</span>
                                </p>
                            </div>

                            {selectedChildId === child._id && (
                                <div className="w-6 h-6 rounded-full bg-primary text-text-invert flex items-center justify-center text-[10px] shadow-glow animate-in zoom-in-50">
                                    ✓
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* PLACEMENT PARAMETERS */}
            <form action={formAction} className="pt-6 border-t border-border/50 flex flex-col gap-6">
                <input type="hidden" name="guardianId" value={guardianId} />
                <input type="hidden" name="childId" value={selectedChildId} />

                <div>
                    <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.3em] mb-3 block">
                        Assignment Type
                    </label>
                    <select
                        name="placementType"
                        required
                        className="w-full p-4 text-xs font-bold border border-border rounded-2xl bg-bg text-text outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="FOSTERED">Foster Care (Temporary)</option>
                        <option value="ADOPTED">Adoption (Permanent)</option>
                        <option value="SPONSORED">Direct Sponsorship</option>
                    </select>
                </div>

                {state?.error && (
                    <div className="p-4 bg-danger/10 text-danger border border-danger/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        ⚠ Fault: {state.error}
                    </div>
                )}

                <div className="flex justify-end items-center gap-6 pt-2">
                    <button type="button" onClick={closeModal} className="text-[10px] font-black text-text-muted hover:text-text uppercase tracking-widest">
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        disabled={isPending || !selectedChildId || loading}
                        className="btn-primary px-12 h-12"
                    >
                        {isPending ? "Finalizing..." : "SAVE "}
                    </Button>
                </div>
            </form>
        </div>
    );
};