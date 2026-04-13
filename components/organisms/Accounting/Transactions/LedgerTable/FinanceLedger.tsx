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
            <ReportCenter transactions={transactions} accounts={accounts} />

            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-zinc-900 tracking-tighter">Live Ledger</h2>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-zinc-900 text-white font-bold px-6">+ New</Button>
            </div>

            <TransactionTable
                transactions={transactions}
                onEdit={(txn) => setEditItem(txn)}
            />

            {/* Standard Add Modal */}
            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                accounts={accounts}
            />

            {/* Edit Modal - Pass the 'editItem' to pre-fill the form */}
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