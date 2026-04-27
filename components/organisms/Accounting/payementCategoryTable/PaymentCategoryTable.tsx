"use client";
import React from "react";
import { Shield, Trash2, Edit3, Circle } from "lucide-react";
import { deletePaymentCategory } from "@/app/actions/addCategory";

export function PaymentCategoryTable({ initialData }: { initialData: any[] }) {
    
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure? This could orphan existing transactions.")) {
            const res = await deletePaymentCategory(id);
            if (!res.success) alert(res.error);
        }
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-shaded border-b border-border">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Category Name</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Identifier</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Type</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
                {initialData.map((cat) => (
                    <tr key={cat._id} className="hover:bg-shaded/30 transition-colors group">
                        <td className="p-5">
                            <Circle size={8} className={cat.isActive ? "fill-success text-success" : "fill-text-muted text-text-muted"} />
                        </td>
                        <td className="p-5">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-text">{cat.name}</span>
                                {cat.isSystem && <Shield size={12} className="text-primary opacity-50" />}
                            </div>
                        </td>
                        <td className="p-5 font-mono text-[10px] text-text-muted">{cat.identifier}</td>
                        <td className="p-5">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-surface border border-border">
                                {cat.type}
                            </span>
                        </td>
                        <td className="p-5 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2 hover:bg-primary/10 rounded-lg text-text-muted hover:text-primary transition-all">
                                    <Edit3 size={16} />
                                </button>
                                {!cat.isSystem && (
                                    <button 
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 hover:bg-danger/10 rounded-lg text-text-muted hover:text-danger transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}