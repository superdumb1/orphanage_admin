"use client";
import React, { useState } from "react";
import ReportCenter from "../Report/ReportCenter";
import TransactionTable from "./TransactionTable";
import { Button } from "@/components/atoms/Button";
import { AddTransactionModal } from "../../modals/modals/AddTransactionModal";
import { EditTransactionModal } from "../../modals/modals/EditTransactionsModal";

export default function FinanceLedger({ transactions, accounts, inventory }: any) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    return (
        <div className="space-y-6">

            {/* REPORT SECTION */}
            <ReportCenter transactions={transactions} accounts={accounts} />

            {/* HEADER */}
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-zinc-900 tracking-tighter">
                    Live Ledger
                </h2>

                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 shadow-emerald-200"
                >
                    + New Transaction
                </Button>
            </div>

            {/* TABLE */}
            <TransactionTable
                transactions={transactions}
                onEdit={(txn) => setEditItem(txn)}
            />

            {/* ADD MODAL */}
            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                accounts={accounts}
            />

            {/* EDIT MODAL */}
            {editItem && (
                <EditTransactionModal
                    transaction={editItem}
                    accounts={accounts}
                    onClose={() => setEditItem(null)}
                />
            )}
        </div>
    );
}