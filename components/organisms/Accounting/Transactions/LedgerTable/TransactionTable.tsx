"use client";
import React from "react";
import TransactionRow from "./TransactionRow";

export default function TransactionTable({ transactions, onEdit }: { transactions: any[], onEdit: (t: any) => void }) {
    return (
        <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-black uppercase text-[9px] tracking-[0.15em]">
                    <tr>
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Account Head</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Amount (NPR)</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {transactions.map((txn) => (
                        <TransactionRow key={txn._id} txn={txn} onEdit={onEdit} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}