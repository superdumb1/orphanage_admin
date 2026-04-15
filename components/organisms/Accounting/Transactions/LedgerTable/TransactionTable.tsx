"use client";
import React from "react";
import TransactionRow from "./TransactionRow";

export default function TransactionTable({
    transactions,
    onEdit
}: {
    transactions: any[];
    onEdit: (t: any) => void;
}) {
    return (
        // Container: bg-white -> bg-card, border-zinc-200 -> border-border, shadow-sm -> shadow-glow
        <div className="bg-card border border-border rounded-dashboard shadow-glow overflow-x-auto transition-colors duration-500">

            <table className="w-full text-left whitespace-nowrap">

                {/* HEADER: bg-zinc-50 -> bg-shaded, text-zinc-400 -> text-text-muted */}
                <thead className="bg-shaded/50 border-b border-border text-text-muted font-black uppercase text-[9px] tracking-[0.15em]">
                    <tr>
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Account Head</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Amount (NPR)</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>

                {/* BODY: divide-zinc-100 -> divide-border */}
                <tbody className="divide-y divide-border/50">

                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-16 text-center">
                                {/* Empty State Typography: text-zinc-400 -> text-text-muted */}
                                <div className="text-text-muted font-bold text-sm tracking-wide">
                                    No transactions found
                                </div>
                                <div className="text-[10px] text-text-muted/50 uppercase tracking-widest mt-1 font-black">
                                    Start by adding a new income or expense
                                </div>
                            </td>
                        </tr>
                    ) : (
                        transactions.map((txn) => (
                            <TransactionRow
                                key={txn._id}
                                txn={txn}
                                onEdit={onEdit}
                            />
                        ))
                    )}

                </tbody>

            </table>
        </div>
    );
}