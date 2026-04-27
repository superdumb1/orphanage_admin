"use client";
import React, { useActionState, useEffect, useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem, updateInventoryItem } from "@/app/actions/inventory";
import { Box, Archive, ClipboardList } from "lucide-react";

interface InventoryItemFormProps {
    item?: any;
    closeModal: () => void;
}

export const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
    item,
    closeModal,
}) => {
    const action = item ? updateInventoryItem : addInventoryItem;
    
    // ✨ TRACK TYPE: Asset vs Consumable
    const [itemType, setItemType] = useState<"CONSUMABLE" | "ASSET">(item?.type || "CONSUMABLE");

    const [state, formAction, isPending] = useActionState(
        action as any,
        { error: null, success: false }
    );

    useEffect(() => {
        if (state?.success) closeModal();
    }, [state?.success, closeModal]);

    return (
        <form action={formAction} className="flex flex-col flex-1 min-h-0 w-full animate-in fade-in duration-300">
            {item?._id && <input type="hidden" name="id" value={item._id} />}
            <input type="hidden" name="type" value={itemType} />

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6 p-1">

                {state?.error && <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-xs font-bold rounded-xl">⚠️ {state.error}</div>}

                {/* TYPE TOGGLE */}
                <div className="flex bg-shaded p-1 rounded-xl border border-border">
                    <button
                        type="button"
                        onClick={() => setItemType("CONSUMABLE")}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === "CONSUMABLE" ? "bg-card text-primary shadow-sm border border-border/50" : "text-text-muted"}`}
                    >
                        <Box size={14} /> Consumables (Food/Soap)
                    </button>
                    <button
                        type="button"
                        onClick={() => setItemType("ASSET")}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === "ASSET" ? "bg-card text-primary shadow-sm border border-border/50" : "text-text-muted"}`}
                    >
                        <Archive size={14} /> Fixed Assets (Desks/Books)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Item Name *"
                        name="name"
                        required
                        placeholder={itemType === "ASSET" ? "e.g. Study Table" : "e.g. Sona Mansuli Rice"}
                        defaultValue={item?.name || ""}
                    />
                    <SelectField
                        label="Category *"
                        name="category"
                        required
                        defaultValue={item?.category || ""}
                        options={[
                            { label: "Food & Kitchen", value: "FOOD" },
                            { label: "Furniture & Decor", value: "FURNITURE" }, // For tables/desks
                            { label: "Educational Resources", value: "EDUCATION" }, // For books
                            { label: "Electronics", value: "ELECTRONICS" },
                            { label: "Hygiene & Medical", value: "MEDICAL" },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Unit (kg, pcs, set) *"
                        name="unit"
                        required
                        placeholder="e.g. pcs"
                        defaultValue={item?.unit || ""}
                    />
                    {itemType === "ASSET" ? (
                         <SelectField
                            label="Initial Condition"
                            name="condition"
                            options={[
                                { label: "Brand New", value: "NEW" },
                                { label: "Good / Used", value: "GOOD" },
                                { label: "Needs Repair", value: "REPAIR" }
                            ]}
                        />
                    ) : (
                        <FormField
                            label="Low Stock Alert"
                            name="minimumStockLevel"
                            type="number"
                            placeholder="Notify when below..."
                            defaultValue={item?.minimumStockLevel || ""}
                        />
                    )}
                </div>

                {/* ✨ DYNAMIC FIELD: Asset Tracking */}
                {itemType === "ASSET" && (
                    <div className="p-5 bg-primary/5 border border-dashed border-primary/20 rounded-2xl animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-4">
                            <ClipboardList size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Asset Tracking</span>
                        </div>
                        <FormField
                            label="Location / Room"
                            name="location"
                            placeholder="e.g. Library, Girls Dormitory"
                            defaultValue={item?.location || ""}
                        />
                    </div>
                )}

                <FormField
                    label="Remarks / Brand"
                    name="description"
                    placeholder="Any specific details..."
                    defaultValue={item?.description || ""}
                />
            </div>

            <div className="shrink-0 flex justify-end gap-3.5 pt-6 border-t border-border bg-card">
                <Button type="button" variant="ghost" onClick={closeModal} className="font-bold text-xs uppercase tracking-wider">CANCEL</Button>
                <Button type="submit" disabled={isPending} className="px-10 font-black text-xs uppercase tracking-widest text-text-invert bg-primary h-11">
                    {isPending ? "SYNCING..." : (item ? "UPDATE RECORD" : "ADD TO REGISTRY")}
                </Button>
            </div>
        </form>
    );
};