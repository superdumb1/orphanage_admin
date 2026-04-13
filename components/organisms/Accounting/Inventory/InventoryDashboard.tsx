"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AddInventoryModal } from "../modals/AddInventoryModal";
import { ManageStockModal } from "../modals/ManageStockModal/ManageStockModal";

export default function InventoryDashboard({ items, accounts }: { items: any[], accounts: any[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [manageModalItem, setManageModalItem] = useState<any | null>(null);

    return (
        <div className="space-y-6">
            {/* Header Action Bar */}
            <div className="flex justify-end bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md">
                    + Register New Item
                </Button>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-white border border-zinc-200 shadow-sm rounded-3xl">
                        <p className="text-zinc-500 font-medium">Your inventory catalog is empty.</p>
                        <p className="text-xs text-zinc-400 mt-2">Click "Register New Item" to start building your warehouse.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item._id} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                                        {item.category}
                                    </span>
                                    {/* Low Stock Warning Badge */}
                                    {item.currentStock <= item.minimumStockLevel && (
                                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md animate-pulse">
                                            Low Stock
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-zinc-900 text-lg">{item.name}</h3>
                            </div>

                            <div className="mt-6 flex items-end justify-between border-t border-zinc-100 pt-4">
                                <div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Current Stock</p>
                                    <p className="font-black font-mono text-3xl text-zinc-800 tracking-tighter">
                                        {item.currentStock} <span className="text-sm text-zinc-500 tracking-normal">{item.unit}</span>
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setManageModalItem(item)} 
                                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 shadow-sm rounded-xl"
                                >
                                    Manage
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Mount the Modal */}
            <AddInventoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
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