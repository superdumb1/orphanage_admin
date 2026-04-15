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
        <div className="space-y-8 transition-colors duration-500">

            {/* REPORT SECTION - Already Themed */}
            <ReportCenter transactions={transactions} accounts={accounts} />

            {/* HEADER */}
            <div className="flex justify-between items-center px-2">
                {/* Typography: text-zinc-900 -> text-text */}
                <h2 className="text-xl md:text-2xl font-black text-text tracking-tighter">
                    Live Ledger
                </h2>

                {/* Button: bg-emerald-600 -> bg-success, removed hardcoded shadow */}
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-success hover:bg-success/90 text-text-invert font-black px-6 h-10 shadow-glow active:scale-95 transition-all"
                >
                    + New Transaction
                </Button>
            </div>

            {/* TABLE - Already Themed */}
            <TransactionTable
                transactions={transactions}
                onEdit={(txn) => setEditItem(txn)}
            />

            {/* ADD MODAL - Already Themed */}
            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                accounts={accounts}
            />

            {/* EDIT MODAL - Already Themed */}
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