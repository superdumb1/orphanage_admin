"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { useUIModals } from "@/hooks/useUIModal";
import { Edit2, PackageOpen } from "lucide-react";

export default function InventoryDashboard({ items }: { items: any[] }) {
    const { openManageStock, openInventoryItemForm } = useUIModals();
    
    if (items.length === 0) return <EmptyInventoryState openForm={openInventoryItemForm} />;

    return (
        <div className="flex flex-col gap-6 transition-colors duration-500">
            
            {/* TOOLBAR */}
            <div className="flex justify-between items-center bg-card p-3 rounded-[1.5rem] border border-border shadow-sm">
                <h2 className="font-ubuntu text-[10px] font-black text-text-muted uppercase tracking-[0.3em] pl-4">
                    Warehouse Catalog
                </h2>
                <Button
                    onClick={() => openInventoryItemForm()}
                    className="btn-primary py-2 px-5 text-xs"
                >
                    + Register Item
                </Button>
            </div>

            {/* =========================================
                DESKTOP VIEW (3-Column Grid) 
                ========================================= */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <InventoryCard 
                        key={item._id} 
                        item={item} 
                        onEdit={openInventoryItemForm} 
                        onManage={openManageStock} 
                    />
                ))}
            </div>

            {/* =========================================
                MOBILE VIEW (Compact Alternating Rows) 
                ========================================= */}
            <div className="flex flex-col md:hidden overflow-hidden rounded-[2rem] border border-border shadow-sm">
                {items.map((item, index) => (
                    <div 
                        key={item._id} 
                        className={`p-5 flex flex-col gap-4 border-b border-border last:border-0 ${
                            index % 2 === 0 ? "bg-card" : "bg-alt"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="min-w-0">
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary/70 mb-1 block">
                                    {item.category}
                                </span>
                                <h3 className="font-black text-text text-lg leading-tight truncate capitalize">
                                    {item.name}
                                </h3>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-2">
                                {item.currentStock <= item.minimumStockLevel && (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded-md animate-pulse">
                                        Low
                                    </span>
                                )}
                                <button onClick={() => openInventoryItemForm({item})} className="p-1.5 text-text-muted">
                                    <Edit2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Stock Indicator */}
                        <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-border">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black font-mono text-text">{item.currentStock}</span>
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{item.unit}</span>
                            </div>
                            <Button
                                onClick={() => openManageStock({item})}
                                className="h-8 px-4 text-[9px] font-black uppercase tracking-widest bg-primary text-text-invert rounded-lg"
                            >
                                Manage
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================
   SUB-COMPONENTS
========================= */

const InventoryCard = ({ item, onEdit, onManage }: any) => (
    <div className="bg-card p-6 rounded-dashboard border border-border shadow-sm flex flex-col justify-between card-hover group transition-all">
        <div>
            <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                    {item.category}
                </span>
                <div className="flex items-center gap-2">
                    {item.currentStock <= item.minimumStockLevel && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-2.5 py-1 rounded-lg">
                            ⚠️ Low
                        </span>
                    )}
                    <button onClick={() => onEdit({item})} className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-primary transition-all">
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>
            <h3 className="font-black text-text text-xl tracking-tight group-hover:text-primary transition-colors capitalize">
                {item.name}
            </h3>
        </div>
        <div className="mt-8 flex items-end justify-between border-t border-border pt-5">
            <div>
                <p className="font-ubuntu text-[9px] text-text-muted font-black uppercase tracking-widest">In Stock</p>
                <p className="font-black font-mono text-3xl text-text tracking-tighter mt-1">
                    {item.currentStock} <span className="text-sm text-text-muted font-sans tracking-normal opacity-60">{item.unit}</span>
                </p>
            </div>
            <Button onClick={() => onManage({item})} className="btn-primary h-9 px-4 text-[10px]">Manage</Button>
        </div>
    </div>
);

function EmptyInventoryState({ openForm }: any) {
    return (
        <div className="py-20 text-center bg-card border border-border rounded-[2rem] shadow-glow flex flex-col items-center gap-4">
            <PackageOpen size={48} className="text-text-muted opacity-20" />
            <div>
                <p className="text-text font-bold text-lg">Your warehouse is empty.</p>
                <p className="text-sm text-text-muted">Register an item to begin tracking stock.</p>
            </div>
            <Button onClick={openForm} className="btn-primary">+ Register Item</Button>
        </div>
    );
}