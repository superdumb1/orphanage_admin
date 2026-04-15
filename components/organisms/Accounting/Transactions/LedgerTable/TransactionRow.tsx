"use client";
import React from "react";
import { deleteTransaction } from "@/app/actions/transactions";

export default function TransactionRow({
    txn,
    onEdit
}: {
    txn: any;
    onEdit: (t: any) => void;
}) {
    const isIncome = txn.type === "INCOME";

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(txn._id);
        }
    };

    return (
        <tr className="group text-xs hover:bg-zinc-50/60 transition-colors">

            {/* DATE */}
            <td className="p-4 pl-6 text-zinc-500 font-medium">
                {new Date(txn.date).toLocaleDateString("en-GB")}
            </td>

            {/* ACCOUNT */}
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${
                            isIncome ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                    />
                    <span className="font-bold text-zinc-800">
                        {txn.accountHead?.name || "Unknown"}
                    </span>
                </div>
            </td>

            {/* DESCRIPTION */}
            <td className="p-4 text-zinc-600 truncate max-w-[220px]">
                {txn.description}
            </td>

            {/* AMOUNT */}
            <td
                className={`p-4 text-right font-black font-mono ${
                    isIncome ? "text-emerald-600" : "text-rose-600"
                }`}
            >
                <span className="text-[10px] mr-1">
                    {isIncome ? "+" : "-"}
                </span>
                {Number(txn.amount).toLocaleString()}
            </td>

            {/* ACTIONS */}
            <td className="p-4 pr-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                    <button
                        onClick={() => onEdit(txn)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>
            </td>
        </tr>
    );
}