"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem } from "@/app/actions/inventory";

export const AddInventoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const [state, formAction, isPending] = useActionState(
        addInventoryItem as any,
        { error: null, success: false }
    );

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        // OVERLAY: Updated bg-zinc-900/60 -> bg-bg-invert/20
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-invert/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
            
            {/* SHELL: Updated bg-white -> bg-card, border-zinc-200 -> border-border, rounded-3xl -> rounded-dashboard */}
            <div className="bg-card rounded-dashboard shadow-glow w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-border animate-in zoom-in-95 transition-colors duration-500">

                {/* HEADER: Updated theme.header -> bg-success/10, border-zinc-100 -> border-border */}
                <div className="p-6 md:p-8 border-b border-border bg-success/10 shrink-0 flex justify-between items-center transition-colors">
                    <div>
                        {/* Typography: text-zinc-900 -> text-text */}
                        <h2 className="font-black text-text text-xl md:text-2xl tracking-tighter">
                            Add Inventory Item
                        </h2>
                        {/* Subtitle: text-zinc-500 -> text-text-muted */}
                        <p className="text-sm text-text-muted font-medium mt-0.5">
                            Register a new physical asset or consumable.
                        </p>
                    </div>

                    {/* Close Button: Upgraded interaction target */}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-transparent hover:border-border hover:bg-card text-text-muted hover:text-text transition-all active:scale-95"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                        {/* ERROR: text-red-600 -> text-danger, bg-red-50 -> bg-danger/10 */}
                        {state?.error && (
                            <p className="text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold transition-colors">
                                ⚠️ {state.error}
                            </p>
                        )}

                        <FormField
                            label="Item Name *"
                            name="name"
                            required
                            placeholder="e.g. Basmati Rice, Winter Blankets"
                            className="text-text"
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <SelectField
                                label="Category *"
                                name="category"
                                required
                                className="text-text"
                                options={[
                                    { label: "Food & Groceries", value: "FOOD" },
                                    { label: "Clothing & Bedding", value: "CLOTHING" },
                                    { label: "Education Supplies", value: "EDUCATION" },
                                    { label: "Medical & Hygiene", value: "MEDICAL" },
                                    { label: "Maintenance / Misc", value: "MAINTENANCE" },
                                ]}
                            />

                            <FormField
                                label="Unit of Measurement *"
                                name="unit"
                                required
                                placeholder="e.g. kg, liters, units"
                                className="text-text"
                            />
                        </div>

                        {/* INFO BOX: bg-zinc-50 -> bg-shaded, border-zinc-100 -> border-border */}
                        <div className="bg-shaded p-6 rounded-2xl border border-border transition-colors">
                            <FormField
                                label="Low Stock Alert Level"
                                name="minimumStockLevel"
                                type="number"
                                placeholder="e.g. 10"
                                className="text-text"
                            />

                            {/* Typography: Upgraded hint to Micro-caps aesthetic */}
                            <p className="text-[10px] text-text-muted mt-2 uppercase tracking-[0.1em] font-black opacity-70">
                                You will get a visual alert when stock falls below this number.
                            </p>
                        </div>
                    </div>

                    {/* FOOTER: bg-white -> bg-card, border-zinc-100 -> border-border */}
                    <div className="flex justify-end gap-3 p-6 md:px-8 border-t border-border bg-card shrink-0 transition-colors">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="px-6 font-bold text-text-muted hover:text-text hover:bg-shaded transition-colors"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            // Button: theme.button -> bg-success, matching your inventory theme
                            className="bg-success hover:bg-success/90 text-text-invert font-black px-12 h-11 shadow-glow active:scale-95 transition-all"
                        >
                            {isPending ? "Saving..." : "Add Item"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};