"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { ITransaction } from "@/models/Transaction";
import { IAccountHead } from "@/models/AccountHead";
import { AddTransactionModal } from "./AddTransactionModal";
import { ManageStockModal } from "../../Inventory/ManageStockModal/ManageStockModal";
import InventoryLog from "@/models/InventoryLog";

interface EditDispatcherProps {
    transaction: ITransaction | null;
    accounts: IAccountHead[];
    onClose: () => void;
}

export const EditTransactionModal: React.FC<EditDispatcherProps> = ({
    transaction,
    accounts,
    onClose
}) => {
    if (!transaction) return null;
    

    const isInventoryTxn = !!transaction.logId;
    if (isInventoryTxn) return <ManageStockModal  isOpen={true} onClose={onClose} item={transaction} accounts={accounts}/>

    return (
        <AddTransactionModal
            isOpen={true}
            onClose={onClose}
            transaction={transaction}
            accounts={accounts}
        />
    );
};