"use client";
import React from "react";
import { deleteTransaction } from "@/app/actions/transactions";

export default function TransactionRow({ txn, onEdit }: { txn: any, onEdit: (t: any) => void }) {
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(txn._id);
        }
    };

    return (
        <tr className="hover:bg-zinc-50/50 transition-colors group text-xs">
            <td className="p-4 pl-6 text-zinc-500 font-medium">{new Date(txn.date).toLocaleDateString('en-GB')}</td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${txn.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className="font-bold text-zinc-800">{txn.accountHead?.name || 'Unknown'}</span>
                </div>
            </td>
            <td className="p-4 text-zinc-700 truncate max-w-[200px]">{txn.description}</td>
            <td className={`p-4 text-right font-black font-mono ${txn.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {txn.type === 'INCOME' ? '+' : '-'} {txn.amount.toLocaleString()}
            </td>
            <td className="p-4 pr-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(txn)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors">✏️</button>
                    <button onClick={handleDelete} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors">🗑️</button>
                </div>
            </td>
        </tr>
    );
}