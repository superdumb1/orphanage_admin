"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem } from "@/app/actions/inventory";

export const AddInventoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose
}) => {
    const [state, formAction, isPending] = useActionState(addInventoryItem as any, {
        error: null,
        success: false
    });

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200">

                {/* HEADER */}
                <div className="p-6 md:p-8 border-b border-zinc-100 bg-zinc-50 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-xl text-zinc-900 tracking-tight">
                            Add Inventory Item
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Register physical stock or consumables
                        </p>
                    </div>

                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900">
                        ✕
                    </button>
                </div>

                <form action={formAction} className="flex flex-col overflow-hidden">

                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

                        {state?.error && (
                            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 font-bold">
                                ⚠ {state.error}
                            </p>
                        )}

                        <FormField
                            label="Item Name *"
                            name="name"
                            required
                            placeholder="e.g. Rice, Blanket"
                        />

                        <div className="grid grid-cols-2 gap-6">

                            <SelectField
                                label="Category *"
                                name="category"
                                required
                                options={[
                                    { label: "Food & Groceries", value: "FOOD" },
                                    { label: "Clothing & Bedding", value: "CLOTHING" },
                                    { label: "Education Supplies", value: "EDUCATION" },
                                    { label: "Medical & Hygiene", value: "MEDICAL" },
                                    { label: "Maintenance", value: "MAINTENANCE" }
                                ]}
                            />

                            <FormField
                                label="Unit *"
                                name="unit"
                                required
                                placeholder="kg, pcs, liters"
                            />
                        </div>

                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                            <FormField
                                label="Low Stock Alert Level"
                                name="minimumStockLevel"
                                type="number"
                                placeholder="e.g. 10"
                            />
                            <p className="text-[10px] text-zinc-400 mt-2 italic">
                                Alert triggers when stock goes below this level.
                            </p>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-white shrink-0">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-zinc-900 text-white font-bold px-10"
                        >
                            {isPending ? "Saving..." : "Add Item"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};