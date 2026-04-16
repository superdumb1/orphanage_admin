"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { useUIModals } from "@/hooks/useUIModal";
import { Edit2 } from "lucide-react"; // Import the Edit icon

export default function InventoryDashboard({
    items,
}: {
    items: any[];
}) {
    const { openManageStock, openInventoryItemForm } = useUIModals();
    
    return (
        <div className="space-y-8 transition-colors duration-500">
            
            {/* ACTION HEADER */}
            <div className="flex justify-end bg-card p-5 rounded-dashboard border border-border shadow-glow">
                <Button
                    onClick={() => openInventoryItemForm()}
                    className="btn-primary"
                >
                    + Register New Item
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    // EMPTY STATE
                    <div className="col-span-full py-20 text-center bg-shaded/50 border border-dashed border-border rounded-dashboard shadow-inner">
                        <p className="text-text-muted font-bold text-lg tracking-tight">
                            Your inventory catalog is empty.
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted opacity-60 mt-2">
                            Click "Register New Item" to start building your warehouse.
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item._id}
                            // CARD
                            className="bg-card p-6 rounded-dashboard border border-border shadow-sm flex flex-col justify-between card-hover transition-all duration-300 group"
                        >
                            {/* Top Section */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    {/* CATEGORY BADGE */}
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                                        {item.category}
                                    </span>

                                    {/* RIGHT SIDE BADGES / ACTIONS */}
                                    <div className="flex items-center gap-2">
                                        {/* LOW STOCK BADGE */}
                                        {item.currentStock <= item.minimumStockLevel && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-2.5 py-1 rounded-lg animate-pulse">
                                                ⚠️ Low Stock
                                            </span>
                                        )}
                                        
                                        {/* EDIT BUTTON (Hidden until hover) */}
                                        <button
                                            onClick={() => openInventoryItemForm(item)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                            title="Edit Item Details"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-black text-text text-xl tracking-tight group-hover:text-primary transition-colors pr-6">
                                    {item.name}
                                </h3>
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-8 flex items-end justify-between border-t border-border/50 pt-5">
                                <div>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.15em] opacity-80">
                                        Current Stock
                                    </p>

                                    <p className="font-black font-mono text-3xl text-text tracking-tighter mt-1">
                                        {item.currentStock}{" "}
                                        <span className="text-sm text-text-muted font-sans tracking-normal opacity-60">
                                            {item.unit}
                                        </span>
                                    </p>
                                </div>

                                {/* MANAGE BUTTON */}
                                <Button
                                    variant="ghost"
                                    onClick={() => openManageStock(item)}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 h-9 shadow-sm rounded-xl transition-all active:scale-95"
                                >
                                    Manage
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}