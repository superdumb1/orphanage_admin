"use client";
import React from "react";
import { AddTransactionModal } from "./AddTransactionModal";
import { ManageStockModal } from "../ManageStockModal/ManageStockModal";
import { TTransaction, TAccountHead } from "@/types/Transaction";

interface EditDispatcherProps {
    transaction: TTransaction | null;
    accounts: TAccountHead[];
    onClose: () => void;
}

/**
 * EditTransactionModal: Theme-Aware Controller
 * * This component acts as a logic gate. It doesn't need 'bg-card' or 
 * 'border-border' because it renders child modals that handle their 
 * own themed shells.
 */
export const EditTransactionModal: React.FC<EditDispatcherProps> = ({
    transaction,
    accounts,
    onClose
}) => {
    // 1. Safety check: prevent modal flicker or hydration errors if transaction is cleared
    if (!transaction) return null;

    // 2. Logic Gate: Detect if this is a specialized Inventory transaction
    const isInventoryTxn = Boolean(transaction.logId);

    /**
     * INVENTORY FLOW
     * Dispatches to the themed Stock Management modal.
     */
    if (isInventoryTxn) {
        return (
            <ManageStockModal
                isOpen={true}
                onClose={onClose}
                item={transaction.logId} 
                accounts={accounts}
            />
        );
    }

    return (
        <AddTransactionModal
            isOpen={true}
            onClose={onClose}
            transaction={transaction}
            accounts={accounts}
        />
    );
};