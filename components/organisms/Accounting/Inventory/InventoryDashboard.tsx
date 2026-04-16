"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddInventoryModal } from "../../../modals/finances/inventory/AddInventoryModal";
import { ManageStockModal } from "../../../modals/finances/inventory/ManageStockModal";

export default function InventoryDashboard({
    items,
    accounts,
}: {
    items: any[];
    accounts: any[];
}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [manageModalItem, setManageModalItem] = useState<any | null>(null);

    return (
        <div className="space-y-8 transition-colors duration-500">
            
            {/* ACTION HEADER: bg-white -> bg-card, border-zinc -> border-border */}
            <div className="flex justify-end bg-card p-5 rounded-dashboard border border-border shadow-glow">
                {/* Button: Replaced manual blue styles with global btn-primary utility */}
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary"
                >
                    + Register New Item
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    // EMPTY STATE: bg-zinc -> bg-shaded, border-zinc -> border-border
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
                            // CARD: bg-white -> bg-card, border-zinc -> border-border, added card-hover
                            className="bg-card p-6 rounded-dashboard border border-border shadow-sm flex flex-col justify-between card-hover transition-all duration-300 group"
                        >
                            {/* Top */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    {/* CATEGORY BADGE: blue-500 -> primary */}
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                                        {item.category}
                                    </span>

                                    {/* LOW STOCK BADGE: rose-600 -> danger */}
                                    {item.currentStock <= item.minimumStockLevel && (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-2.5 py-1 rounded-lg animate-pulse">
                                            ⚠️ Low Stock
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-black text-text text-xl tracking-tight group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>
                            </div>

                            {/* Bottom */}
                            <div className="mt-8 flex items-end justify-between border-t border-border/50 pt-5">
                                <div>
                                    {/* MICRO-CAPS typography for labels */}
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

                                {/* MANAGE BUTTON: Upgraded to a themed ghost variant */}
                                <Button
                                    variant="ghost"
                                    onClick={() => setManageModalItem(item)}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 h-9 shadow-sm rounded-xl transition-all active:scale-95"
                                >
                                    Manage
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals - Already themed in previous steps */}
            <AddInventoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ManageStockModal
                key={`ManageStockModal-${manageModalItem?._id || "closed"}`}
                isOpen={manageModalItem !== null}
                onClose={() => setManageModalItem(null)}
                item={manageModalItem}
                accounts={accounts}
            />
        </div>
    );
}