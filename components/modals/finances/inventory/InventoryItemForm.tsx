"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem, updateInventoryItem } from "@/app/actions/inventory";

interface InventoryItemForm {
    item?: any;
    closeModal: () => void;
}

export const InventoryItemForm: React.FC<InventoryItemForm> = ({
    item,
    closeModal,
}) => {
    const action=item?addInventoryItem:updateInventoryItem
    const [state, formAction, isPending] = useActionState(
        action as any,
        { error: null, success: false }
    );

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);

    return (
        <form action={formAction} className="flex flex-col flex-1 min-h-0 w-full">
            
            {/* HIDDEN ID FOR UPDATES */}
            {item?._id && <input type="hidden" name="id" value={item._id} />}

            {/* SCROLLABLE BODY */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6 ">

                {/* SYSTEM ERROR ALERT */}
                {state?.error && (
                    <div className="flex items-center gap-3 text-sm text-danger bg-danger/10 p-4 rounded-xl border border-danger/20 font-bold animate-in slide-in-from-top-2 shrink-0">
                        <span className="text-lg">⚠️</span>
                        <span>{state.error}</span>
                    </div>
                )}

                <FormField
                    id="name"
                    label="Item Name *"
                    name="name"
                    required
                    placeholder="e.g. Basmati Rice, Winter Blankets"
                    className="text-text shrink-0"
                    defaultValue={item?.name || ""}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                    <SelectField
                        id="category"
                        label="Category *"
                        name="category"
                        required
                        className="text-text"
                        defaultValue={item?.category || ""}
                        options={[
                            { label: "Food & Groceries", value: "FOOD" },
                            { label: "Clothing & Bedding", value: "CLOTHING" },
                            { label: "Education Supplies", value: "EDUCATION" },
                            { label: "Medical & Hygiene", value: "MEDICAL" },
                            { label: "Maintenance / Misc", value: "MAINTENANCE" },
                        ]}
                    />

                    <FormField
                        id="unit"
                        label="Unit of Measurement *"
                        name="unit"
                        required
                        placeholder="e.g. kg, liters, units"
                        className="text-text"
                        defaultValue={item?.unit || ""}
                    />
                </div>

                {/* INFO BOX */}
                <div className="bg-shaded p-6 rounded-2xl border border-border transition-colors shrink-0">
                    <FormField
                        id="minimumStockLevel"
                        label="Low Stock Alert Level"
                        name="minimumStockLevel"
                        type="number"
                        placeholder="e.g. 10"
                        className="text-text"
                        defaultValue={item?.minimumStockLevel || ""}
                    />

                    <p className="text-[10px] text-text-muted mt-3 uppercase tracking-[0.1em] font-black opacity-70 border-t border-border/50 pt-3">
                        You will get a visual alert when stock falls below this number.
                    </p>
                </div>
            </div>

            {/* FOOTER */}
            <div className="shrink-0 flex justify-end gap-3.5 p-6 md:px-8 border-t border-border bg-card">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    className="text-text-muted hover:text-text hover:bg-shaded font-bold text-xs uppercase tracking-wider"
                >
                    Abort
                </Button>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="px-8 font-black text-xs uppercase tracking-widest text-text-invert bg-primary hover:bg-primary/90 shadow-glow active:scale-95 transition-all h-11"
                >
                    {isPending ? "PROCESSING..." : (item ? "UPDATE_ITEM" : "REGISTER_ITEM")}
                </Button>
            </div>
        </form>
    );
};