"use client";
import React, { useState } from "react";
import { Box, Archive, Lock } from "lucide-react";
import { ConsumableItemForm } from "./InventoryItemFormConsumable";
import { FixedAssetItemForm } from "./InventoryItemFormAssets";
import { Button } from "@/components/atoms/Button";

export const InventoryItemForm = ({ item, closeModal }: { item?: any; closeModal: () => void; }) => {
    // If editing, lock type. If new, default to CONSUMABLE.
    const [itemType, setItemType] = useState<"CONSUMABLE" | "ASSET">(item?.type || "CONSUMABLE");

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto animate-in fade-in duration-500">
            
            {/* PROTOCOL SELECTOR */}
            <div className="px-4 pt-2 pb-8 border-b border-border/50 mb-8">
                <div className="flex bg-shaded p-2 rounded-[1.5rem] border border-border shadow-inner max-w-md mx-auto relative">
                    
                    {/* Consumables Toggle */}
                    <Button
                        type="button"
                        onClick={() => setItemType("CONSUMABLE")}
                        disabled={!!item}
                        className={`flex-1 h-12 gap-3 !rounded-xl transition-all duration-500 ${
                            itemType === "CONSUMABLE" 
                            ? "bg-primary text-text-invert shadow-glow" 
                            : "bg-transparent text-text-muted hover:text-text border-none shadow-none opacity-60"
                        }`}
                    >
                        <Box size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Consumables</span>
                    </Button>

                    {/* Fixed Assets Toggle */}
                    <Button
                        type="button"
                        onClick={() => setItemType("ASSET")}
                        disabled={!!item}
                        className={`flex-1 h-12 gap-3 !rounded-xl transition-all duration-500 ${
                            itemType === "ASSET" 
                            ? "bg-accent text-text-invert shadow-glow" 
                            : "bg-transparent text-text-muted hover:text-text border-none shadow-none opacity-60"
                        }`}
                    >
                        <Archive size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Fixed Assets</span>
                    </Button>
                </div>

                {item && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-80">
                        <Lock size={10} className="text-primary" />
                        Record Type Locked
                    </div>
                )}
            </div>

            {/* DYNAMIC FORM INJECTION */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                {itemType === "CONSUMABLE" ? (
                    <ConsumableItemForm item={item} closeModal={closeModal} />
                ) : (
                    <FixedAssetItemForm item={item} closeModal={closeModal} />
                )}
            </div>
        </div>
    );
};