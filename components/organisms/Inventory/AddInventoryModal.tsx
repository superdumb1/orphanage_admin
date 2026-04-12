"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem } from "@/app/actions/inventory";

export const AddInventoryModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [state, formAction, isPending] = useActionState(addInventoryItem as any, { error: null, success: false });

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border border-zinc-200 animate-in zoom-in-95">

                {/* Header (Pinned) */}
                <div className="p-6 md:p-8 border-b border-zinc-100 bg-blue-50/50 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-zinc-900 text-xl tracking-tighter">Add Inventory Item</h2>
                        <p className="text-xs text-zinc-500 font-medium">Register a new physical asset or consumable.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-400 transition-colors">✕</button>
                </div>

                {/* Form Wrapper */}
                <form action={formAction} className="flex flex-col overflow-hidden">
                    
                    {/* Scrollable Content */}
                    <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                        {state?.error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">⚠️ {state.error}</p>}

                        <FormField label="Item Name *" name="name" required placeholder="e.g. Basmati Rice, Winter Blankets" />

                        <div className="grid grid-cols-2 gap-6">
                            <SelectField 
                                label="Category *" 
                                name="category" 
                                required 
                                options={[
                                    { label: 'Food & Groceries', value: 'FOOD' },
                                    { label: 'Clothing & Bedding', value: 'CLOTHING' },
                                    { label: 'Education Supplies', value: 'EDUCATION' },
                                    { label: 'Medical & Hygiene', value: 'MEDICAL' },
                                    { label: 'Maintenance / Misc', value: 'MAINTENANCE' }
                                ]} 
                            />
                            <FormField label="Unit of Measurement *" name="unit" required placeholder="e.g. kg, liters, pairs, units" />
                        </div>

                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                            <FormField 
                                label="Low Stock Alert Level (Minimum)" 
                                name="minimumStockLevel" 
                                type="number" 
                                placeholder="e.g. 10" 
                            />
                            <p className="text-[10px] text-zinc-400 mt-2 italic">You will get a visual alert when stock falls below this number.</p>
                        </div>
                    </div>

                    {/* Footer (Pinned) */}
                    <div className="flex justify-end gap-3 p-6 border-t border-zinc-100 bg-white shrink-0 rounded-b-3xl">
                        <Button type="button" variant="ghost" onClick={onClose} className="px-6 font-bold text-zinc-500">Cancel</Button>
                        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 shadow-lg shadow-blue-200">
                            {isPending ? "Saving..." : "Add to Catalog"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};