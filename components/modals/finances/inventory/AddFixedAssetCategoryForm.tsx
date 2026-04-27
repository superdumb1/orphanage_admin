"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { saveInventoryCategory } from "@/app/actions/inventoryCategory";
import { Archive, ShieldAlert } from "lucide-react";

export const AddAssetCategoryModal = ({ closeModal, onSaved }: any) => {
    // ✨ Match the full ActionState interface to prevent the 'No overload' error
    const [state, formAction, isPending] = useActionState(saveInventoryCategory, {
        success: false,
        error: null,
        data: null
    });

    useEffect(() => {
        if (state?.success && state.data) {
            if (onSaved && typeof onSaved === 'function') {
                onSaved(state.data);
            }
            closeModal();
        }
    }, [state, closeModal, onSaved]);

    return (
        <form action={formAction} className="flex flex-col gap-6 w-full p-1 animate-in fade-in duration-300">
            {/* HIDDEN TYPE DISCRIMINATOR */}
            <input type="hidden" name="type" value="ASSET" />

            <header className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                    <Archive size={18} />
                </div>
                <div>
                    <h2 className="text-[10px] font-black text-secondary uppercase tracking-widest">Asset Registry</h2>
                    <p className="text-[9px] text-text-muted uppercase font-bold">New infrastructure class</p>
                </div>
            </header>

            <FormField
                label="Category Name *"
                name="name"
                required
                placeholder="e.g. Lab Equipment, Dorm Furniture, Electronics"
                autoFocus
            />

            {state?.error && (
                <div className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/20 rounded-xl text-danger text-[10px] font-bold uppercase tracking-tight">
                    <ShieldAlert size={12} /> {state.error}
                </div>
            )}

            <div className="flex justify-end gap-5 mt-2 border-t border-border pt-5">
                <button
                    type="button"
                    onClick={closeModal}
                    className="text-[10px] font-black uppercase text-text-muted hover:text-text transition-colors"
                >
                    Discard
                </button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-secondary px-10 h-10 font-black text-[10px] tracking-widest text-text-invert rounded-xl shadow-glow-secondary active:scale-95 transition-transform"
                >
                    {isPending ? "REGISTERING..." : "SAVE_ASSET_CLASS"}
                </Button>
            </div>
        </form>
    );
};