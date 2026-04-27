"use client";
import React, { useState } from "react";
import { Box, Archive } from "lucide-react";
import { ConsumableItemForm } from "./InventoryItemFormConsumable";
import { FixedAssetItemForm } from "./InventoryItemFormAssets";

export const InventoryItemForm = ({ item, closeModal }: { item?: any; closeModal: () => void; }) => {
    // If we're editing an item, lock the type. If new, default to CONSUMABLE.
    const [itemType, setItemType] = useState<"CONSUMABLE" | "ASSET">(item?.type || "CONSUMABLE");

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto">
            
            {/* PROTOCOL SELECTOR - Only show if creating new, or just as a label if editing */}
            <div className="px-4 pt-2 pb-6 border-b border-border/50 mb-6">
                <div className="flex bg-shaded p-1.5 rounded-2xl border border-border shadow-inner max-w-md mx-auto">
                    <button
                        type="button"
                        disabled={!!item} // Prevent changing type during edit
                        onClick={() => setItemType("CONSUMABLE")}
                        className={`flex-1 py-3 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                            itemType === "CONSUMABLE" 
                            ? "bg-primary text-text-invert shadow-glow-primary scale-[1.02]" 
                            : "text-text-muted hover:text-text opacity-50"
                        }`}
                    >
                        <Box size={16} /> Consumables
                    </button>
                    <button
                        type="button"
                        disabled={!!item} // Prevent changing type during edit
                        onClick={() => setItemType("ASSET")}
                        className={`flex-1 py-3 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                            itemType === "ASSET" 
                            ? "bg-secondary text-text-invert shadow-glow-secondary scale-[1.02]" 
                            : "text-text-muted hover:text-text opacity-50"
                        }`}
                    >
                        <Archive size={16} /> Fixed Assets
                    </button>
                </div>
                {item && (
                    <p className="text-center text-[9px] font-bold text-text-muted uppercase mt-3 tracking-widest">
                        Type is locked for existing records
                    </p>
                )}
            </div>

            {/* DYNAMIC FORM INJECTION */}
            <div className="flex-1 min-h-0">
                {itemType === "CONSUMABLE" ? (
                    <ConsumableItemForm item={item} closeModal={closeModal} />
                ) : (
                    <FixedAssetItemForm item={item} closeModal={closeModal} />
                )}
            </div>
        </div>
    );
};