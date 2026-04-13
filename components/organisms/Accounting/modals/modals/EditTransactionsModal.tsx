"use client";
import React from "react";
import { Button } from "@/components/atoms/Button";
import { AddTransactionModal } from "./AddTransactionModal";
import { ManageStockModal } from "../ManageStockModal/ManageStockModal";
import { TTransaction ,TAccountHead} from "@/types/Transaction";

interface EditDispatcherProps {
    transaction: TTransaction|null
    accounts: TAccountHead[];
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