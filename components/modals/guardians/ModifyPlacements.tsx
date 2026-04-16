"use client";

import React, { useActionState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { updatePlacement, removePlacement } from "@/app/actions/placement"; // You'll need these actions
import { Baby, Trash2, RefreshCcw, ShieldAlert } from "lucide-react";

export const ModifyPlacementsModal = ({
    guardian,
    closeModal
}: {
    guardian: any;
    closeModal: () => void;
}) => {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* ADMINISTRATIVE HEADER */}
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-text tracking-tight">Placement Override</h2>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">
                    Modifying active dependencies for {guardian.primaryName}
                </p>
            </div>

            {/* LIST OF CURRENT ASSIGNMENTS */}
            <div className="flex flex-col gap-4">
                {guardian.assignedChildren?.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed border-border rounded-3xl">
                        <p className="text-xs font-bold text-text-muted">No active records to modify.</p>
                    </div>
                ) : (
                    guardian.assignedChildren.map((child: any) => (
                        <PlacementRow 
                            key={child._id} 
                            child={child} 
                            guardianId={guardian._id} 
                        />
                    ))
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-border/50">
                <button 
                    onClick={closeModal} 
                    className="text-[10px] font-black text-text-muted hover:text-text uppercase tracking-widest transition-all"
                >
                    Close Registry
                </button>
            </div>
        </div>
    );
};

// Sub-component for individual placement management
const PlacementRow = ({ child, guardianId }: { child: any; guardianId: string }) => {
    // 1. Action for updating type (Foster/Adopted)
    const [upState, upAction, isUpdating] = useActionState(updatePlacement as any, { success: false });
    
    // 2. Action for terminating the link
    const [remState, remAction, isRemoving] = useActionState(removePlacement as any, { success: false });

    return (
        <div className="bg-shaded/30 border border-border p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20 transition-all group">
            
            {/* CHILD IDENTITY */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {child.profileImageUrl ? (
                        <img src={child.profileImageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <Baby className="w-6 h-6 text-text-muted/20" />
                    )}
                </div>
                <div>
                    <p className="font-black text-text text-sm">{child.firstName} {child.lastName}</p>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 opacity-70">
                        Current Status: {child.status}
                    </p>
                </div>
            </div>

            {/* MANAGEMENT CONTROLS */}
            <div className="flex items-center gap-3">
                {/* Change Placement Type */}
                <form action={upAction} className="flex items-center gap-2">
                    <input type="hidden" name="guardianId" value={guardianId} />
                    <input type="hidden" name="childId" value={child._id} />
                    <select 
                        name="placementType"
                        defaultValue={child.placementType || "FOSTERED"}
                        className="bg-bg border border-border rounded-xl px-3 py-2 text-[10px] font-black text-text outline-none focus:ring-1 focus:ring-primary/40"
                    >
                        <option value="FOSTERED">FOSTER</option>
                        <option value="ADOPTED">ADOPTED</option>
                        <option value="SPONSORED">SPONSOR</option>
                    </select>
                    <button 
                        disabled={isUpdating}
                        className="p-2.5 rounded-xl bg-bg border border-border text-text-muted hover:text-primary hover:border-primary/40 transition-all disabled:opacity-30"
                    >
                        <RefreshCcw size={14} className={isUpdating ? "animate-spin" : ""} />
                    </button>
                </form>

                <div className="w-[1px] h-8 bg-border/50 mx-1" />

                {/* Terminate Placement */}
                <form action={remAction}>
                    <input type="hidden" name="guardianId" value={guardianId} />
                    <input type="hidden" name="childId" value={child._id} />
                    <button 
                        disabled={isRemoving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-[9px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all disabled:opacity-30"
                    >
                        <Trash2 size={14} />
                        {isRemoving ? "Purging..." : "Terminate"}
                    </button>
                </form>
            </div>
        </div>
    );
};