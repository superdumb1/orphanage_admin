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

export const EditTransactionModal: React.FC<EditDispatcherProps> = ({
    transaction,
    accounts,
    onClose
}) => {
    if (!transaction) return null;

    const isInventoryTxn = Boolean(transaction.logId);

    /**
     * INVENTORY FLOW
     */
    if (isInventoryTxn) {
        return (
            <ManageStockModal
                isOpen={true}
                onClose={onClose}
                item={transaction.logId} // ✅ FIXED: pass actual inventory item/log
                accounts={accounts}
            />
        );
    }

    /**
     * FINANCIAL FLOW
     */
    return (
        <AddTransactionModal
            isOpen={true}
            onClose={onClose}
            transaction={transaction}
            accounts={accounts}
        />
    );
};